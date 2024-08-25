const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("spendme", "postgres", "legion", {
  host: "localhost",
  dialect: "postgres",
});
module.exports = sequelize;
