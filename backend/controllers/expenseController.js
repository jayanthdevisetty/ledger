const CommonExpense = require('../models/CommonExpense');

// @desc    Create common expense
// @route   POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const expense = await CommonExpense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all expenses with optional month/year filter
// @route   GET /api/expenses
exports.getExpenses = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const expenses = await CommonExpense.find(query).sort({ createdAt: -1 });
    
    // Calculate totals
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const paidAmount = expenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
    const pendingAmount = expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      data: expenses,
      summary: { totalAmount, paidAmount, pendingAmount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await CommonExpense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await CommonExpense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
