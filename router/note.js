const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {populateVariables} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {Note} = require('../models/note');
const {authenticatedOnly} = require('./authentication');


const router = express.Router();
const formParser = bodyParser.urlencoded();

// Middleware
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

router.get('/notes/:bookId', authenticatedOnly, formParser, bookLoader, function(req, res) {    
    const userOwns = req.isAuthenticated() ? 
    req.user.ownBook(req.params.bookId) : false;
    Note.find({})
    .then(function(note) {
        res.render("note", populateVariables(req, {bookName: req.book.title, owned: userOwns, note: note}));
    });
});

function emptyContent(req, res, next) {
    if (req.body.content.replace(/\s+/, "") === "") {
        res.status(400).send("Content was empty");
    }
    else {
        next();
    }
}

router.post('/notes/:bookId', authenticatedOnly, formParser, bookLoader, emptyContent, function(req, res) {
    console.log(req.body);
    // Then put book in note so that it could be referenced, possibly by populate
    Note.create({
        book: req.book,
        user: req.user,
        content: req.body.content,
        endPage: req.body["end-page"],
        dateCreated: Date().toLocaleString()
    })
    .then(note => {
        // For now, show json that it worked
        res.status(201).json(note);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};