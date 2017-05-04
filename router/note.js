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
        const userOwns = req.isAuthenticated() ? 
        req.user.ownBook(req.params.id) : false;
        res.render("note", populateVariables(req, {bookName: book.title, owned: userOwns}));
    });
});

router.post('/notes/:id', authenticatedOnly, formParser, function(req, res) {
    res.send(req.body);
});

module.exports = {router};