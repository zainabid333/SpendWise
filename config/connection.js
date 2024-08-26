const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('expensewise', 'postgres', 'legion', {
  host: 'localhost',
  dialect: 'postgres',
});
module.exports = sequelize;
