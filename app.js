const express = require('express');
const exphbs = require('express-handlebars');
const hbshelpers = require('./helpers/handlebars');
const path = require('path');
const session = require('express-session'); // Keep this one
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const { User, Expense } = require('./models');
const RedisStore = require('connect-redis').default; // Updated syntax
const { createClient } = require('redis');

// Create the Redis client
let redisClient = createClient({
  legacyMode: true, // Enable legacy mode if you're using older Redis commands
  url: 'redis://localhost:6379' // Replace with your Redis URL
});

redisClient.connect().catch(console.error);

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
    store: new RedisStore({ client: redisClient }),
    secret: 'byJustForMe',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use((req, res, next) => {
  res.locals.user =
    req.session && req.session.userId ? { id: req.session.userId } : null;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/expenses', require('./routes/expenses'));
app.use('/income', require('./routes/income'));
app.use('/categories', require('./routes/categories'));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
