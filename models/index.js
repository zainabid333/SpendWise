const Sequelize = require("sequelize");
const sequelize = require("../config/connection");
const UserModel = require("./User");

const User = UserModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  User,
};

module.exports = db;
