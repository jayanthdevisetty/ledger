const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true
  },
  category: {
    type: String,
    enum: ['Tent House', 'Chiti'],
    required: true
  },
  personName: {
    type: String,
    trim: true,
    default: ''
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'PhonePe', 'Google Pay', 'Bank Transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for optimized queries
transactionSchema.index({ category: 1 });
transactionSchema.index({ personName: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
