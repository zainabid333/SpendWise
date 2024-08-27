const express = require("express");
const router = express.Router();
const { User } = require("../models");

//SignUp route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    req.session.userId = user.id; // Store the user ID in session
    res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(400)
      .render("signup", { error: "Signup failed. Please try again." });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && (await user.validPassword(password))) {
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
        }
        res.redirect("/dashboard");
      });
    } else {
      res.status(400).render("login", { error: "Invalid password or email." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .render("login", { error: "Login failed. Please try again." });
  }
});

//Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = router;
