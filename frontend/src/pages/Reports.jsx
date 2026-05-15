import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Printer, FileSpreadsheet, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { fetchReport } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatInputDate } from '../utils/formatDate';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const PERIODS = ['daily', 'weekly', 'monthly', 'yearly'];

export default function Reports() {
  const [period, setPeriod] = useState('monthly');
  const [date, setDate] = useState(formatInputDate(new Date()));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useApp();

  useEffect(() => {
    setLoading(true);
    fetchReport({ period, date })
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false));
  }, [period, date]);

  const exportCSV = () => {
    if (!data?.transactions?.length) return toast.error('No data');
    const headers = 'ID,Type,Category,Person,Mode,Amount,Date,Notes\n';
    const rows = data.transactions.map(t =>
      `${t.transactionId},${t.type},${t.category},${t.personName},${t.paymentMode},${t.amount},${new Date(t.date).toLocaleDateString()},${t.notes}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `fms-report-${period}-${date}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="min-h-screen">
      <PageHeader title="Reports" showSettings />
      <div className="px-4 pt-3 space-y-4">
        {/* Period Selector */}
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`chip flex-1 text-center capitalize ${period === p ? 'chip-active' : 'chip-inactive'}`}
            >{p}</button>
          ))}
        </div>

        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mobile-input" />

        {loading ? (
          <div className="space-y-3"><LoadingSkeleton type="summary" count={3} /><LoadingSkeleton type="chart" /></div>
        ) : data ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="gradient-card-green p-3 text-center">
                <TrendingUp size={16} className="mx-auto mb-1 opacity-80" />
                <p className="text-[10px] opacity-80">Income</p>
                <p className="text-sm font-bold">{formatCurrency(data.totalIncome)}</p>
              </div>
              <div className="gradient-card-red p-3 text-center">
                <TrendingDown size={16} className="mx-auto mb-1 opacity-80" />
                <p className="text-[10px] opacity-80">Expense</p>
                <p className="text-sm font-bold">{formatCurrency(data.totalExpense)}</p>
              </div>
              <div className={`p-3 text-center ${data.netProfit >= 0 ? 'gradient-card-teal' : 'gradient-card-amber'}`}>
                <Scale size={16} className="mx-auto mb-1 opacity-80" />
                <p className="text-[10px] opacity-80">{data.netProfit >= 0 ? 'Profit' : 'Loss'}</p>
                <p className="text-sm font-bold">{formatCurrency(Math.abs(data.netProfit))}</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="glass-card p-4 space-y-3">
              <h3 className="font-bold text-sm text-surface-900 dark:text-white">Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-surface-500">Tent House Income</span><span className="font-medium text-emerald-500">{formatCurrency(data.breakdown.tentHouseIncome)}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Tent House Expense</span><span className="font-medium text-red-500">{formatCurrency(data.breakdown.tentHouseExpense)}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Chiti Income</span><span className="font-medium text-emerald-500">{formatCurrency(data.breakdown.chitiIncome)}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Chiti Expense</span><span className="font-medium text-red-500">{formatCurrency(data.breakdown.chitiExpense)}</span></div>
                {data.paidExpenses > 0 && <div className="flex justify-between border-t border-surface-100 dark:border-surface-700 pt-2"><span className="text-surface-500">Common Expenses (Paid)</span><span className="font-medium text-red-500">{formatCurrency(data.paidExpenses)}</span></div>}
              </div>
            </div>

            {/* Chart */}
            {data.chartData?.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="font-bold text-sm text-surface-900 dark:text-white mb-3">Daily Trend</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                      <YAxis tick={{ fontSize: 9, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#0f172a', fontSize: '12px' }} />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Payment Modes */}
            {data.paymentModes?.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="font-bold text-sm text-surface-900 dark:text-white mb-3">Payment Modes</h3>
                <div className="space-y-2">
                  {data.paymentModes.map(pm => (
                    <div key={pm.mode} className="flex items-center justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">{pm.mode}</span>
                      <div className="text-right">
                        <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(pm.total)}</span>
                        <span className="text-[10px] text-surface-400 ml-2">({pm.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Actions */}
            <div className="flex gap-2">
              <button onClick={exportCSV} className="flex-1 mobile-btn-ghost"><FileSpreadsheet size={16} />CSV</button>
              <button onClick={handlePrint} className="flex-1 mobile-btn-ghost"><Printer size={16} />Print</button>
            </div>

            {/* Stats */}
            <div className="text-center text-xs text-surface-400 pb-4">
              {data.transactionCount} transactions in this period
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
