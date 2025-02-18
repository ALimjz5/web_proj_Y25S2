const favorite = require("../models/favorite.js");

let favoriteService = {
    async addFavorite(code, userId) {
        try {
            await favorite.create({
                code: code,
                user: userId,
            });
            return `Stop has been added to favorites`;
        }
        catch (e) {
            console.log(e.message);
            throw new Error(`Error adding stop.`);
        }
    },
    async getFavoriteById(id) {
        try {
            let result = await favorite.findById(id);
            return result;
        }
        catch (e) {
            console.log(e.message);
            throw new Error("Error retrieving favorite");
        }
    },
    async getFavorite() {
        try {
            let results = await favorite.find().populate('user');
            return results;
        } catch (e) {
            console.log(e.message);
            throw new Error("Error retrieving favorites");
        }
    },
    async getFavorites(conditions) {
        try {
            let results = await favorite.find(conditions);
            return results;
        }
        catch (e) {
            console.log(e.message);
            throw new Error("Error retrieving favorites");
        }
    },
    async deleteFavorite(conditions) {
        try {
            let result = await favorite.findOneAndDelete(conditions);
            if (!result) return "Unable to find a favorite to delete.";
            else return "Favorite has been deleted successfully.";
        } catch (e) {
            console.log(e.message);
            throw new Error("Error deleting favorite");
        }
    },
    async updateFavoriteById(id, updates) {
        try {
            let result = await favorite.findByIdAndUpdate(id, updates);
            if(!result) return "Unable to find favorite to update.";
            else return "Favorite has been updated."
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error updating favorite");
        }
    }
}

module.exports = favoriteService;