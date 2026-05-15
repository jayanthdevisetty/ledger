import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { fetchTransactions } from '../services/api';
import { useApp } from '../context/AppContext';
import TransactionCard from '../components/TransactionCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Tent House', 'Chiti'];
const TYPES = ['All', 'Income', 'Expense'];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'All', type: 'All' });
  const [showFilters, setShowFilters] = useState(false);
  const { refreshKey } = useApp();
  const navigate = useNavigate();

  const loadTransactions = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.type !== 'All') params.type = filters.type;

      const res = await fetchTransactions(params);
      setTransactions(prev => append ? [...prev, ...res.data] : res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, refreshKey]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadTransactions();
  };

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      loadTransactions(pagination.page + 1, true);
    }
  };

  return (
    <div>
      <PageHeader title="Transactions" showSettings />

      <div className="px-4 pt-3 space-y-3">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mobile-input pl-10 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-surface-500 font-medium">{pagination.total} transactions</p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-xs text-primary-500 font-semibold"
          >
            <Filter size={14} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2"
          >
            <div>
              <p className="text-[10px] text-surface-400 font-medium mb-1.5 uppercase tracking-wider">Category</p>
              <div className="flex gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                    className={`chip ${filters.category === cat ? 'chip-active' : 'chip-inactive'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-surface-400 font-medium mb-1.5 uppercase tracking-wider">Type</p>
              <div className="flex gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilters(prev => ({ ...prev, type: t }))}
                    className={`chip ${filters.type === t ? 'chip-active' : 'chip-inactive'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Transaction List */}
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions"
            message="Add your first transaction using the + button"
          />
        ) : (
          <div className="space-y-2">
            {transactions.map((t, i) => (
              <TransactionCard
                key={t._id}
                transaction={t}
                index={i}
                onClick={() => navigate(`/transactions/${t._id}`)}
              />
            ))}

            {/* Load More */}
            {pagination.page < pagination.pages && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-3 text-sm text-primary-500 font-semibold active:scale-95 transition-transform"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
