import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.messages?.[0] || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Dashboard
export const fetchDashboard = () => api.get('/dashboard/summary');

// Transactions
export const fetchTransactions = (params) => api.get('/transactions', { params });
export const fetchTransactionById = (id) => api.get(`/transactions/${id}`);
export const fetchTransactionByCode = (code) => api.get(`/transactions/code/${code}`);
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const fetchPersonNames = () => api.get('/transactions/persons/list');

// Expenses
export const fetchExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Reports
export const fetchReport = (params) => api.get('/reports', { params });

// Ledger
export const fetchAllPersons = (params) => api.get('/ledger', { params });
export const fetchPersonLedger = (name) => api.get(`/ledger/${encodeURIComponent(name)}`);

export default api;
