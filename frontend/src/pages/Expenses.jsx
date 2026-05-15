import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Plus, Check, Clock, Trash2, Edit2, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { getMonthName } from '../utils/formatDate';
import { EXPENSE_PRESETS } from '../utils/constants';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

export default function Expenses() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { triggerRefresh } = useApp();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { expenseName: '', amount: '', status: 'Pending', notes: '' }
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchExpenses({ month, year });
      setExpenses(res.data);
      setSummary(res.summary);
    } catch (e) { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [month, year]);

  const changeMonth = (dir) => {
    let m = month + dir, y = year;
    if (m > 12) { m = 1; y++; } else if (m < 1) { m = 12; y--; }
    setMonth(m); setYear(y);
  };

  const openAdd = () => { reset({ expenseName: '', amount: '', status: 'Pending', notes: '' }); setEditingId(null); setShowForm(true); };
  const openEdit = (exp) => { reset({ expenseName: exp.expenseName, amount: exp.amount, status: exp.status, notes: exp.notes }); setEditingId(exp._id); setShowForm(true); };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      data.amount = parseFloat(data.amount);
      data.month = month; data.year = year;
      if (editingId) { await updateExpense(editingId, data); toast.success('Updated'); }
      else { await createExpense(data); toast.success('Added'); }
      setShowForm(false); triggerRefresh(); load();
    } catch (e) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const toggleStatus = async (exp) => {
    try {
      const newStatus = exp.status === 'Paid' ? 'Pending' : 'Paid';
      await updateExpense(exp._id, { ...exp, status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      triggerRefresh(); load();
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    try { await deleteExpense(deleteId); toast.success('Deleted'); triggerRefresh(); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Monthly Expenses" showSettings />
      <div className="px-4 pt-3 space-y-4">
        {/* Month Selector */}
        <div className="flex items-center justify-between glass-card px-4 py-3">
          <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center"><ChevronLeft size={18} /></button>
          <p className="font-bold text-surface-900 dark:text-white">{getMonthName(month)} {year}</p>
          <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center"><ChevronRight size={18} /></button>
        </div>

        {/* Summary */}
        {!loading && (
          <div className="grid grid-cols-3 gap-2">
            <div className="gradient-card-blue p-3 text-center"><p className="text-[10px] opacity-80">Total</p><p className="text-sm font-bold">{formatCurrency(summary.totalAmount)}</p></div>
            <div className="gradient-card-green p-3 text-center"><p className="text-[10px] opacity-80">Paid</p><p className="text-sm font-bold">{formatCurrency(summary.paidAmount)}</p></div>
            <div className="gradient-card-amber p-3 text-center"><p className="text-[10px] opacity-80">Pending</p><p className="text-sm font-bold">{formatCurrency(summary.pendingAmount)}</p></div>
          </div>
        )}

        {/* Add Button */}
        <button onClick={openAdd} className="w-full mobile-btn-primary"><Plus size={18} />Add Expense</button>

        {/* Expenses List */}
        {loading ? <LoadingSkeleton count={4} /> : expenses.length === 0 ? (
          <EmptyState title="No expenses" message={`No expenses for ${getMonthName(month)} ${year}`} />
        ) : (
          <div className="space-y-2">
            {expenses.map((exp, i) => (
              <motion.div key={exp._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <button onClick={() => toggleStatus(exp)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    exp.status === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                  }`}
                >
                  {exp.status === 'Paid' ? <Check size={18} className="text-emerald-600" /> : <Clock size={18} className="text-amber-600" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{exp.expenseName}</p>
                  <p className={`text-xs font-medium ${exp.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{exp.status}</p>
                </div>
                <p className="font-bold text-sm text-surface-900 dark:text-white">{formatCurrency(exp.amount)}</p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(exp)} className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center"><Edit2 size={14} className="text-surface-500" /></button>
                  <button onClick={() => setDeleteId(exp._id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Bottom Sheet */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-surface-800 rounded-t-3xl p-6 max-w-lg mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-surface-900 dark:text-white">{editingId ? 'Edit' : 'Add'} Expense</h3>
                <button onClick={() => setShowForm(false)}><X size={20} className="text-surface-400" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Presets */}
                {!editingId && (
                  <div className="flex flex-wrap gap-2">
                    {EXPENSE_PRESETS.map(p => (
                      <button key={p} type="button" onClick={() => setValue('expenseName', p)} className="chip chip-inactive text-xs">{p}</button>
                    ))}
                  </div>
                )}
                <input {...register('expenseName', { required: 'Required' })} placeholder="Expense name" className="mobile-input" />
                {errors.expenseName && <p className="text-red-500 text-xs">{errors.expenseName.message}</p>}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-surface-400">₹</span>
                  <input {...register('amount', { required: 'Required', min: { value: 1, message: '>0' } })} type="number" placeholder="0" className="mobile-input pl-10 text-lg font-bold" inputMode="numeric" />
                </div>
                <select {...register('status')} className="mobile-input">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
                <textarea {...register('notes')} placeholder="Notes (optional)" rows={2} className="mobile-input resize-none" />
                <button type="submit" disabled={submitting} className="w-full mobile-btn-primary">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingId ? 'Update' : 'Add')}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Expense?" message="This cannot be undone." />
    </div>
  );
}
