const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

// Helper function to input user library and output "mongoose.Types.ObjectId" + ID of book
function idToObject(libArray) {
    let readyId = libArray.map(function(book){
        return mongoose.Types.ObjectId(book);
    });
    console.log(readyId);
    return readyId;
}

router.get('/dashboard', authenticatedOnly, function(req, res) {
    // res.json({library: req.user.library});
    let libraryArray = [];
    console.log(1);
    // console.log(Book.findOne({}));
    console.log(req.user.library);
    
    // TODO FIXED: Having trouble with asynchronous operations, need to somehow do res.send after finding the books in the collection
    // Book.find takes longer, function(err, docs) only runs after query, but res.send (if place outside of Book.find) will run right after w/o waiting for Book.find
    /*  Retrieve IDs for all books in library
        For each ID in array {
            Retrieve book information based on ID (ASYNCHRONOUS OPERATION)
            Add it to libraryArray
        }

        send the completed libraryArray to web browser
    */
    Book.find({
        '_id': { $in: 
            idToObject(req.user.library)
        }
    }, function(err, docs){
        libraryArray = docs;
        console.log(libraryArray);
        res.render("dashboard", {book: libraryArray});
    });

    /*
    With JSON file, I know that I have info now from library
    For each book in library, render so that book title and number of pages read are shown
    Progress bar too
    */
});

module.exports = {router};