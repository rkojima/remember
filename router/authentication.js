// A router for signup, login, logout

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');
const passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

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

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'psw'
},
function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, {message: 'Incorrect username.' });
         }
          if (!user.validatePassword(password)) {
            return done(null, false, {message: 'Incorrect password.' });
        }
        return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    User.findById(user, function(err, user) {
    done(err, user);
  });
});

router.get('/', function(req, res) {
    return res.send("Hello World");
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
const loginMiddleware = passport.authenticate('local', {
        successRedirect: '/dashboard', // TODO change this to dashboard
        failureRedirect: '/login'
    });

router.get('/signup', function(req, res) {
    res.render('signup', {title: "Sign Up!"});
});

router.get('/login', function(req, res) {
    if(req.isAuthenticated()) {
        res.redirect('/dashboard');
    }
    res.render('index', {title: "Hello!"});
});

// Made sure that info from form was coming in through post
router.post('/login', formParser, loginMiddleware);

const authenticatedOnly = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/login');
    }
};

// Menu, where they see their books and notes
// Probably want this in its own router
router.get('/dashboard', authenticatedOnly, function(req, res) {
    res.json({user: req.user.apiRepr()});
});

router.get('/logout', function(req, res) {
    console.log("Logging Out.");
    req.logOut();
    req.session.destroy(function() {
        res.clearCookie('connect.sid');
        res.redirect('/'); // Placeholder for now
    });
});

module.exports = {router, authenticatedOnly};