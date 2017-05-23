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
        //console.log(req.user.library);
        // User.findById(req.user.id).populate('library.myBook')
        // .then(user => { 
        // req.user = user;
        // })
        // .then(user => {
            // console.log("After middleware: " + req.user.library);
            console.log("Get router: " + req.user);
            res.render('timer', populateVariables(req, {books: req.user.library}));
        // });
});

router.post('/timer', authenticatedOnly, formParser, userLibraryLoader, function(req, res) {
    console.log("Post router: " + req.user.library);
    // TODO: check for if minutes is null or nothing was entered
    // if (req.body.minutes < 1 || req.body.minutes === null) {

    // }
    // console.log(req.user);
    // console.log(req.body);
    // Book.find({title: req.body.title})
    // .then(function (book) {
    //     // body...
    //     User.find()
    // });
    // // Timer.create({
    //     user: req.user,
    //     book: req.book,
    //     endTime: moment().add(req.body.minutes, "m"),
    // })
    // .then(function(timer) {
    // // console.log(typeof moment()); moment is an object
    //     console.log(timer);
        res.send("This got to here");
        // res.redirect('/timer/' + timer.id);
    // });
});

router.get('/timer/:timerId', authenticatedOnly, timerLoader, function(req, res) {
    // let readingMinutes = moment(timer.endTime) - moment();
    console.log(typeof moment());
    console.log(readingMinutes);
    res.render('countdownTimer', populateVariables(req, {time: 6000}));
});

// When countdown reaches 0, I want to redirect them to the notes page, with the option to write notes for whichever book they read. 
// If they decide to stop the timer, then they should be directed to the notes page to write a note for however many books they have

module.exports = {router};