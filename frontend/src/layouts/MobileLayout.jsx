import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import FAB from '../components/FAB';

export default function MobileLayout() {
  return (
    <div className="min-h-screen max-w-lg mx-auto relative bg-surface-50 dark:bg-surface-950">
      <main className="pb-24">
        <Outlet />
      </main>
      <FAB />
      <BottomNav />
    </div>
  );
}
