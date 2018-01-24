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

router.use(function(req, res, next) {
    res.locals.demo = true;
    next();
});

router.get('/demo/login', function(req, res) {
    res.render('index', populateVariables(req, {demo: "value='demo'", title: "Remember Demo"}));
})

router.get('/demo/dashboard', function(req, res) {
    let demoBook = {
        id: "demo-book",
        title: "Demo Book",
        percentage: 79,
        progress: 79,
        pages: 100
    };
    res.render('dashboard', populateVariables(req, {books: [demoBook]}));
});

router.get('/demo/create-book', function(req, res) {
    res.render('createBook', populateVariables(req, {title: "Create a book for your library!"}));
});

router.get('/demo/set-timer', function(req, res) {
    res.render('timer', populateVariables(req, {}));
});

router.get('/demo/timer', function(req, res) {
    res.render('exampleTimer', populateVariables(req, {layout: "layoutTimer.hbs"}));
});

router.get('/demo/notes/demo-book', function(req, res) {
    let demoNote = {
        dateCreated: "Sometime", 
        endPage: 56,
        content: "Demo note here.",
        id: "demo-book",
    };
    res.render('note', populateVariables(req, {note: [demoNote]}));
});


module.exports = {router};