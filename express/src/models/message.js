const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Comment', messageSchema)