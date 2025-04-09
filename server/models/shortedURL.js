const mongoose = require("mongoose");

const shortedURLSchema = new mongoose.Schema({
    // userID: {
    //     type: String,
    //     required: true,
    //     trim: true,
    // },
    longURL: {
        type: String,
        required: true,
        trim: true,
    },
    shortURL: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    createdDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    }
});

const ShortedURL = mongoose.model("shortedURL", shortedURLSchema);
module.exports = ShortedURL;