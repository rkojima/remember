const mongoose = require('mongoose');

const TimerSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    endTime: {
        type: Date,
        required: true
    },
});

const Timer = mongoose.model('Timer', TimerSchema);

module.exports = {Timer};