const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, // Ensure unique and required
    password: { type: String, required: true }, // Ensure password is required
}, { timestamps: true });


const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
