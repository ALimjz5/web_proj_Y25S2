const mongoose = require('mongoose');
const user = require("../models/user.js");

let db = {
    async connect() {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/transportProjectDB');
            return "Connected to Mongo DB";
        } catch(e) {
            console.log(e.message);
            throw new Error("Error connecting to Mongo DB");
        }
    },
}

module.exports = db;
