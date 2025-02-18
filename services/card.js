const card = require("../models/card.js");

let cardService = {
    async addCard(name, code, type, balance, userId) {
        try {
            await card.create ({
                name: name,
                code: code,
                type: type,
                balance: balance,
                user: userId
            });
            return `${name} has been added to cards`;
        }
        catch(e) {
            console.log(e.message);
            throw new Error(`${code} was not added`);
        }
    },
    async getCards() {
        try {
            results = await card.find().populate('user', ['username', 'email']);
            return results;
        } catch(e) {
            console.log(e.message);
            throw new Error("Error retrieving cards");
        }
    },
    async getCard(conditions) {
        try {
            let results = await card.find(conditions).populate('user', ['username', 'email']);
            return results;
        } catch(e) {
            console.log(e.message);
            throw new Error("Error retrieving cards");
        }
    },
    async getCardById(id) {
        try {
            let result = await card.findById(id);
            return result;
        }
        catch (e) {
            console.log(e.message);
            throw new Error("Error retrieving card");
        }
    },
    async deleteCard(id) {
        try {
            let result = await card.findByIdAndDelete(id);
            if (!result) return "Unable to find a card to delete.";
            else return "Card has been deleted successfully.";
        } catch (e) {
            console.log(e.message);
            throw new Error("Error deleting card");
        }
    },
    async updateCardById(id, updates) {
        try {
            let result = await card.findByIdAndUpdate(id, updates);
            if(!result) return "Unable to find card to update.";
            else return "Card has been updated."
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error updating card");
        }
    }
}

module.exports = cardService;