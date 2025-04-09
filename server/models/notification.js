const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["salary", "retail", "transportation", "personal", "restaurant",
               "health", "other"],
    },
    isRead : {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    }
});

// Create the model
const Notification = mongoose.model("Notification", notificationSchema); // Collection name: notifications
module.exports = Notification;
