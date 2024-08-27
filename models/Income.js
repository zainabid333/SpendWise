//Models/Income
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Income = sequelize.define('Income', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Income;
