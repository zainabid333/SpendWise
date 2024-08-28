require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres'
        // port: process.env.DB_PORT || 5432
      }
    );

module.exports = sequelize;
