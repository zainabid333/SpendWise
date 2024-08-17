const express = require('express');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const authRoutes = require('./routes/auth');

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
app.use('/auth', authRoutes);
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
app.get('');
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
