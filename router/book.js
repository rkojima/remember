const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {populateVariables, bookLoader, userLibraryLoader} = require('./util');
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
        pages: req.body.pages,
        progress: 0,
        percentage: 0,
    })
    .then(function(book) {
        console.log("Book: " + book);
        User.findOneAndUpdate(
            {_id: req.user._id},
            // Used to be library: book, but now library items are properties (library is an array) of object (myBook and progress)
            {$push: {library: book}}, 
            {new: true})
        .then(function(user) {
            console.log("User: " + user);
            req.flash("success", "Book created!");
            res.redirect('/dashboard');
        });
    });
});

router.post('/add-book', authenticatedOnly, formParser, function(req,res) {
    // check if book hasn't been already added, look at userOwns = req.isAuthenticated
    if (req.user.ownBookWithoutUserLibraryLoader(req.body.book)) {
        res.redirect('/book/' + req.body.book);
    } 
    else {
        const book = req.body.book;
        console.log("Type of book: " + typeof book);
        User.findOneAndUpdate(
            {_id: req.user.id},
            {$push: {library: book}},
            {new: true})
            .then(function(user) {
                console.log("User after adding book: " + user);
                res.redirect('/book/' + book);
            });
        // console.log("Seeing book in post router: " + req.body.book);
        // console.log("User ID: " + req.user._id);
    }
});

router.get('/book/:id', function(req, res) {
    // console.log("Book ID: " + req.params.id);
    Book.findById(req.params.id)
    .then(function(book) {
        const userOwns = req.isAuthenticated() ? 
        req.user.ownBookWithoutUserLibraryLoader(req.params.id) : false;
        const showAddButton = req.user && !userOwns;
        // probably want to use this code in a note router
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

// For removing books from user library
router.get('/book/:id/remove', authenticatedOnly, function(req, res) {
    Book.findById(req.params.id)
        .then(function(book) {
            req.book = book;
            return book;
        })
        .then(function(book) {
            console.log(req.book);
            res.render("confirmRemove", populateVariables(req, {book: req.book}));
        });
    // res.render('confirmRemove', req, {book: });
});

router.post('/book/:id/remove', authenticatedOnly, userLibraryLoader, function(req, res) {
    User.update({_id: req.user._id}, { $pull: {library: req.params.id}})
    .then(function(user) {
        console.log("USER: " + req.user);
        req.flash("success", "Book has been removed");
        res.redirect("/dashboard");
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