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
        {type: mongoose.Schema.Types.ObjectId, ref: 'book'}
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
    return this.library.map(bookId => bookId.toString()).includes(bookNumber);
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User}; 