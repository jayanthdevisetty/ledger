import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, Receipt, Users, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/ledger', icon: Users, label: 'Ledger' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function BottomNav() {
  const location = useLocation();
  // Hide on add/edit pages
  if (['/add-transaction', '/settings'].some(p => location.pathname.startsWith(p)) || location.pathname.match(/\/transactions\/edit\//)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-t border-surface-200/50 dark:border-surface-700/50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] relative"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -inset-2 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
