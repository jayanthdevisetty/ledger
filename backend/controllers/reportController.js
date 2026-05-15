const Transaction = require('../models/Transaction');
const CommonExpense = require('../models/CommonExpense');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO } = require('date-fns');

// @desc    Get report data
// @route   GET /api/reports
exports.getReport = async (req, res, next) => {
  try {
    const { period = 'monthly', date } = req.query;
    const referenceDate = date ? parseISO(date) : new Date();

    let dateRange = {};
    switch (period) {
      case 'daily':
        dateRange = { $gte: startOfDay(referenceDate), $lte: endOfDay(referenceDate) };
        break;
      case 'weekly':
        dateRange = { $gte: startOfWeek(referenceDate, { weekStartsOn: 1 }), $lte: endOfWeek(referenceDate, { weekStartsOn: 1 }) };
        break;
      case 'monthly':
        dateRange = { $gte: startOfMonth(referenceDate), $lte: endOfMonth(referenceDate) };
        break;
      case 'yearly':
        dateRange = { $gte: startOfYear(referenceDate), $lte: endOfYear(referenceDate) };
        break;
      default:
        dateRange = { $gte: startOfMonth(referenceDate), $lte: endOfMonth(referenceDate) };
    }

    // Aggregate transactions in date range
    const transactionAgg = await Transaction.aggregate([
      { $match: { date: dateRange } },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment mode breakdown
    const paymentModeAgg = await Transaction.aggregate([
      { $match: { date: dateRange } },
      {
        $group: {
          _id: '$paymentMode',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily breakdown for the period
    const dailyBreakdown = await Transaction.aggregate([
      { $match: { date: dateRange } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Common expenses in range (for monthly/yearly)
    let commonExpenses = [];
    if (period === 'monthly' || period === 'yearly') {
      const month = referenceDate.getMonth() + 1;
      const year = referenceDate.getFullYear();
      const expenseQuery = period === 'monthly'
        ? { month, year }
        : { year };
      commonExpenses = await CommonExpense.find(expenseQuery);
    }

    // Parse results
    let totalIncome = 0, totalExpense = 0;
    let tentHouseIncome = 0, tentHouseExpense = 0;
    let chitiIncome = 0, chitiExpense = 0;
    let transactionCount = 0;

    transactionAgg.forEach(item => {
      const { type, category } = item._id;
      transactionCount += item.count;
      if (type === 'Income') {
        totalIncome += item.total;
        if (category === 'Tent House') tentHouseIncome = item.total;
        if (category === 'Chiti') chitiIncome = item.total;
      } else {
        totalExpense += item.total;
        if (category === 'Tent House') tentHouseExpense = item.total;
        if (category === 'Chiti') chitiExpense = item.total;
      }
    });

    const paidExpenses = commonExpenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalIncome - totalExpense - paidExpenses;

    // Format daily breakdown for chart
    const chartData = {};
    dailyBreakdown.forEach(item => {
      if (!chartData[item._id.date]) {
        chartData[item._id.date] = { date: item._id.date, income: 0, expense: 0 };
      }
      if (item._id.type === 'Income') chartData[item._id.date].income = item.total;
      else chartData[item._id.date].expense = item.total;
    });

    // Transactions list
    const transactions = await Transaction.find({ date: dateRange }).sort({ date: -1 });

    res.json({
      success: true,
      data: {
        period,
        dateRange: { start: dateRange.$gte, end: dateRange.$lte },
        totalIncome,
        totalExpense,
        paidExpenses,
        netProfit,
        transactionCount,
        breakdown: {
          tentHouseIncome,
          tentHouseExpense,
          chitiIncome,
          chitiExpense
        },
        paymentModes: paymentModeAgg.map(p => ({ mode: p._id, total: p.total, count: p.count })),
        chartData: Object.values(chartData),
        commonExpenses,
        transactions
      }
    });
  } catch (error) {
    next(error);
  }
};
