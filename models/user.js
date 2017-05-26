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
            myBook: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Book',
            },
            // Possibly use myTitle to get book title?
            progress: {
                type: Number
            }
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
    return this.library.map(item => item.myBook.id).includes(bookNumber);
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User}; 