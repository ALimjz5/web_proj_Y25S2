const user = require("../models/user.js");

let userService = {
    async addUser(name, username, password, email){
        try {
            await user.create({
                name: name,
                username: username,
                password: password,
                email: email,
            });
            return `${username} has been added to the system`
        } catch (e) {
            console.log(e.message);
            throw new Error(`Unable to add ${username} into the system`);
        }
    },
    async getUsers(){
        try {
            let results = await user.find().select("username name email");
            return results;
        }
        catch (e) {
            console.log(e.message);
            throw new Error("Error retrieving user(s)");
        }
    },
    async getUserById(id) {
        try {
            let result = await user.findById(id).select("username name email");
            return result;
        }
        catch (e) {
            console.log(e.message);
            throw new Error("Error retrieving user");
        }
    },
    async deleteUser(id) {
        try {
            let result = await user.findByIdAndDelete(id);
            if (!result) return "Unable to find a user to delete.";
            else return "User has been deleted successfully.";
        } catch(e) {
            console.log(e.message);
            throw new Error("Error deleting user");
        }
    },
    async getUserLogInfo(username, password) {
        try {
            let result = await user.findOne({username: username, password: password});
            return result;
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error retrieving login credentials");
        }
    },
    async updateUserById(id, updates) {
        try {
            let result = await user.findByIdAndUpdate(id, updates);
            if(!result) return "Unable to find user to update.";
            else return "User has been updated."
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error updating user");
        }
    }
}

module.exports = userService;