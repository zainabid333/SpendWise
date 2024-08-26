const express = require('express');
// const { ExpressHandlebars } = require("express-handlebars");
const exphbs = require('express-handlebars');
const hbshelpers = require('./helpers/handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const { User, Expense } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

//setup handlebars.js engine with custom helpers
const hbs = exphbs.create({
  helpers: hbshelpers,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Allow access to prototype properties
    allowProtoMethodsByDefault: true, // Allow access to prototype methods (if needed)
  },
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//setup session
app.use(
  session({
    secret: 'your_secret_key',
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use((req, res, next) => {
  res.locals.user =
    req.session && req.session.userId ? { id: req.session.userId } : null;
  next();
});

//Routes to be added later time

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/expenses', require('./routes/expenses'));
app.use('/income', require('./routes/income'));
app.use('/categories', require('./routes/categories'));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
