const express = require('express');
const router = express.Router();
const { Expense, User, Category } = require('../models');
const { Op } = require('sequelize');

//Add new Category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });

    res.redirect('/expenses');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render('categories', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});
module.exports = router;
