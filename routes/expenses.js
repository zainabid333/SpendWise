const express = require('express');
const router = express.Router();
const { Expense, User } = require('../models');
const { Op } = require('sequelize');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Get all expenses
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.session.userId }, // Ensure userId matches your model field
      include: [{ model: User, as: 'user', attributes: ['username'] }], // Correct alias usage
      raw: false, // Remove raw: true to ensure eager-loading works properly
    });
    res.render('expenses', { expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).render('error', { message: 'Failed to fetch expenses.' });
  }
});

// Search expenses and filter by date
router.get('/filter', isAuthenticated, async (req, res) => {
  try {
    const { search, filterDate } = req.query;

    const whereConditions = {
      userId: req.session.userId, // Ensure you're only fetching the logged-in user's expenses
    };

    if (search) {
      whereConditions[Op.or] = [
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (filterDate) {
      whereConditions.date = filterDate;
    }

    const expenses = await Expense.findAll({
      where: whereConditions,
      include: [{ model: User, as: 'user', attributes: ['username'] }],
    });

    res.render('expenses', { expenses });
  } catch (error) {
    console.error('Error filtering expenses:', error);
    res.status(500).send('Server Error');
  }
});

// Add new expense
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const newExpense = await Expense.create({
      amount,
      description,
      category,
      date: req.body.date(),
      userId: req.session.userId, // Ensure 'userId' is consistent
    });
    res.redirect('/expenses');
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(400).render('dashboard', { error: 'Failed to add expense.' });
  }
});

// Delete expense
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await Expense.destroy({
      where: { id: req.params.id, userId: req.session.userId }, // Ensure 'userId' matches your column name
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(400).json({ message: 'Failed to delete expense.' });
  }
});

module.exports = router;
