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
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
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

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user.id;
      console.log('Session userId before save:', req.session.userId);

      req.session.save(err => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).send('Failed to save session.');
        }
        console.log('Session saved successfully:', req.session);
        res.redirect('/dashboard');
      });
    } else {
      res.status(400).render('login', { error: 'Invalid password or email.' });
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
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
