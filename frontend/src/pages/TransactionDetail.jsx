import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Banknote, Smartphone, Building2, Calendar, User, Tag, Hash, FileText, Edit, Trash2 } from 'lucide-react';
import { fetchTransactionById, deleteTransaction } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const paymentIcons = { Cash: Banknote, PhonePe: Smartphone, 'Google Pay': Smartphone, 'Bank Transfer': Building2 };

export default function TransactionDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const { triggerRefresh } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactionById(id).then(res => setTransaction(res.data)).catch(() => toast.error('Not found')).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try { await deleteTransaction(id); toast.success('Deleted'); triggerRefresh(); navigate(-1); } catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="px-4 pt-4"><PageHeader title="Transaction" showBack /><LoadingSkeleton count={5} /></div>;
  if (!transaction) return <div className="px-4 pt-4"><PageHeader title="Transaction" showBack /><p className="text-center text-surface-400 mt-10">Not found</p></div>;

  const { type, category, personName, paymentMode, amount, date, notes, transactionId } = transaction;
  const isIncome = type === 'Income';
  const PIcon = paymentIcons[paymentMode] || Banknote;
  const items = [
    { icon: Hash, label: 'Transaction ID', value: transactionId },
    { icon: Tag, label: 'Category', value: category },
    { icon: isIncome ? ArrowDownLeft : ArrowUpRight, label: 'Type', value: type },
    { icon: User, label: 'Person', value: personName || '—' },
    { icon: PIcon, label: 'Payment Mode', value: paymentMode },
    { icon: Calendar, label: 'Date', value: formatDateTime(date) },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <PageHeader title="Details" showBack />
      <div className="px-4 pt-4 space-y-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`${isIncome ? 'gradient-card-green' : 'gradient-card-red'} p-6 text-center`}>
          <p className="text-sm opacity-80 mb-1">{isIncome ? 'Income' : 'Expense'}</p>
          <p className="text-3xl font-bold">{formatCurrency(amount)}</p>
          <p className="text-xs opacity-60 mt-2">{transactionId}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card divide-y divide-surface-100 dark:divide-surface-700">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center"><it.icon size={16} className="text-surface-500" /></div>
              <div><p className="text-[10px] text-surface-400 uppercase">{it.label}</p><p className="text-sm font-medium text-surface-900 dark:text-white">{it.value}</p></div>
            </div>
          ))}
          {notes && <div className="px-4 py-3.5"><p className="text-[10px] text-surface-400 uppercase">Notes</p><p className="text-sm text-surface-700 dark:text-surface-300">{notes}</p></div>}
        </motion.div>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/transactions/edit/${id}`)} className="flex-1 mobile-btn bg-blue-500 text-white shadow-lg shadow-blue-500/30"><Edit size={18} />Edit</button>
          <button onClick={() => setShowDelete(true)} className="flex-1 mobile-btn-danger"><Trash2 size={18} />Delete</button>
        </div>
      </div>
      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete?" message={`Delete ${transactionId}? Cannot be undone.`} />
    </div>
  );
}
