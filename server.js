const express = require('express');
const config = require('./config');

const app = express();

// Exposing static files (files that client should see) 
app.use(express.static('public'));

// No need for hostname yet
app.listen(config.PORT, function() {
    console.log(`Listening on ${config.PORT}`);
});