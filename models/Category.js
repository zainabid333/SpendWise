const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Category;
