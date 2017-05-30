const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const flash = require('express-flash');

const {populateVariables, UserLibraryLoader, noteLoader, bookLoader, timerLoader} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {Note} = require('../models/note');
const {authenticatedOnly} = require('./authentication');


const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

router.get('/notes/:bookId', authenticatedOnly, formParser, bookLoader, function(req, res) {    
    const userOwns = req.isAuthenticated() ? 
    req.user.ownBook(req.params.bookId) : false;
    // Match note to book that has note
    console.log(req.book);
    // Sort might not work correctly (e.g. 5th vs 21st, 
    // 5th might be sorted higher in descending order when it shouldn't)
    Note.find({book : req.book.id}).sort('-dateCreated')
    .then(function(note) {
        req.flash('info', 'Welcome');
        res.render("note", populateVariables(req, {bookName: req.book.title, owned: userOwns, note: note}));
    });
});


router.get('/notes/:noteId/delete', authenticatedOnly, noteLoader, function(req, res) {
    // noteLoader defines req.note
    res.render("confirmDelete", populateVariables(req, {note: req.note}));
});

function emptyContent(req, res, next) {
    if (req.body.content.replace(/\s+/, "") === "") {
        res.status(400).send("Content was empty");
    }
    else {
        next();
    }
}

// TODO delete route to delete note, redirect to note page
router.post('/notes/:noteId/delete', authenticatedOnly, formParser, function(req, res) {
    console.log("post operation");
    // Find ID of book, then delete note, then redirect to page of note for book
    // Check which page user read up to, then check whether that's larger than user's previous number
    let bookOfNote = "";
    Note.findByIdAndRemove(req.params.noteId)
    .then(function(note) {
        res.redirect("/notes/" + note.book);
    });
});

router.post('/notes/:bookId', authenticatedOnly, formParser, bookLoader, emptyContent, function(req, res) {
    // console.log(req.body);
    // Then put book in note so that it could be referenced, possibly by populate
    console.log(req.book);
    Note.create({
        book: req.book,
        user: req.user,
        content: req.body.content,
        endPage: req.body["end-page"],
        dateCreated: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
    .then(note => {
        res.redirect('/notes/'+ note.book.id);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

// TODO work on getting and editing notes
router.get('/notes/:noteId/edit', authenticatedOnly, function(req, res) {
    res.send(req.params.noteId);
});

router.put('/notes/:noteId/edit', authenticatedOnly, formParser, function(req, res) {
    Note.findByIdAndUpdate(req.params.noteId, {content: 'req.params.SOMETHING'})
    .then(notes => {
        // redirect to notes page with bookId
        //res.redirect('/notes/')
    });
});

module.exports = {router, bookLoader, noteLoader};