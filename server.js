const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

const config = require('./config');
const {router: authRouter} = require('./router/authentication');
const {router: bookRouter} = require('./router/book');
const {router: userRouter} = require('./router/user');
const {router: noteRouter} = require('./router/note');
const {router: timerRouter} = require('./router/timer');
const {router: demoRouter} = require('./router/demo');

const app = express();

// Look for views if code ever asks, in views folder.
// Render views using handlebars.
app.set('views', './views');
app.set('view engine', 'hbs');

// So that I could parse the req.body and what not. Else will be raw and hideous.

// This is basically what Morgan does
/* app.use(function(req, res, next) {
    console.log(req.path);
    console.log(req.method);
    next();
}); */

// Morgan is first so that we see all actions done
app.use(morgan('dev')); // Makes it easier to develop

// Exposing static files (files that client should see) 
app.use(express.static('public'));

app.use(cookieParser('secret'));

// Define a cookie-based session for the whole app.
app.use(session({
    secret: 'What is this cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// Initialize passport for the whole app
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Mounting the router
app.use(authRouter);
app.use(bookRouter);
app.use(userRouter);
app.use(noteRouter);
app.use(timerRouter);
app.use(demoRouter);


mongoose.connect(config.DATABASE_URL, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(config.PORT, function() {
            console.log(`Listening on ${config.PORT}`);
        });
    }
});

module.exports = {app};