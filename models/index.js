// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/connection');
const UserModel = require('./User');

const User = new UserModel(sequelize);

module.exports = {
  sequelize,
  Sequelize,
  User,
};
