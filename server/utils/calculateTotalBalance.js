const Transaction = require("../models/transaction");

const calculateTotalBalance = async () => {
    const transactions = await Transaction.find();
    if (!transactions || transactions.length === 0) {
        return 0; // No transactions, balance is 0
    }

    const accountTotals = transactions.reduce((acc, transaction) => {
        const account = transaction.account;
        acc[account] = (acc[account] || 0) + transaction.amount;
        return acc;
    }, {});

    const totalBalance =
        (accountTotals.saving || 0) - Math.abs(accountTotals.checking || 0);

    return totalBalance;
};


module.exports = calculateTotalBalance;
