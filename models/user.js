// User model
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const {Note} = require('./note');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    library: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Book',
        }
    ]
});

UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.apiRepr  = function() {
    return {
        username: this.username || '',
        email: this.email || '',
        library: this.library || []
    };
};

UserSchema.methods.ownBook = function(bookNumber) {
    return this.library.find(book => book.id === bookNumber);
};

UserSchema.methods.ownBookWithoutUserLibraryLoader = function(bookNumber) {
    return this.library.find(book => book.toString() === bookNumber.toString());
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.farthestNote = function(book) {
    return Note.findOne({user: this, book: book})
    .sort({endPage: -1});
};

const User = mongoose.model('User', UserSchema);

module.exports = {User}; 