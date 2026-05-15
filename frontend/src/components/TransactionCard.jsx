import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Banknote, Smartphone, Building2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

const paymentIcons = {
  Cash: Banknote,
  PhonePe: Smartphone,
  'Google Pay': Smartphone,
  'Bank Transfer': Building2,
};

export default function TransactionCard({ transaction, onClick, index = 0 }) {
  const { type, category, personName, paymentMode, amount, date, transactionId } = transaction;
  const isIncome = type === 'Income';
  const PaymentIcon = paymentIcons[paymentMode] || Banknote;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="glass-card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
    >
      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isIncome 
          ? 'bg-emerald-100 dark:bg-emerald-900/30' 
          : 'bg-red-100 dark:bg-red-900/30'
      }`}>
        {isIncome 
          ? <ArrowDownLeft size={20} className="text-emerald-600 dark:text-emerald-400" />
          : <ArrowUpRight size={20} className="text-red-500 dark:text-red-400" />
        }
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">
          {personName || category}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            category === 'Tent House'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
          }`}>
            {category}
          </span>
          <span className="text-[10px] text-surface-400 flex items-center gap-0.5">
            <PaymentIcon size={10} />
            {paymentMode}
          </span>
        </div>
      </div>

      {/* Amount & Date */}
      <div className="text-right flex-shrink-0">
        <p className={`font-bold text-sm ${
          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
        }`}>
          {isIncome ? '+' : '-'}{formatCurrency(amount)}
        </p>
        <p className="text-[10px] text-surface-400 mt-0.5">{formatDate(date)}</p>
      </div>
    </motion.div>
  );
}
