// A router for signup, login, logout

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');
const passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
const formParser = bodyParser.urlencoded({extended: true});

// Before using passport, configure strategy first
//Login strategy
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'psw'
},
function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, {message: 'Invalid username or password.' });
        }
        if (!user.validatePassword(password)) {
            return done(null, false, {message: 'Invalid username or password.' });
        }
        return done(null, user);
    });
  }
));

//Signup strategy
passport.use(`signup`, new LocalStrategy({
    usernameField: 'username',
    passwordField: 'psw',
},
function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (user) {
            return done(null, false, {message: `There's already a user with that name.` });
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

// A route when signing up
router.post('/signup', formParser, function(req, res) {
    if(req.body.psw != req.body['psw-repeat']) {
        return res.send("Passwords do not match");
    }
    User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.psw,
    })
    .then(function(user) {
        res.redirect('/dashboard');
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
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
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

router.get('/logout', function(req, res) {
    console.log("Logging Out.");
    if (req.user.username === "demo") {
        User.findOneAndUpdate({username: "demo"}, {library: []}, function(err, user) {
        if (err) return res.send(500, { error: err });
    });
    };
    req.logOut();
    req.session.destroy(function() {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = {router, authenticatedOnly};