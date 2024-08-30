const { Sequelize,DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
//Budget calculation
User.prototype.calculateBudget = async function (name) {
  const totalIncome = await this.getIncome({
    attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
  });
  const totalExpense = await this.getExpense({
    attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
  });
  const incomeTotal = totalIncome[0].dataValues.total || 0;
  const expenseTotal = totalExpense[0].dataValues.total || 0;
  return incomeTotal - expenseTotal;
};

module.exports = User;
