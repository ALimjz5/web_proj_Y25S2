const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    name: {type: String, unique: true},
    code: {type: String, unique: true},
    type: String,
    balance: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
})

module.exports = mongoose.model('cards', cardSchema);