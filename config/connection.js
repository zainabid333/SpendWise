const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('expensewise', 'postgres', 'Bonnet0912', {
  host: 'localhost',
  dialect: 'postgres',
});
module.exports = sequelize;
