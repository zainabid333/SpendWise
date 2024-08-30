const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models');

// SignUp route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    req.session.userId = user.id; // Store the user ID in session
    console.log('Session userId before save:', req.session.userId);
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).render('signup', {
          error: 'Failed to save session. Please try again.'
        });
      }
      res.redirect('/dashboard'); // Redirect to dashboard after signup
    });
  } catch (error) {
    console.error('Signup error:', error);
    res
      .status(400)
      .render('signup', { error: 'Signup failed. Please try again.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    const comparePassword = await bcrypt.compare(password, user.password);

    if (user && comparePassword) {
      req.session.userId = user.id; // Correctly set the user ID
      console.log('Session userId before save:', req.session.userId);
      console.log(email, password, user.password);
      req.session.save(err => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).render('login', {
            error: 'Failed to save session. Please try again.'
          });
        }
        console.log('Session saved successfully:', req.session);
        res.redirect('/dashboard');
      });
    } else if (!user) {
      console.log('User not found');
      res.status(400).render('login', { error: 'Invalid email or password.' });
    } else {
      console.log(email, password, user.password);
      res.status(400).render('login', { error: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(500)
      .render('login', { error: 'Login failed. Please try again.' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
