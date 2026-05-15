const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionByCode,
  updateTransaction,
  deleteTransaction,
  getPersonNames
} = require('../controllers/transactionController');

// Validation rules
const transactionValidation = [
  body('type').isIn(['Income', 'Expense']).withMessage('Type must be Income or Expense'),
  body('category').isIn(['Tent House', 'Chiti']).withMessage('Category must be Tent House or Chiti'),
  body('paymentMode').isIn(['Cash', 'PhonePe', 'Google Pay', 'Bank Transfer']).withMessage('Invalid payment mode'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  validate
];

// Person names autocomplete — must be before /:id
router.get('/persons/list', getPersonNames);

// Custom ID lookup — must be before /:id
router.get('/code/:transactionId', getTransactionByCode);

router.route('/')
  .get(getTransactions)
  .post(transactionValidation, createTransaction);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
