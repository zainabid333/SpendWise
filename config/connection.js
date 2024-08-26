const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('expensewise', 'postgres', 'Elisse24!', {
  host: 'localhost',
  dialect: 'postgres',
});
module.exports = sequelize;
