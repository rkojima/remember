const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {router: authRouter} = require('./router/authentication');

const app = express();
const formParser = bodyParser.urlencoded();
const session = require('express-session');
// So that I could parse the req.body and what not. Else will be raw and hideous.

/* app.use(function(req, res, next) {
    console.log(req.path);
    console.log(req.method);
    next();
}); */
// This is basically what's in Morgan

app.use(morgan('dev')); // Makes it easier to develop
// Morgan is first so that we see all actions done

// Exposing static files (files that client should see) 
app.use(express.static('public'));

app.use(session({
    secret: 'What is this cat',
}));

app.use(authRouter);

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