const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

const Expense = sequelize.define("Expense", {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

Expense.associate = function (models) {
  Expense.belongsTo(models.User, {
    foreignKey: "userId", // Explicitly set the foreign key
    as: "user", // Set an alias if required (consistent with User model)
  });
};

module.exports = Expense;
