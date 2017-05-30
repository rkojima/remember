const mongoose = require('mongoose');
const {Note} = require('./note');

mongoose.Promise = global.Promise;

const BookSchema = mongoose.Schema({
    title: {
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

BookSchema.methods.farthestNote = function() {
    return Note.findOne({book: this})
    .sort({endPage: -1});
};

const Book = mongoose.model('Book', BookSchema);

module.exports = {Book};