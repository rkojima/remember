const {User} = require('../models/user');
const {Timer} = require('../models/timer');

// Used so that I could always have isAuthenticated and user handy when rendering
function populateVariables(req, others) {
    return Object.assign({
        isAuthenticated: req.isAuthenticated(),
        user: req.user || false,
    }, others);
}

// There seems to be an async issue where req.user doesn't happen quick enough for it to go through
const userLibraryLoader = (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findById(req.user.id).populate('library.myBook')
            .then(user => { 
                // Something about req.user can't assign
                // return res.json(user);
                // console.log("Before: " + req.user.library);
                req.user = user;
                next();
                // console.log("After: " + req.user.library);
            });
    } else {
        // console.log("Outside" + req.user.library);
        next();
    }
};


// Middleware for getting the note object

function noteLoader(req, res, next) {
    if (!req.params.noteId) {
        res.status(400).send("Please send valid note ID");
    }
    else {
        // Load book first
        Note.findById(req.params.noteId)
        .then(function(note) {
            // How it becomes available to user, like how passport works to make user available
            req.note = note;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}

// Middleware for getting the book object
function bookLoader(req, res, next) {
    if (!req.params.bookId) {
        res.status(400).send("Please send valid book ID");
    }
    else {
        // Load book first
        Book.findById(req.params.bookId)
        .then(function(book) {
            req.book = book;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}

function timerLoader(req, res, next) {
    if (!req.params.timerId) {
        res.status(400).send("Please send valid timer ID");
    }
    else {
        // Load book first
        Timer.findById(req.params.timerId)
        .then(function(timer) {
            req.timer = timer;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}

module.exports = {populateVariables, userLibraryLoader, noteLoader, bookLoader, timerLoader};