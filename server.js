const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const {router: authRouter} = require('./router/authentication');

const app = express();
const formParser = bodyParser.urlencoded();
// So that I could parse the req.body and what not. Else it will be raw and hideous.

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

app.use(authRouter);

// No need for hostname yet
app.listen(config.PORT, function() {
    console.log(`Listening on ${config.PORT}`);
});