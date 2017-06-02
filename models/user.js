// A model

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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
    // console.log(this.library);
    // Can't do this.library.myBook.map b/c myBook is not an array nor is a property of library, so needs to be both to map
    // console.log("This: " + this);
    // console.log("Book Number: " + bookNumber);
    // console.log("This library: " + this.library);
    return this.library.find(book => book.id === bookNumber);
};

UserSchema.methods.ownBookWithoutUserLibraryLoader = function(bookNumber) {
    // console.log(this.library);
    // Can't do this.library.myBook.map b/c myBook is not an array nor is a property of library, so needs to be both to map
    // console.log("This: " + this);
    // console.log("Book Number: " + bookNumber);
    // console.log("This library: " + this.library);
    return this.library.find(book => book.toString() === bookNumber.toString());
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User}; 