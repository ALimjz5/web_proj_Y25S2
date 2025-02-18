const user = require("../models/user.js");

let tokenService = {
    async updateToken(id, token) {
        try {
            await user.findByIdAndUpdate(id, {token:token});
            return;
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error at the server. Please try again later.");
        }
    },
    async checktoken(token) {
        try {
            let result = await user.findOne({token:token});
            return result;
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error at the server. Please try again later.");
        }
    },
    async removeToken(id) {
        try {
            await user.findByIdAndUpdate(id, {$unset: {token: 1}});
            return;
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error at the server. Please try again later.");
        }
    }
}

module.exports = tokenService;