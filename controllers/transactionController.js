const db = require('../models');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await db.Transaction.findAll({ where: { userId: req.session.user.id } });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { text, amount } = req.body;
    const transaction = await db.Transaction.create({ text, amount, userId: req.session.user.id });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Transaction.destroy({ where: { id, userId: req.session.user.id } });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};