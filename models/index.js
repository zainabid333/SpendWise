const User = require('./User');
const Expense = require('./Expense');
const Category = require('./Category');
const Income = require('./Income');

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

//Income Association
User.hasMany(Income, {
  foreignKey: 'userId',
  as: 'incomes',
});
Income.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
// Export models and sequelize connection
module.exports = { User, Expense, Category, Income };
