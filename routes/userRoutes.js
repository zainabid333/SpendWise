const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/authMiddleware');

router.post('/register', isNotAuthenticated, userController.register);
router.post('/login', isNotAuthenticated, userController.login);
router.post('/logout', isAuthenticated, userController.logout);

module.exports = router;