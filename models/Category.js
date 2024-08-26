const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Category.associate = function (models) {
  Category.hasMany(models.Expense, {
    foreignKey: 'categoryId',
    as: 'expenses',
  });
};
module.exports = Category;
