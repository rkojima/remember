const express = require('express');
const bodyParser = require('body-parser');
const {Book} = require('../models/book');

const router = express.Router();
const formParser = bodyParser.urlencoded();

router.get('/create-book', function(req, res) {
    res.render('createBook', {title: "Create a book for your library!"});
});

module.exports = {router};