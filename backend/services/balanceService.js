const Transaction = require('../models/Transaction');
const CommonExpense = require('../models/CommonExpense');

/**
 * Calculate all balances using MongoDB aggregation pipelines
 */
async function calculateBalances() {
  // Transaction aggregation by type and category
  const transactionAgg = await Transaction.aggregate([
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: '$amount' }
      }
    }
  ]);

  // Paid common expenses total
  const paidExpensesAgg = await CommonExpense.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // Pending common expenses total
  const pendingExpensesAgg = await CommonExpense.aggregate([
    { $match: { status: 'Pending' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // Parse aggregation results
  let tentHouseIncome = 0, tentHouseExpense = 0;
  let chitiIncome = 0, chitiExpense = 0;

  transactionAgg.forEach(item => {
    const { type, category } = item._id;
    if (category === 'Tent House' && type === 'Income') tentHouseIncome = item.total;
    if (category === 'Tent House' && type === 'Expense') tentHouseExpense = item.total;
    if (category === 'Chiti' && type === 'Income') chitiIncome = item.total;
    if (category === 'Chiti' && type === 'Expense') chitiExpense = item.total;
  });

  const paidCommonExpenses = paidExpensesAgg[0]?.total || 0;
  const pendingCommonExpenses = pendingExpensesAgg[0]?.total || 0;

  const tentHouseBalance = tentHouseIncome - tentHouseExpense - paidCommonExpenses;
  const chitiBalance = chitiIncome - chitiExpense;
  const overallBalance = tentHouseBalance + chitiBalance;

  return {
    tentHouseIncome,
    tentHouseExpense,
    chitiIncome,
    chitiExpense,
    paidCommonExpenses,
    pendingCommonExpenses,
    tentHouseBalance,
    chitiBalance,
    overallBalance
  };
}

/**
 * Get today's income and expense totals
 */
async function getTodaySummary() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayAgg = await Transaction.aggregate([
    { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  let todayIncome = 0, todayExpense = 0;
  todayAgg.forEach(item => {
    if (item._id === 'Income') todayIncome = item.total;
    if (item._id === 'Expense') todayExpense = item.total;
  });

  return { todayIncome, todayExpense };
}

/**
 * Get monthly income vs expense data for chart
 */
async function getMonthlyChartData(year) {
  const chartData = await Transaction.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31T23:59:59.999Z`)
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = months.map((name, index) => {
    const monthNum = index + 1;
    const income = chartData.find(d => d._id.month === monthNum && d._id.type === 'Income')?.total || 0;
    const expense = chartData.find(d => d._id.month === monthNum && d._id.type === 'Expense')?.total || 0;
    return { name, income, expense };
  });

  return result;
}

module.exports = { calculateBalances, getTodaySummary, getMonthlyChartData };
