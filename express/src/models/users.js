const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {versionKey: false})

userScheme.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bycrypt.hash(this.password, 10);
    next();
})

module.exports = mongoose.model('User', userScheme)