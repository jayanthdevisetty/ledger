import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  ArrowDownLeft, ArrowUpRight, Tent, Link2, Banknote, 
  Smartphone, Building2, Calendar, User, FileText, Loader2 
} from 'lucide-react';
import { createTransaction, fetchPersonNames } from '../services/api';
import { useApp } from '../context/AppContext';
import { PAYMENT_MODES } from '../utils/constants';
import { formatInputDate } from '../utils/formatDate';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';

const paymentIcons = { Cash: Banknote, PhonePe: Smartphone, 'Google Pay': Smartphone, 'Bank Transfer': Building2 };

export default function AddTransaction() {
  const [submitting, setSubmitting] = useState(false);
  const [personSuggestions, setPersonSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { triggerRefresh } = useApp();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      type: 'Income',
      category: 'Tent House',
      personName: '',
      paymentMode: 'Cash',
      amount: '',
      date: formatInputDate(new Date()),
      notes: '',
    }
  });

  const type = watch('type');
  const category = watch('category');
  const paymentMode = watch('paymentMode');
  const personName = watch('personName');

  useEffect(() => {
    fetchPersonNames().then(res => {
      setPersonSuggestions(res.data || []);
    }).catch(() => {});
  }, []);

  const filteredSuggestions = personSuggestions.filter(p =>
    p.toLowerCase().includes((personName || '').toLowerCase()) && p.toLowerCase() !== (personName || '').toLowerCase()
  ).slice(0, 5);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      data.amount = parseFloat(data.amount);
      const res = await createTransaction(data);
      toast.success(`Transaction ${res.data.transactionId} created!`);
      triggerRefresh();
      navigate(-1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <PageHeader title="Add Transaction" showBack />

      <form onSubmit={handleSubmit(onSubmit)} className="px-4 pt-4 space-y-5 pb-8">
        {/* Type Toggle */}
        <div>
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 block">Type</label>
          <div className="grid grid-cols-2 gap-2 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
            {['Income', 'Expense'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setValue('type', t)}
                className={`py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  type === t
                    ? t === 'Income'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'text-surface-500'
                }`}
              >
                {t === 'Income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Category Toggle */}
        <div>
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 block">Category</label>
          <div className="grid grid-cols-2 gap-2 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
            {['Tent House', 'Chiti'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setValue('category', c)}
                className={`py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  category === c
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-surface-500'
                }`}
              >
                {c === 'Tent House' ? <Tent size={18} /> : <Link2 size={18} />}
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Person Name */}
        <div className="relative">
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 block">Person Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              {...register('personName')}
              type="text"
              placeholder="Enter person name"
              className="mobile-input pl-10"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
            >
              {filteredSuggestions.map(name => (
                <button
                  key={name}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setValue('personName', name); setShowSuggestions(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 border-b border-surface-100 dark:border-surface-700 last:border-0"
                >
                  {name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Payment Mode */}
        <div>
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 block">Payment Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_MODES.map(pm => {
              const Icon = paymentIcons[pm.value];
              return (
                <button
                  key={pm.value}
                  type="button"
                  onClick={() => setValue('paymentMode', pm.value)}
                  className={`py-3 px-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 border ${
                    paymentMode === pm.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-md'
                      : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <Icon size={18} />
                  {pm.value}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-surface-400">₹</span>
            <input
              {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Must be greater than 0' } })}
              type="number"
              placeholder="0"
              className="mobile-input pl-10 text-2xl font-bold"
              inputMode="numeric"
            />
          </div>
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 block">Date</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              className="mobile-input pl-10"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 block">Notes (Optional)</label>
          <div className="relative">
            <FileText size={18} className="absolute left-3.5 top-4 text-surface-400" />
            <textarea
              {...register('notes')}
              placeholder="Add notes..."
              rows={3}
              className="mobile-input pl-10 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={submitting}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-4 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all ${
            type === 'Income'
              ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
              : 'bg-red-500 shadow-lg shadow-red-500/30'
          } disabled:opacity-50`}
        >
          {submitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              {type === 'Income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              Add {type}
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
