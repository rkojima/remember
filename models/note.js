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

// Example bare-bones note
// Note for: The Lion, Witch and Wardrobe
// Pages: 15-25
// Title: title 

// Ipsum Loremfjdklsa;fjdklasjfdkl;asjfdlsa;kjffjdksla;
// fdsakjlfjdlks;ajfdl;safjdklsa;fjdklsafjdklasjfdklsajf

// [Edit Note], [Delete Note]



// Drop down of what book they're reading
// Input form of which pages they read