// A router for signup, login, logout

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');
const passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
const formParser = bodyParser.urlencoded();

// Before using passport, configure strategy first

/*const basicStrategy = new BasicStrategy (function(username, password, done) {
    // What it's taking in is wrong
    // Something about the cache holding onto the previous username and password
    User.findOne({ username: username }, function (err, user) {
    console.log(`Username: ${username}, Password: ${password}`);
    if (err) {
        return done(err);
    }
    if (!user) { 
        return done(null, false, {message: 'Incorrect username'});
    }
    if (!user.validatePassword(password)) {
        return done(null, false, {message: 'Incorrect password'}); 
    }
      return done(null, user);
    });
});
passport.use(basicStrategy);
*/

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Here');
    User.findOne({ username: username }, function(err, user) {
        console.log('There');
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});

// Menu, where they see their books and notes
router.get('/dashboard', passport.authenticate('local', {session: false}), function(req, res) {
    res.json({user: req.user.apiRepr()});
});

router.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/login'); // Placeholder for now
});

module.exports = {router};