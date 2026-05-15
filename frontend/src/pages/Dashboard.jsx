import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, TrendingDown, Wallet, PiggyBank, Scale, Clock,
  ArrowDownLeft, ArrowUpRight, Plus, RefreshCw
} from 'lucide-react';
import { fetchDashboard } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshKey, darkMode } = useApp();
  const navigate = useNavigate();

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await fetchDashboard();
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshKey]);

  const handleRefresh = () => {
    loadDashboard(true);
    toast.success('Dashboard refreshed');
  };

  if (loading) {
    return (
      <div className="px-4 pt-4">
        <PageHeader title="FMS" showSettings />
        <div className="mt-4 space-y-4">
          <LoadingSkeleton type="summary" count={6} />
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton count={3} />
        </div>
      </div>
    );
  }

  const summaryCards = [
    { title: "Today's Income", value: formatCurrency(data?.todayIncome || 0), icon: ArrowDownLeft, gradient: 'gradient-card-green' },
    { title: "Today's Expense", value: formatCurrency(data?.todayExpense || 0), icon: ArrowUpRight, gradient: 'gradient-card-red' },
    { title: 'Tent House Balance', value: formatCurrency(data?.tentHouseBalance || 0), icon: Wallet, gradient: 'gradient-card-blue' },
    { title: 'Chiti Balance', value: formatCurrency(data?.chitiBalance || 0), icon: PiggyBank, gradient: 'gradient-card-purple' },
    { title: 'Overall Balance', value: formatCurrency(data?.overallBalance || 0), icon: Scale, gradient: 'gradient-card-teal' },
    { title: 'Pending Expenses', value: formatCurrency(data?.pendingCommonExpenses || 0), icon: Clock, gradient: 'gradient-card-amber' },
  ];

  return (
    <div>
      <PageHeader 
        title="FMS" 
        showSettings 
        rightAction={
          <button
            onClick={handleRefresh}
            className={`w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center active:scale-90 transition-transform ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={16} className="text-surface-600 dark:text-surface-300" />
          </button>
        }
      />

      <div className="px-4 pt-4 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {summaryCards.map((card, i) => (
            <SummaryCard key={card.title} {...card} delay={i * 0.05} />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <button
            onClick={() => navigate('/add-transaction')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm active:scale-95 transition-transform shadow-lg shadow-primary-500/30"
          >
            <Plus size={18} />
            Add Income
          </button>
          <button
            onClick={() => navigate('/add-transaction')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-800 dark:bg-surface-700 text-white font-semibold text-sm active:scale-95 transition-transform shadow-lg"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </motion.div>

        {/* Monthly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-4"
        >
          <h2 className="font-bold text-sm text-surface-900 dark:text-white mb-3">Monthly Overview</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    background: darkMode ? '#1e293b' : '#fff',
                    color: darkMode ? '#fff' : '#0f172a',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [formatCurrency(value)]}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-xs text-surface-500">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-xs text-surface-500">Expense</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-surface-900 dark:text-white">Recent Transactions</h2>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs text-primary-500 font-semibold"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {data?.recentTransactions?.length > 0 ? (
              data.recentTransactions.map((t, i) => (
                <TransactionCard
                  key={t._id}
                  transaction={t}
                  index={i}
                  onClick={() => navigate(`/transactions/${t._id}`)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-surface-400 text-sm">
                No transactions yet. Add your first one!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
