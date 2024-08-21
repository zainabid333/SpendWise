
//  * @file userRoutes.js
//  * @description This file contains the routes for user authentication and creation.
//  * @module userRoutes
 

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = require('express').Router();
const { use } = require('../auth');
const { User } = require('../models/user');
const hashPassword=bcrypt.hashSync(req.body.password,10);

router.postt('/', async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      res.status(200).json(userData);
      console.log(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
