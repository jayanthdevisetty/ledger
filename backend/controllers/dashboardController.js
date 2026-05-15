const Transaction = require('../models/Transaction');
const { calculateBalances, getTodaySummary, getMonthlyChartData } = require('../services/balanceService');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const [balances, todaySummary, chartData, recentTransactions] = await Promise.all([
      calculateBalances(),
      getTodaySummary(),
      getMonthlyChartData(new Date().getFullYear()),
      Transaction.find().sort({ date: -1, createdAt: -1 }).limit(10)
    ]);

    res.json({
      success: true,
      data: {
        todayIncome: todaySummary.todayIncome,
        todayExpense: todaySummary.todayExpense,
        ...balances,
        chartData,
        recentTransactions
      }
    });
  } catch (error) {
    next(error);
  }
};
