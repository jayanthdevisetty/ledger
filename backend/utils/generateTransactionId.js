const Counter = require('../models/Counter');

/**
 * Generate a custom transaction ID like FMS-TENT-0001 or FMS-CHITI-0001
 * Uses atomic findOneAndUpdate for concurrency safety
 */
async function generateTransactionId(category) {
  const prefix = category === 'Tent House' ? 'TENT' : 'CHITI';
  
  const counter = await Counter.findOneAndUpdate(
    { _id: prefix },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(4, '0');
  return `FMS-${prefix}-${paddedSeq}`;
}

module.exports = generateTransactionId;
