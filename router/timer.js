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
    console.log(Book.findOne({id: req.user.library[0].myBook}).title);
    res.render('timer', populateVariables(req, {books: req.user.library}));
});

router.post('/timer', authenticatedOnly, formParser, function(req, res) {
    console.log(typeof req.body.minutes);
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