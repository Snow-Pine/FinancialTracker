const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const { requiresAuth } = require("express-openid-connect");

// GET route to fetch transactions
router.get("/", requiresAuth(), (req, res) => {
    Transaction.find({
        createdBy: req.oidc.user.sub,
        category: 1 })
        .then((transactions) => {
            res.json(transactions);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});


// GET route to fetch total spend per category in the current month
router.get("/total-spend", requiresAuth(), async (req, res) => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // Ensure month is two digits

        // Build the prefix for the current month in 'YYYY-MM' format
        const currentMonthPrefix = `${currentYear}-${currentMonth}`;

        // Group and sum amounts by category
        const categoryTotals = await Transaction.aggregate([
            {
                $match: {
                    createdBy: req.oidc.user.sub,
                    account: "checking", // Filter for account='checking'
                    date: { $regex: `^${currentMonthPrefix}` } // Matches strings starting with 'YYYY-MM'
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    category: "$_id",
                    totalAmount: 1,
                    _id: 0
                }
            }
        ]);

        // Return the result in the desired format
        res.json(categoryTotals);
    } catch (error) {
        console.error("Error fetching total spend per category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// GET route to fetch total of transactions: account=checking & account=saving
router.get("/total-balance", requiresAuth(), async (req, res) => {
    try {
        // Group and sum amounts by account
        const accountTotals = await Transaction.aggregate([
            { $match: { createdBy: req.oidc.user.sub } }, // Filter by the user
            {
                $group: {
                    _id: "$account",
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    account: "$_id",
                    totalAmount: 1,
                    _id: 0
                }
            }
        ]);
        res.json(accountTotals);

    } catch (err) {
        res.status(500).send({
            error: "Failed to fetch account totals",
            details: err,
        });
    }
});


// GET route to fetch historical monthly transaction totals for Checking account
router.get("/total-spend/monthly", requiresAuth(), async (req, res) => {
    try {
        // Fetch all "Checking" transactions
        const transactions = await Transaction.find({
            account: "checking",
            createdBy: req.oidc.user.sub
        });

        // Current date info
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Initialize monthly totals for the past 12 months
        const monthlyTotals = Array(12).fill(0);

        // Process each transaction
        transactions.forEach((transaction) => {
            const transactionDate = new Date(transaction.date); // Parse transaction date
            const transactionYear = transactionDate.getFullYear();
            const transactionMonth = transactionDate.getMonth(); // 0-based index for months

            // Calculate the difference in months from the current month
            const monthDifference = ((currentYear - transactionYear)
                                     * 12
                                     + (currentMonth - transactionMonth));

            // If within the past 12 months, add the transaction amount
            if (monthDifference >= 0 && monthDifference < 12) {
                monthlyTotals[11 - monthDifference] += transaction.amount;
            }
        });

        // Format the result
        const result = monthlyTotals.map((totalAmount, index) => {
            const monthIndex = (currentMonth - 11 + index + 12) % 12; // Calculate circular month index
            return {
                month: getMonthAbbreviation(monthIndex),
                totalAmount,
            };
        });
        res.json(result);

    } catch (err) {
        res.status(500).send({ error: "Failed to fetch monthly totals", details: err.message });
    }
});


// GET route to fetch the 5 most recent transactions
router.get("/recent-transactions", requiresAuth(), async (req, res) => {
    try {
        const recentTransactions = await Transaction.aggregate([
            { $match: { createdBy: req.oidc.user.sub } }, // Filter by the authenticated user
            { $sort: { date: -1 } }, // Sort by date descending
            { $limit: 5 }, // Limit to the 5 most recent transactions
            {
                $addFields: {
                    amount: {
                        $cond: {
                            if: { $eq: ["$account", "checking"] },
                            then: { $multiply: ["$amount", -1] }, // Negative for 'checking'
                            else: { $abs: "$amount" }, // Positive for 'saving'
                        },
                    },
                },
            },
        ]);
        res.json(recentTransactions);

    } catch (err) {
        res.status(500).send({
            error: "Failed to fetch recent transactions",
            details: err,
        });
    }
});

// HELPER FUNCTIONS ============================================================
// Helper function to get month abbreviation
const getMonthAbbreviation = (monthIndex) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
    return monthNames[monthIndex];
};

module.exports = router;
