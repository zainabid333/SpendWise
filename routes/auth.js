const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as necessary
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// SignUp route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    req.session.userId = newUser.id;
    console.log('Session userId before save:', req.session.userId);
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).render('signup', {
          error: 'Failed to save session. Please try again.'
        });
      }
      res.redirect('/dashboard');
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
    console.log('Login attempt with email:', email);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res
        .status(400)
        .render('login', { error: 'Invalid email or password.' });
    }

    console.log('Stored hashed password:', user.password);

    const comparePassword = bcrypt.compareSync(password, user.password);
    console.log('Password comparison result:', comparePassword);

    if (comparePassword) {
      req.session.userId = user.id;
      console.log('Session userId before save:', req.session.userId);
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
    } else {
      console.log('Invalid password');
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
