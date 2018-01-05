// Timer model
const mongoose = require('mongoose');
const moment = require('moment');

const TimerSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    endTimeUnix: {
        type: Number,
        required: true
    },
    endTimeString: {
        type: String, 
        required: true
    }
});

const Timer = mongoose.model('Timer', TimerSchema);

module.exports = {Timer};