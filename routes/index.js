const express = require("express");
const router = express.Router();
const { User, Expense } = require("../models");
const session = require("express-session");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

// Home page
router.get("/", (req, res) => {
  res.render("home");
});

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

//graph route
router.get("/graph", isAuthenticated, (req, res) => {
  User.findByPk(req.session.userId, {
    include: [
      {
        model: Expense,
        as: "expenses",
        order: [["createdAt", "DESC"]],
      },
    ],
    attributes: { exclude: ["password"] },
  })
    .then((user) => {
      if (user) {
        res.render("graph", { user: user.toJSON(), title: "Expense Graph" });
      } else {
        console.log("User not found. Redirecting to login.");
        req.session.destroy();
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.error("Error fetching user data for graph:", err);
      res.status(500).render("error", { message: "An error occurred" });
    });
});
// Dashboard
router.get("/dashboard", (req, res) => {
  // console.log("Dashboard route hit. Session:", req.session);
  if (!req.session.userId) {
    console.log("No user ID in session. Redirecting to login.");
    return res.redirect("/login");
  }
  User.findByPk(req.session.userId, {
    include: [
      {
        model: Expense,
        as: "expenses",
        order: [["createdAt", "DESC"]],
        // limit: 5,
      },
    ],
    attributes: { exclude: ["password"] },
  })
    .then((user) => {
      if (user) {
        // console.log(
        //   "User found. Rendering dashboard.",
        //   console.log(user.toJSON())
        // );
        // console.log("Session info", req.session.userId);
        res.render("dashboard", { user: user.toJSON(), title: "Dashboard" });
      } else {
        console.log(
          "User not found. Destroying session and redirecting to login."
        );
        req.session.destroy();
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.error("Error fetching user data:", err);
      res.status(500).render("error", { message: "An error occurred" });
    });
});
module.exports = router;
