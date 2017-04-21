const express = require('express');
const bodyParser = require('body-parser');

const {Book} = require('../models/book');
const {User} = require('../models/user');
const {authenticatedOnly} = require('./authentication');

const router = express.Router();
const formParser = bodyParser.urlencoded();

router.get('/create-book', authenticatedOnly, function(req, res) {
    res.render('createBook', {title: "Create a book for your library!"});
});

router.post('/create-book', authenticatedOnly, formParser, function(req, res) {
    console.log(req.user);
    Book.create({
        title: req.body.book,
        pages: req.body.pages
    })
    .then(function(book) {
        User.findOneAndUpdate(
            {_id: req.user._id}, 
            {$push: {library: book}}, 
            {new: true})
        .then(function(user) {
            res.redirect('/book/' + book.id);
        });
    });
});

router.get('/book/:id', function(req, res) {
    console.log(req.params.id);
    Book.findById(req.params.id)
    .then(function(book) {
        const userOwns = req.isAuthenticated() ? 
        req.user.library.map(bookId => bookId.toString()).includes(req.params.id) : false;
        const showAddButton = req.user && !userOwns;
        res.render("book", {title: book.title, book: book, owned: userOwns, user: req.user, addButton: showAddButton});
    })
    .catch(function(err) {
        console.log(err);
        res.sendStatus(404);
    });
});

module.exports = {router};