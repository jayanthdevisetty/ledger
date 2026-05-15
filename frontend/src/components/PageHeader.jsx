import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Settings } from 'lucide-react';

export default function PageHeader({ title, showBack = false, showSettings = false, rightAction }) {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-surface-100 dark:border-surface-800"
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} className="text-surface-600 dark:text-surface-300" />
          </button>
        )}
        <h1 className="text-lg font-bold text-surface-900 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {rightAction}
        {showSettings && (
          <button
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Settings size={18} className="text-surface-600 dark:text-surface-300" />
          </button>
        )}
      </div>
    </motion.header>
  );
}
