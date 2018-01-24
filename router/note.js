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
    req.user.ownBookWithoutUserLibraryLoader(req.params.bookId) : false;
    // Match note to book that has note
    // Sort might not work correctly (e.g. 5th vs 21st, 
    // 5th might be sorted higher in descending order when it shouldn't)
    Book.findById(req.params.bookId)
    .then(book => {
        req.user.farthestNote(book)
        .then(note => {
            if (note === null) {
                book.progress = 0;
                book.percentage = 0;
                book.save();
            } else {
                book.progress = note.endPage;
                book.percentage = (100 * book.progress)/book.pages;
                book.save();
            }
        });
    })
    .then(test => {
        Note.find({book : req.book.id, user: req.user}).sort('-dateCreated')
        .then(function(note) {
            res.render("note", populateVariables(req, {bookName: req.book.title, owned: userOwns, note: note, title: "Notes"}));
        });
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
    // Find ID of book, then delete note, then redirect to page of note for book
    // Check which page user read up to, then check whether that's larger than user's previous number
    let bookOfNote = "";
    Note.findByIdAndRemove(req.params.noteId)
    .then(function(note) {
        req.flash('error', "Note deleted");
        res.redirect("/notes/" + note.book);
    });
});

router.post('/notes/:bookId', authenticatedOnly, formParser, bookLoader, emptyContent, function(req, res) {
    // Then put book in note so that it could be referenced, possibly by populate
    Note.create({
        book: req.book,
        user: req.user,
        content: req.body.content,
        endPage: req.body["end-page"],
        dateCreated: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
    .then(note => {
        req.flash("success", "Note created!");
        res.redirect('/notes/'+ note.book.id);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

// TODO work on editing notes
router.get('/notes/:noteId/edit', authenticatedOnly, function(req, res) {
    Note.findById({_id: req.params.noteId})
    .then(note => {
        res.render('confirmEdit', populateVariables(req, {note: note, title: "Edit Notes"}));
    });
    
});

// Editing notes
router.post('/notes/:noteId/edit', authenticatedOnly, formParser, function(req, res) {
    Note.findByIdAndUpdate(req.params.noteId, {content: req.body.content})
    .populate('book')
    .then(note => {
        // redirect to notes page with bookId
        req.flash('info', 'Note was edited!');
        res.redirect('/notes/' + note.book.id);
    });
});

module.exports = {router, bookLoader, noteLoader};