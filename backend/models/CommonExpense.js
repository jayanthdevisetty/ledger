const mongoose = require('mongoose');

const commonExpenseSchema = new mongoose.Schema({
  expenseName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
commonExpenseSchema.index({ month: 1, year: 1 });
commonExpenseSchema.index({ status: 1 });

module.exports = mongoose.model('CommonExpense', commonExpenseSchema);
