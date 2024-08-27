require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(db, dbUser, dbPassword, {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
