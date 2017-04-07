// For signup, login, logout

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const formParser = bodyParser.urlencoded();

router.post('/signup', formParser, function(req, res) {
    // body...
    res.json(req.body);
});

module.exports = {router};