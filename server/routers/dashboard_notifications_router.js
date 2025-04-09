const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const Transaction = require('../models/transaction');
const calculateTotalBalance = require("../utils/calculateTotalBalance");
const { requiresAuth } = require("express-openid-connect");
// const cron = require("node-cron");
// const axios = require("axios");

// GET route to fetch all notifications
router.get("/", requiresAuth(), (req, res) => {
    Notification.find({ createdBy: req.oidc.user.sub }, {
                        id: 1,
                        title: 1,
                        category: 1,
                        isRead: 1,
                        createdAt: 1
                    })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .then((notifications) => {
            res.json(notifications);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});


// POST route to check total balance and create a notification if negative
router.post("/check-balance", requiresAuth(), async (req, res) => {
    try {
        const totalBalance = await calculateTotalBalance();
        if (totalBalance < 0) {
            const currentDate = new Date();
            const formattedDate = formatDate(currentDate);
            const formattedTime = formatTime(currentDate);

            const newNotification = new Notification({
                id: `${formattedDate}   ${formattedTime}`, // Use formatted time
                title: "Reminder: Your total balance is negative.",
                category: "personal",
                isRead: false,
                createdAt: currentDate,
                createdBy: req.oidc.user.sub,
            });

            // Save the new notification
            const savedNotification = await newNotification.save();
            console.log("Notification created");

            return res.status(201).json({
                message: "Notification created",
                notification: savedNotification,
            });
        } else {
            return res.status(200).json({
                message: "Total balance is positive",
            });
        }
    } catch (error) {
        console.error("Error checking balance:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});


// POST route to check if user has created a transaction for current date
// and create a notification reminder if not
router.post("/check-transactions", requiresAuth(), async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const transactionsToday = await Transaction.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            createdBy: req.oidc.user.sub,
        });

        if (transactionsToday.length === 0) {
            const formattedDate = formatDate(new Date());
            const formattedTime = formatTime(new Date());

            const newNotification = new Notification({
                id: `${formattedDate} ${formattedTime}`,
                title: "Hey, don't forget to add your transactions for today!",
                category: "personal",
                isRead: false,
                createdAt: new Date(),
                createdBy: req.oidc.user.sub,
            });

            // Save the new notification
            const savedNotification = await newNotification.save();
            console.log("Transaction reminder notification created");

            return res.status(201).json({
                message: "Transaction reminder notification created",
                notification: savedNotification,
            });
        } else {
            return res.status(200).json({
                message: "Transactions logged for today, no reminder needed",
            });
        }
    } catch (error) {
        console.error("Error creating transaction reminder notification:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Schedule the /check-transactions route to run every day at 6 PM
// https://www.npmjs.com/package/node-cron
// May also change to 1-2 mins by just all * * * * *, or 6pm is 0 18 * * *
// Schedule the /check-transactions route to run every day at 6 PM
// cron.schedule("* * * * *", async () => {
//     try {
//         console.log("BASE_URL:", process.env.BASE_URL);
//         const response = await axios.post(`${process.env.BASE_URL}/dashboard/notifications/check-transactions`);
//         console.log("Transaction reminder notification response:", response.data);
//     } catch (error) {
//         console.error("Error triggering check-transactions route:", error);
//     }
// });

// UPDATE status of isRead
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { isRead } = req.body;

    if (typeof isRead !== "boolean") {
        return res.status(400).json({ error: "Invalid 'isRead' value" });
    }

    try {
        const updatedNotification = await Notification.findOneAndUpdate(
            { id },
            { isRead },
            { new: true } // Return the updated document
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json(updatedNotification);
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// DELETE route with param of id to find and delete the selected document[/notification/:id]
router.delete("/:id", async (req, res) => {
    const notificationId = req.params.id;

    try {
        const result = await Notification.deleteOne({ id: notificationId });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Notification not found" });
        }
        res.status(200).send({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "Failed to delete notification", details: error.message });
    }
});


// Bulk DELETE notifications
router.post("/bulk-delete", async (req, res) => {
    const { ids } = req.body; // Expecting an array of `id` values
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send({ message: "Invalid or empty array of IDs provided." });
    }

    try {
        const result = await Notification.deleteMany({ id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "No notifications found for the given IDs." });
        }
        res.status(200).send({ message: "Selected notifications deleted successfully." });
    } catch (error) {
        res.status(500).send({ error: "Failed to delete notifications", details: error.message });
    }
});


// HELPER FUNCTIONS ============================================================
// Helper function to format date as YYYY/MM/DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

// Helper function to format time in a.m. or p.m. format
const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
};

module.exports = router;