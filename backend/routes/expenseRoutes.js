const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

const expenseValidation = [
  body('expenseName').notEmpty().withMessage('Expense name is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').isInt({ min: 2020 }).withMessage('Valid year is required'),
  body('status').optional().isIn(['Paid', 'Pending']).withMessage('Status must be Paid or Pending'),
  validate
];

router.route('/')
  .get(getExpenses)
  .post(expenseValidation, createExpense);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
