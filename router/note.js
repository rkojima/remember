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

router.get('/notes/:id', authenticatedOnly, formParser, function(req, res) {
    Book.findById(req.params.id)
    .then(function(book) {
        res.render("note", populateVariables(req, {bookName: book.title}));
    });
});

module.exports = {router};