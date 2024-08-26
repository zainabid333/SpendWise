const express = require('express');
const router = express.Router();
const { User, Expense, Category, Income } = require('../models');
const session = require('express-session');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Home page
router.get('/', (req, res) => {
  res.render('home');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

//graph route
router.get('/graph', isAuthenticated, (req, res) => {
  User.findByPk(req.session.userId, {
    include: [
      {
        model: Expense,
        as: 'expenses',
        order: [['createdAt', 'DESC']],
        include: [{ model: Category, as: 'category' }],
      },
    ],
    attributes: { exclude: ['password'] },
  })
    .then((user) => {
      if (user) {
        res.render('graph', { user: user.toJSON(), title: 'Expense Graph' });
      } else {
        console.log('User not found. Redirecting to login.');
        req.session.destroy();
        res.redirect('/login');
      }
    })
    .catch((err) => {
      console.error('Error fetching user data for graph:', err);
      res.status(500).render('error', { message: 'An error occurred' });
    });
});

// Dashboard
router.get('/dashboard', (req, res) => {
  // console.log("Dashboard route hit. Session:", req.session);
  if (!req.session.userId) {
    console.log('No user ID in session. Redirecting to login.');
    return res.redirect('/login');
  }
  User.findByPk(req.session.userId, {
    include: [
      {
        model: Expense,
        as: 'expenses',
        order: [['createdAt', 'DESC']],
        include: [{ model: Category, as: 'category' }],
        // limit: 5,
      },
      {
        model: Income,
        as: 'incomes',
        order: [['createdAt', 'DESC']],
      },
    ],
    attributes: { exclude: ['password'] },
  })
    .then((user) => {
      if (user) {
        const totalIncome = user.income.reduce(
          (total, income) => total + parseFloat(income.amount),
          0
        );
        const totalExpenses = user.expenses.reduce(
          (total, expense) => total + parseFloat(expense.amount),
          0
        );

        const budget = totalIncome - totalExpenses;

        res.render('dashboard', {
          user: user.toJSON(),
          totalIncome: totalIncome.toFixed(2),
          totalExpenses: totalExpenses.toFixed(2),
          budget: budget.toFixed(2),
          title: 'Dashboard',
        });
      } else {
        console.log(
          'User not found. Destroying session and redirecting to login.'
        );
        req.session.destroy();
        res.redirect('/login');
      }
    })
    .catch((err) => {
      console.error('Error fetching user data:', err);
      res.status(500).render('error', { message: 'An error occurred' });
    });
});
module.exports = router;
