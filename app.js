const express = require('express');
const exphbs = require('express-handlebars');
const hbshelpers = require('./helpers/handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const { User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup handlebars.js engine with custom helpers
const hbs = exphbs.create({
  helpers: hbshelpers,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Allow access to prototype properties
    allowProtoMethodsByDefault: true // Allow access to prototype methods (if needed)
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'One Little Catelina',
    store: new SequelizeStore({
      db: sequelize
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Fetch user and store in res.locals
app.use(async (req, res, next) => {
  console.log('Session UserId before checking:', req.session.userId); // Debugging line
  if (req.session && req.session.userId) {
    try {
      const user = await User.findByPk(req.session.userId);
      res.locals.user = user ? user.get({ plain: true }) : null;
      console.log('User fetched from database:', res.locals.user); // Debugging line
    } catch (err) {
      console.error('Error fetching user:', err);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/expenses', require('./routes/expenses'));
app.use('/income', require('./routes/income'));
app.use('/categories', require('./routes/categories'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Sync and start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
