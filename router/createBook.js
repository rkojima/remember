const express = require('express');
const bodyParser = require('body-parser');
const {Book} = require('../models/book');

const router = express.Router();
const formParser = bodyParser.urlencoded();

router.get('/create-book', function(req, res) {
    res.render('createBook', {title: "Create a book for your library!"});
});

router.post('/create-book', formParser, function(req, res) {
    Book.create({
        title: req.body.book,
        pages: req.body.pages
    })
    .then(function(book) {
        res.send(`The book, "${book.title}," was created.`);
    });
});

module.exports = {router};