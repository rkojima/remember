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

router.post('/add-book', authenticatedOnly, formParser, function(req,res) {
    // check if book hasn't been already added, look at userOwns = req.isAuthenticated
    if (req.user.ownBook(req.body.book)) {
        res.redirect('/book/' + req.body.book);
    } 
    else {
    const book = req.body.book;
    console.log(req.body.book);
    User.findOneAndUpdate(
        {_id: req.user._id},
        {$push: {library: book}},
        {new: true})
    .then(function(user) {
        res.redirect('/book/' + book);
    });
}
});

router.get('/book/:id', function(req, res) {
    console.log(req.params.id);
    Book.findById(req.params.id)
    .then(function(book) {
        const userOwns = req.isAuthenticated() ? 
        req.user.ownBook(req.params.id) : false;
        const showAddButton = req.user && !userOwns;
        res.render("book", {title: book.title, book: book, owned: userOwns, user: req.user, addButton: showAddButton});
    })
    .catch(function(err) {
        console.log(err);
        res.sendStatus(404);
    });
});

router.get('/dashboard', authenticatedOnly, function(req, res) {
    // res.json({library: req.user.library});
    let libraryArray = [];
    req.user.library.forEach(function(book) {
        // mongoDB right here
        Book.findById(book)
        .then(function(book) {
            libraryArray.push([
              book.title, book.pages  
            ]);
            console.log(libraryArray);
        });

    });
    console.log(libraryArray);
    res.send(libraryArray);
    // Having trouble with asynchronous operations, need to somehow do res.send after finding the books in the collection
});

module.exports = {router};