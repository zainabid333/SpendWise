const express = require("express");
const router = express.Router();
const { User } = require("../models");

//Sign Up route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && (await user.comparePassword(password))) {
      req.session.userId = user.id;
      res.json({ message: "Login successful", userId: user.id });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: err.message });
  });
  res.json({ message: "Logout successful" });
});
