const express = require('express');
const router = express.Router();
const { Expense, User, Category } = require('../models');
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
      where: { userId: req.session.userId },
      include: [
        { model: User, as: 'user', attributes: ['username'] },
        { model: Category, as: 'category' },
      ],
      raw: false,
    });

    const categories = await Category.findAll();
    res.render('expenses', { expenses, categories });
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
      whereConditions[Op.or] = [{ description: { [Op.iLike]: `%${search}%` } }];
      whereConditions[Op.or].push({ category: { [Op.iLike]: `%${search}%` } });
    }

    if (filterDate) {
      whereConditions.date = filterDate;
    }

    const expenses = await Expense.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          model: Category,
          as: 'category',
          attributes: ['userId'],
        },
      ],
    });

    res.render('expenses', { expenses, Category });
  } catch (error) {
    console.error('Error searching expenses:', error);
    res.status(500).send('Server Error');
  }
});

// Add new expense
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { amount, description, date, categoryId } = req.body;

    // Validate categoryId
    if (!categoryId) {
      throw new Error('Category is required');
    }

    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error('Invalid category');
    }
    const localDate = new Date(date);
    const offsetDate = new Date(
      localDate.getTime() + localDate.getTimezoneOffset() * 60000
    );

    const newExpense = await Expense.create({
      amount,
      description,
      date: offsetDate,
      userId: req.session.userId,
      categoryId: category.id,
    });

    res.redirect('/expenses');
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(400).render('dashboard', {
      error: error.message || 'Failed to add expense.',
    });
  }
});

// Delete expense
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await Expense.destroy({
      where: { id: req.params.id, userId: req.session.userId }, // Ensure userId matches
    });

    if (result) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(400).json({ message: 'Failed to delete expense.' });
  }
});

module.exports = router;
