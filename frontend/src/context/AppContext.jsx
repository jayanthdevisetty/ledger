import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fms-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('fms-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, refreshKey, triggerRefresh }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
