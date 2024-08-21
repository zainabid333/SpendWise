const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const {
  isAuthenticated,
  isNotAuthenticated,
} = require('./middleware/authMiddleware');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./models');
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sync database
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database connected');
});

//session middleware

app.use(
  session({
    secret: 'MySuperDooperSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

//Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

//Routes

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('');
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/transactions', (req, res) => {
  res.render('transaction');
});

app.get('/newUserPortal', (req, res) => {
  res.render('newUserPortal');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
