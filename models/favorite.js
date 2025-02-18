const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    code: {type: String, unique: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
})

module.exports = mongoose.model('favorites', favoriteSchema);