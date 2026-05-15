const Transaction = require('../models/Transaction');

// @desc    Get person ledger
// @route   GET /api/ledger/:personName
exports.getPersonLedger = async (req, res, next) => {
  try {
    const personName = decodeURIComponent(req.params.personName);
    
    // Get all transactions for this person
    const transactions = await Transaction.find({
      personName: { $regex: new RegExp(`^${personName}$`, 'i') }
    }).sort({ date: -1 });

    if (transactions.length === 0) {
      return res.json({
        success: true,
        data: {
          personName,
          totalGiven: 0,
          totalReceived: 0,
          pendingBalance: 0,
          transactionCount: 0,
          transactions: []
        }
      });
    }

    // Aggregate totals
    const aggregation = await Transaction.aggregate([
      { $match: { personName: { $regex: new RegExp(`^${personName}$`, 'i') } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalReceived = 0; // Income from this person (they paid us)
    let totalGiven = 0;    // Expense to this person (we paid them)

    aggregation.forEach(item => {
      if (item._id === 'Income') totalReceived = item.total;
      if (item._id === 'Expense') totalGiven = item.total;
    });

    const pendingBalance = totalReceived - totalGiven;

    res.json({
      success: true,
      data: {
        personName,
        totalGiven,
        totalReceived,
        pendingBalance,
        transactionCount: transactions.length,
        transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all persons with summaries
// @route   GET /api/ledger
exports.getAllPersons = async (req, res, next) => {
  try {
    const { search } = req.query;
    const matchStage = { personName: { $ne: '' } };
    if (search) {
      matchStage.personName = { $regex: search, $options: 'i' };
    }

    const persons = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { personName: '$personName', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.personName',
          summary: {
            $push: {
              type: '$_id.type',
              total: '$total',
              count: '$count'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const result = persons.map(p => {
      let totalReceived = 0, totalGiven = 0, transactionCount = 0;
      p.summary.forEach(s => {
        transactionCount += s.count;
        if (s.type === 'Income') totalReceived = s.total;
        if (s.type === 'Expense') totalGiven = s.total;
      });
      return {
        personName: p._id,
        totalGiven,
        totalReceived,
        pendingBalance: totalReceived - totalGiven,
        transactionCount
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
