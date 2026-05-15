import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';
import { fetchAllPersons, fetchPersonLedger } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import PageHeader from '../components/PageHeader';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

export default function Ledger() {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  useEffect(() => {
    fetchAllPersons({ search })
      .then(res => setPersons(res.data))
      .catch(() => toast.error('Failed'))
      .finally(() => setLoading(false));
  }, [search]);

  const viewLedger = async (name) => {
    try {
      setSelectedPerson(name);
      setLedgerLoading(true);
      const res = await fetchPersonLedger(name);
      setLedgerData(res.data);
    } catch (e) { toast.error(e.message); }
    finally { setLedgerLoading(false); }
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Person Ledger" showSettings />
      <div className="px-4 pt-3 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" placeholder="Search person..." value={search} onChange={e => setSearch(e.target.value)} className="mobile-input pl-10" />
        </div>

        {selectedPerson && ledgerData ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <button onClick={() => { setSelectedPerson(null); setLedgerData(null); }} className="flex items-center gap-1 text-sm text-primary-500 font-semibold">← Back to list</button>
            <div className="glass-card p-4 text-center">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-2">
                <User size={24} className="text-primary-600" />
              </div>
              <h3 className="font-bold text-lg text-surface-900 dark:text-white">{ledgerData.personName}</h3>
              <p className="text-xs text-surface-400">{ledgerData.transactionCount} transactions</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="gradient-card-green p-3 text-center"><p className="text-[10px] opacity-80">Received</p><p className="text-sm font-bold">{formatCurrency(ledgerData.totalReceived)}</p></div>
              <div className="gradient-card-red p-3 text-center"><p className="text-[10px] opacity-80">Given</p><p className="text-sm font-bold">{formatCurrency(ledgerData.totalGiven)}</p></div>
              <div className={`p-3 text-center ${ledgerData.pendingBalance >= 0 ? 'gradient-card-blue' : 'gradient-card-amber'}`}><p className="text-[10px] opacity-80">Balance</p><p className="text-sm font-bold">{formatCurrency(ledgerData.pendingBalance)}</p></div>
            </div>
            {ledgerLoading ? <LoadingSkeleton count={3} /> : (
              <div className="space-y-2">
                {ledgerData.transactions.map((t, i) => (
                  <motion.div key={t._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="glass-card p-3 flex items-center gap-3"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === 'Income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      {t.type === 'Income' ? <ArrowDownLeft size={16} className="text-emerald-600" /> : <ArrowUpRight size={16} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-900 dark:text-white">{t.transactionId}</p>
                      <p className="text-[10px] text-surface-400">{t.category} · {formatDate(t.date)}</p>
                    </div>
                    <p className={`font-bold text-sm ${t.type === 'Income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {loading ? <LoadingSkeleton count={5} /> : persons.length === 0 ? (
              <EmptyState title="No persons found" message="Transactions with person names will appear here" icon={User} />
            ) : (
              <div className="space-y-2">
                {persons.map((p, i) => (
                  <motion.div key={p.personName} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => viewLedger(p.personName)}
                    className="glass-card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="font-bold text-primary-600 text-sm">{p.personName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{p.personName}</p>
                      <p className="text-[10px] text-surface-400">{p.transactionCount} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${p.pendingBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(p.pendingBalance)}</p>
                      <p className="text-[10px] text-surface-400">balance</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
