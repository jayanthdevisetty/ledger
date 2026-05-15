import { motion } from 'framer-motion';

export default function SummaryCard({ title, value, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`${gradient} p-4 relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
      <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={16} className="opacity-80" />}
          <p className="text-xs font-medium opacity-80">{title}</p>
        </div>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
