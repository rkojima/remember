const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {populateVariables} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {Note} = require('../models/note');
const {authenticatedOnly} = require('./authentication');

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

router.get('/timer', authenticatedOnly, formParser, function(req, res) {
        //authenticatedOnly should use passport and get me the user
        //then I should be able to get user's library
        //then populate it with books from library
        //then get book titles from the book
    let titleArray = {};
        // Book.find(req.user.library)
        // .then(book => {
        //     console.log("Test 1 " + book);
        // });
        Book.find(req.user.library)
        .populate('myBook')
        .then(function(here) {
            res.render('timer', populateVariables(req, {books: here}));
        });

        // console.log("Test 3" + req.user);
        // req.user.library.forEach(function(book) {
        //     console.log(book.myBook);
        // });
});

router.post('/timer', authenticatedOnly, formParser, function(req, res) {
    console.log(req.body.minutes);
    console.log(req.body["book-to-read"]);
    // Timer.create({
    //     user: req.user,
    //     book: 
    //     endTime:
    // });
    res.render('countdownTimer', populateVariables(req, {time: parseInt(req.body.minutes * 60)}));
});

// When countdown reaches 0, I want to redirect them to the notes page, with the option to write notes for whichever book they read. 
// If they decide to stop the timer, then they should be directed to the notes page to write a note for however many books they have

module.exports = {router};