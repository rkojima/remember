// A router for signup, login, logout

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');
const passport = require('passport');
const {BasicStrategy} = require('passport-http');

const router = express.Router();
const formParser = bodyParser.urlencoded();

// Before using passport, configure strategy first
/*const basicStrategy = new BasicStrategy (function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
});
passport.use(basicStrategy);
router.use(passport.initialize());*/

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
router.post('/login', /*passport.authenticate('basic', {session: false}),*/ function(req, res) {
    return res.send('ok');
});

module.exports = {router};