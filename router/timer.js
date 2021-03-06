const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');

const {populateVariables, userLibraryLoader, noteLoader, bookLoader, timerLoader} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {Note} = require('../models/note');
const {Timer} = require('../models/timer');
const {authenticatedOnly} = require('./authentication');

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

router.get('/timer', authenticatedOnly, formParser, userLibraryLoader, function(req, res) {
    //authenticatedOnly should use passport and get me the user
    //then I should be able to get user's library
    //then populate it with books from library
    //then get book titles from the book
    res.render('timer', populateVariables(req, {books: req.user.library}));
});

router.post('/timer', authenticatedOnly, formParser, userLibraryLoader, function(req, res) {
    if (req.body.minutes < 1 || req.body.minutes === null) {
        req.flash('error', 'Please enter a positive integer!');
        res.redirect('/timer');
    }
    //find book in library that matches book in Book db
    console.log(moment().add(req.body.minutes, 'm'));
    if (req.user.ownBook(req.body["book-to-read"])) {
        let endTime = moment().add(req.body.minutes, 'm');
        Timer.create({
        user: req.user,
        book: req.body["book-to-read"],
        endTimeUnix: endTime.unix(),
        endTimeString: endTime.toISOString(),
    })
    .then(timer => {
        res.redirect('/timer/' + timer.id);
    });
    } else {
        res.redirect('/timer/');
    }
});

router.get('/timer/:timerId', authenticatedOnly, timerLoader, function(req, res) {
    // Need a checker when the timer has passed
    // Check when end time is actual time
    console.log(req.timer.endTimeString);
    let readingSeconds = req.timer.endTimeUnix - moment().unix();
    Timer.findOne({_id: req.params.timerId})
    .then(timer => {
        console.log("Book: " + timer.book);
        res.render('countdownTimer', populateVariables(req, {
            time: readingSeconds, 
            book: timer.book, 
            endTime: req.timer.endTimeString, 
            layout: "layoutTimer.hbs"
        }));
    });
});

// When countdown reaches 0, I want to redirect them to the notes page, with the option to write notes for whichever book they read. 
// If they decide to stop the timer, then they should be directed to the notes page to write a note for however many books they have

module.exports = {router};