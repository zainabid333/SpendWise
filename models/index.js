const User = require("./User");
const Expense = require("./Expense");

// Call the associate method on both models
User.associate({ Expense });
Expense.associate({ User });

module.exports = { User, Expense };
