const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config');
const morgan = require('morgan');

const app = express();
const formParser = bodyParser.urlencoded();

/* app.use(function(req, res, next) {
    console.log(req.path);
    console.log(req.method);
    next();
}); */

app.use(morgan('dev')); // Makes it easier to develop
// Morgan is first so that we see all actions done



// Exposing static files (files that client should see) 
app.use(express.static('public'));

app.post('/signup', formParser, function(req, res){
    res.json(req.body);
});
// No need for hostname yet
app.listen(config.PORT, function() {
    console.log(`Listening on ${config.PORT}`);
});