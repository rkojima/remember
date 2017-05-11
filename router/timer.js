const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {populateVariables} = require('./util');
const {Book} = require('../models/book');
const {User} = require('../models/user');
const {Note} = require('../models/note');
const {authenticatedOnly} = require('./authentication');

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

router.get('/timer', authenticatedOnly, formParser, function(req, res) {
    res.render('timer', populateVariables(req, {}));
});

router.post('/timer', authenticatedOnly, formParser, function(req, res) {
    console.log(typeof req.body.minutes);
    res.render('countdownTimer', populateVariables(req, {time: parseInt(req.body.minutes * 60)}));
});

module.exports = {router};