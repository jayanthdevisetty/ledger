import { motion } from 'framer-motion';
import { Moon, Sun, Info, Database, Trash2, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <div className="min-h-screen">
      <PageHeader title="Settings" showBack />
      <div className="px-4 pt-4 space-y-4">
        {/* Dark Mode */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              {darkMode ? <Moon size={18} className="text-indigo-500" /> : <Sun size={18} className="text-amber-500" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-surface-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-surface-400">{darkMode ? 'On' : 'Off'}</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${darkMode ? 'bg-primary-500' : 'bg-surface-300'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </motion.div>

        {/* App Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Info size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-surface-900 dark:text-white">About FMS</p>
              <p className="text-xs text-surface-400">v1.0.0</p>
            </div>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
            Financial Management System for Tent House & Shamiyana business. Track income, expenses, chiti collections, and generate reports.
          </p>
        </motion.div>

        {/* Database Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Database size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-surface-900 dark:text-white">Database</p>
            <p className="text-xs text-surface-400">MongoDB Atlas Connected</p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs text-surface-400 flex items-center justify-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for Tent House Business
          </p>
        </div>
      </div>
    </div>
  );
}
