const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id });
  return res.status(200).json(transactions);
});

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Public
const addTransaction = asyncHandler(async (req, res) => {
  const { text, amount } = req.body;
  const transaction = await Transaction.create({
    text,
    amount,
    user: req.user.id,
  });

  return res.status(201).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: "No transaction found",
    });
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  return res.status(200).json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error("No transaction found");
  }
  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the goal user
  if (transaction.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await transaction.remove();

  return res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
