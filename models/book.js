const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const bookSchema = mongoose.Schema({
    bookTitle: {
        type: String,
    },
    pages: {
        type: Number, 
    },
    isbn: {
        type: Number,
    },

    //TODO add book image to schema

});

const Book = mongoose.model('Book', bookSchema);

module.exports = {Book};