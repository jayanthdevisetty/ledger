import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', message = 'Start by adding your first entry', icon: Icon = Inbox }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <Icon size={36} className="text-surface-300 dark:text-surface-600" />
      </div>
      <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-400 mb-1">{title}</h3>
      <p className="text-sm text-surface-400 dark:text-surface-500 text-center">{message}</p>
    </motion.div>
  );
}
