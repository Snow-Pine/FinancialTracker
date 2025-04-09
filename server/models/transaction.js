const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        required: true,
        enum: ["saving", "checking"],
    },
    category: {
        type: String,
        required: true,
        enum: [
            "retail",
            "personal",
            "transportation",
            "restaurant",
            "health",
            "other",
        ],
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    // Added by Vic
    createdBy: {
        type: String,
      //   required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, 
    // Added by Vic
    { 
        timestamps: true,
        versionKey: false,
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;