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
        email: this.email || ''
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);

};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User}; 