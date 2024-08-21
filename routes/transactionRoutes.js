const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, transactionController.getTransactions);
router.post('/', isAuthenticated, transactionController.createTransaction);
router.delete('/:id', isAuthenticated, transactionController.deleteTransaction);

module.exports = router;