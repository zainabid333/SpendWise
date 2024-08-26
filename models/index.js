const User = require('./User');
const Expense = require('./Expense');
const Category = require('./Category');

// Define associations here
User.hasMany(Expense, {
  foreignKey: 'userId',
  as: 'expenses',
});

Expense.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Category.hasMany(Expense, {
  foreignKey: 'categoryId',
  as: 'expenses',
});

Expense.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Export models and sequelize connection
module.exports = { User, Expense, Category };
