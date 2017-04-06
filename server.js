const express = require('express');
const config = require('./config');

const app = express();

// No need for hostname yet
app.listen(config.PORT, function() {
    console.log(`Listening on ${config.PORT}`);
});