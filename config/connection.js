require('dotenv').config();

const { Sequelize } = require('sequelize');

// Create a new connection to the database
//check if DB_URL is present in the environment
if (process.env.DB_URL) {
  module.exports = new Sequelize(process.env.DB_URL);
} else {
  module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres'
    }
  );
}
