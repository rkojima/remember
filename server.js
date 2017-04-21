const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const config = require('./config');
const {router: authRouter} = require('./router/authentication');
const {router: creationRouter} = require('./router/createBook');

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

app.use(authRouter);
app.use(creationRouter);

// No need for hostname yet
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

// May need to add runServer and closeServer 
module.exports = {app};