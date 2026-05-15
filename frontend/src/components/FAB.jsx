import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAB() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on add/edit pages
  if (['/add-transaction', '/settings'].some(p => location.pathname.startsWith(p)) || location.pathname.match(/\/transactions\/edit\//)) {
    return null;
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate('/add-transaction')}
      className="fixed bottom-20 right-5 z-50 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-lg shadow-primary-500/40 flex items-center justify-center active:shadow-md transition-shadow"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <Plus size={26} strokeWidth={2.5} />
    </motion.button>
  );
}
