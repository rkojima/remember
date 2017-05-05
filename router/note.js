const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');

const {populateVariables} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {Note} = require('../models/note');
const {authenticatedOnly} = require('./authentication');


const router = express.Router();
const formParser = bodyParser.urlencoded();

// Middleware for getting the book object
function bookLoader(req, res, next) {
    if (!req.params.bookId) {
        res.status(400).send("Please send valid book ID");
    }
    else {
        // Load book first
        Book.findById(req.params.bookId)
        .then(function(book) {
            req.book = book;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}

// Middleware for getting the note object

function noteLoader(req, res, next) {
    if (!req.params.noteId) {
        res.status(400).send("Please send valid note ID");
    }
    else {
        // Load book first
        Note.findById(req.params.noteId)
        .then(function(note) {
            // How it becomes available to user, like how passport works to make user available
            req.note = note;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}


router.get('/notes/:bookId', authenticatedOnly, formParser, bookLoader, function(req, res) {    
    const userOwns = req.isAuthenticated() ? 
    req.user.ownBook(req.params.bookId) : false;
    Note.find({}).sort('-dateCreated')
    .then(function(note) {
        res.render("note", populateVariables(req, {bookName: req.book.title, owned: userOwns, note: note}));
    });
});


router.get('/note/:noteId/delete', authenticatedOnly, noteLoader, function(req, res) {
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

router.post('/notes/:bookId', authenticatedOnly, formParser, bookLoader, emptyContent, function(req, res) {
    // console.log(req.body);
    // Then put book in note so that it could be referenced, possibly by populate
    console.log(req.book);
    Note.create({
        book: req.book,
        user: req.user,
        content: req.body.content,
        endPage: req.body["end-page"],
        dateCreated: moment().format('MMMM Do YYYY, h:mm a')
    })
    .then(note => {
        res.redirect('/notes/'+ note.book);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};