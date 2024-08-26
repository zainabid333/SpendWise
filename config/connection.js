const { Sequelize } = require('sequelize');
<<<<<<< HEAD
const sequelize = new Sequelize('expensewise', 'postgres', 'Elisse24!', {
=======
require('dotenv').config();
const db = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(db, dbUser, dbPassword, {
>>>>>>> 1764c7238b89927a1425ca4623e69adc0af51a08
  host: 'localhost',
  dialect: 'postgres',
});
module.exports = sequelize;
