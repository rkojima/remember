const express = require('express');
const config = require('./config');

const app = express();

// Exposing static files (files that client should see) 
app.use(express.static('public'));

app.post('/signup', function(req, res){
    res.send('ok');
});
// No need for hostname yet
app.listen(config.PORT, function() {
    console.log(`Listening on ${config.PORT}`);
});