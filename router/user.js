const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {populateVariables} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {authenticatedOnly} = require('./authentication');

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

router.get('/', function(req, res) {
    return res.render("hero", populateVariables(req, {}));
});

router.get('/dashboard', authenticatedOnly, function(req, res) {
    // res.json({library: req.user.library});
    let libraryArray = [];
    console.log("At dashboard");
    // console.log(Book.findOne({}));
    console.log("Showing books in library:" + req.user.library);
    
    // TODO FIXED: Having trouble with asynchronous operations, need to somehow do res.send after finding the books in the collection
    // Book.find takes longer, function(err, docs) only runs after query, but res.send (if place outside of Book.find) will run right after w/o waiting for Book.find

    /*  
    Retrieve IDs for all books in library
    For each ID in array {
        Retrieve book information based on ID (ASYNCHRONOUS OPERATION)
        Add it to libraryArray
    }

    send the completed libraryArray to web browser
    */
    const booksToRender = req.user.library.map(item => item.myBook).map(book => mongoose.Types.ObjectId(book));

    Book.find({
        '_id': { $in: 
            booksToRender
        }
    }, function(err, docs){
        libraryArray = docs;
        console.log(libraryArray);
        res.render("dashboard", populateVariables(req, {books: libraryArray}));
    });

    /*
    With JSON file, I know that I have info now from library
    For each book in library, render so that book title and number of pages read are shown
    Progress bar too
    */
});

module.exports = {router};