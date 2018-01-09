const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {populateVariables, userLibraryLoader} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {authenticatedOnly} = require('./authentication');

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

router.get('/', function(req, res) {
    return res.render("hero", populateVariables(req, {gradient: true}));
});

router.get('/dashboard', authenticatedOnly, userLibraryLoader, function(req, res) {
    // For each book, get the farthest page number and show that for the progress bar
    res.render("dashboard", populateVariables(req, {books: req.user.library, username: req.user.username}));
    /*
    With JSON file, I know that I have info now from library
    For each book in library, render so that book title and number of pages read are shown
    Progress bar too
    */
});

module.exports = {router};