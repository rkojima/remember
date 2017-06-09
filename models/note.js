// Note model
const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    endPage: {
        type: Number,
    },
    content: {
        type: String,
    },
    dateCreated: {
        type: String,
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note};