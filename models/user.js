const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    username: {type: String, unique: true},
    password: String,
    email: String,
    token: String,
});

module.exports = mongoose.model('users', userSchema);