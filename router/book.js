const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {populateVariables} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {authenticatedOnly} = require('./authentication');

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

router.get('/create-book', authenticatedOnly, function(req, res) {
    res.render('createBook', populateVariables(req, {title: "Create a book for your library!"}));
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
            // Used to be library: book, but now library items are properties (library is an array) of object (myBook and progress)
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
        book.farthestNote().then(function(note) {
            console.log("Note: " + note);
            res.render("book", populateVariables(req, {title: book.title, book: book, owned: userOwns, addButton: showAddButton}));
        });
    })
    .catch(function(err) {
        console.log(err);
        res.sendStatus(404);
    });
});

// Helper function to input user library and output "mongoose.Types.ObjectId" + ID of book
// NO NEED FOR THIS ANYMORE, KEEPING JUST TO LOOK AT
// function idToObject(libArray) {
//     let readyId = libArray.map(function(book){
//         return mongoose.Types.ObjectId(book.myBook);
//     });
//     console.log(readyId);
//     return readyId;
// }

module.exports = {router, populateVariables};