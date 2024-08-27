const express = require('express');
const router = express.Router();
const { Income } = require('../models');

// Render income form
router.get('/', (req, res) => {
  res.render('income');
});

// Create income
router.post('/', async (req, res) => {
  try {
    const income = await Income.create({
      userId: req.session.userId,
      amount: req.body.amount,
      description: req.body.description,
      date: req.body.date || new Date(),
    });
    res.render('income', { income });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get all income
router.get('/', async (req, res) => {
  try {
    const income = await Income.findAll({
      where: {
        userId: req.session.userId,
      },
    });
    res.status(200).json(income);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
