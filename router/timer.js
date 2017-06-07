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

    // console.log("Get router: " + req.user);
    // console.log("User: " + req.user);
    // console.log("Library: " + req.user.library);
    res.render('timer', populateVariables(req, {books: req.user.library}));
});

router.post('/timer', authenticatedOnly, formParser, userLibraryLoader, function(req, res) {
    // TODO: check for if minutes is null or nothing was entered
    if (req.body.minutes < 1 || req.body.minutes === null) {
        req.flash('error', 'Please enter a positive integer!');
        res.redirect('/timer');
        // TODO Set up alert here
    }
    //find book in library that matches book in Book db
    console.log("Req.user: " + req.user);
    console.log("Book to read: " + req.body["book-to-read"]);
    console.log("Own Book? " + req.user.ownBook(req.body["book-to-read"]));
    if (req.user.ownBook(req.body["book-to-read"])) {
        Timer.create({
        user: req.user,
        book: req.body["book-to-read"],
        endTime: moment().add(req.body.minutes, "m").unix(),
    })
    .then(timer => {
        res.redirect('/timer/' + timer.id);
    });
    } else {
        // TODO use Express flash
        res.redirect('/timer/');
    }
    // .then(function(timer) {
    // console.log(typeof moment()); moment is an object
    //     console.log(timer);
    // res.send("This got to here");
    // res.redirect('/timer/' + timer.id);
    // });
});

router.get('/timer/:timerId', authenticatedOnly, timerLoader, function(req, res) {
    // Need a checker when the timer has passed
    // Check when end time is actual time
    let readingSeconds = req.timer.endTime - moment().unix();
    Timer.findOne({_id: req.params.timerId})
    .then(timer => {
        console.log("Book: " + timer.book);
        res.render('countdownTimer', populateVariables(req, {time: readingSeconds, book: timer.book, layout: "layoutTimer.hbs"}));

    });
});



// When countdown reaches 0, I want to redirect them to the notes page, with the option to write notes for whichever book they read. 
// If they decide to stop the timer, then they should be directed to the notes page to write a note for however many books they have

module.exports = {router};