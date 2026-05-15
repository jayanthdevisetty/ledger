import { Routes, Route } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import TransactionDetail from './pages/TransactionDetail';
import Expenses from './pages/Expenses';
import Ledger from './pages/Ledger';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />
        <Route path="/transactions/edit/:id" element={<EditTransaction />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
