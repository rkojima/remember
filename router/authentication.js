// A router for signup, login, logout

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');

const router = express.Router();
const formParser = bodyParser.urlencoded();

// A route when signing up
router.post('/signup', formParser, function(req, res) {
    if(req.body.psw != req.body['psw-repeat']) {
        return res.send("Passwords do not match");
    }

    User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.psw, // TODO change to hash
    })
    .then(function(user) {
        res.json(`User ${user.id} created.`);
    })
    .catch(function(err) {
        if (err.code === 11000) {
            res.status(400).send(`There's already a user with that name.`);
        }
        else {
            console.log(err);
            res.sendStatus(500);
        }
    });
});

// A route when logging in


module.exports = {router};