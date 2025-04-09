const express = require("express");
const Transaction = require("../models/transaction");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { format } = require("date-fns");


// fetch all transactions
router.get("/transactions", requiresAuth(), async (req, res) => {
  try {
    const transactions = await Transaction.find({ createdBy: req.oidc.user.sub });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a transaction
router.post("/transactions", requiresAuth(), async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const formattedDate = format(new Date(req.body.date), "yyyy-MM-dd");
  console.log("Formatted date:", formattedDate); // Log the formatted date

  const transaction = new Transaction({
    date: String(formattedDate),
    account: req.body.account,
    category: req.body.category,
    description: req.body.description,
    amount: req.body.amount,
    createdBy: req.oidc.user.sub,
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/transactions/:id", getTransaction, (req, res) => {
  res.json(res.transaction);
});

// Delete a transaction
router.delete("/transactions/:id", getTransaction, async (req, res) => {
  try {
    console.log(`Attempting to delete transaction with ID: ${req.params.id}`);
    await Transaction.deleteOne({ _id: req.params.id });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a transaction
router.put("/transactions/:id", requiresAuth(), getTransaction, async (req, res) => {
  if (req.body.date != null) {
    res.transaction.date = format(new Date(req.body.date), "yyyy-MM-dd"); // <--
  }
  if (req.body.account != null) {
    res.transaction.account = req.body.account; // <--
  }
  if (req.body.category != null) {
    res.transaction.category = req.body.category; // <--
  }
  if (req.body.description != null) {
    res.transaction.description = req.body.description; // <--
  }
  if (req.body.amount != null) {
    res.transaction.amount = req.body.amount; // <--
  }
  if (req.body.createdBy != null) {
    res.transaction.createdBy = req.body.createdBy; // <--
  }
  try {
    const updatedTransaction = await res.transaction.save(); // <--
    res.json(updatedTransaction); // <--
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get transaction by id
async function getTransaction(req, res, next) {
  let transaction;
  try {
    transaction = await Transaction.findById(req.params.id);
    if (transaction == null) {
      return res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.transaction = transaction;
  next();
}

module.exports = router;