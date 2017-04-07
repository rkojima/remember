// For signup, login, logout

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');

const router = express.Router();
const formParser = bodyParser.urlencoded();

router.post('/signup', formParser, function(req, res) {
    User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.psw, // TODO change to hash
    })
    .then(function(user) {
        res.json(`User ${user.id} created.`);
    })
    .catch(function(err) {
        console.log(err);
    });
});

module.exports = {router};