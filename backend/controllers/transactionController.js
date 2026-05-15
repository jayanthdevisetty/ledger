const Transaction = require('../models/Transaction');
const generateTransactionId = require('../utils/generateTransactionId');

// @desc    Create transaction
// @route   POST /api/transactions
exports.createTransaction = async (req, res, next) => {
  try {
    const { type, category, personName, paymentMode, amount, date, notes } = req.body;
    
    const transactionId = await generateTransactionId(category);
    
    const transaction = await Transaction.create({
      transactionId,
      type,
      category,
      personName: personName || '',
      paymentMode,
      amount,
      date: date || new Date(),
      notes: notes || ''
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions with pagination, search, filters
// @route   GET /api/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, type, paymentMode, startDate, endDate } = req.query;
    const query = {};

    // Search by person name or transaction ID
    if (search) {
      query.$or = [
        { personName: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (type) query.type = type;
    if (paymentMode) query.paymentMode = paymentMode;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction by MongoDB ID
// @route   GET /api/transactions/:id
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction by custom transactionId
// @route   GET /api/transactions/code/:transactionId
exports.getTransactionByCode = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.transactionId });
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique person names for autocomplete
// @route   GET /api/transactions/persons/list
exports.getPersonNames = async (req, res, next) => {
  try {
    const persons = await Transaction.distinct('personName', { personName: { $ne: '' } });
    res.json({ success: true, data: persons.sort() });
  } catch (error) {
    next(error);
  }
};
