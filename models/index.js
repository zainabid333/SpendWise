const User = require('./User');
const Expense = require('./Expense');
const Category = require('./Category');

// Call the associate method on both models
User.associate({ Expense });
Expense.associate({ User });
Category.associate({ Expense });

module.exports = { User, Expense };
