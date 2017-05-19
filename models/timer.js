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
    endTime: {
        type: Object,
        required: true
    },
});

const Timer = mongoose.model('Timer', TimerSchema);

module.exports = {Timer};