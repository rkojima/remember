const express = require('express');
const config = require('./config');
const morgan = require('morgan');

const app = express();

/* app.use(function(req, res, next) {
    console.log(req.path);
    console.log(req.method);
    next();
}); */

app.use(morgan('dev'));
// Exposing static files (files that client should see) 
app.use(express.static('public'));

app.post('/signup', function(req, res){
    res.send('ok');
});
// No need for hostname yet
app.listen(config.PORT, function() {
    console.log(`Listening on ${config.PORT}`);
});