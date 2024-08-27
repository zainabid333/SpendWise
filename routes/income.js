const express = require('express');
const router = express.Router();
const { Income, User } = require('../models');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Render income page (both form and list)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, {
      attributes: ['username'],
    });

    const incomes = await Income.findAll({
      where: {
        userId: req.session.userId,
      },
    });

    res.render('income', { user, incomes });
  } catch (err) {
    console.error('Error fetching income:', err);
    res
      .status(500)
      .render('error', { message: 'Failed to fetch income data.' });
  }
});

// Create income
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newIncome = await Income.create({
      userId: req.session.userId,
      amount: req.body.amount,
      description: req.body.description,
      date: req.body.date || new Date(),
    });

    res.redirect('/income');
  } catch (err) {
    console.error('Error creating income:', err);
    res.status(400).render('income', { error: 'Failed to add income.' });
  }
});

module.exports = router;
