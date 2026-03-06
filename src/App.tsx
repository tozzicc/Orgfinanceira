import { useState, useEffect } from 'react';
import { useFinance } from './hooks/useFinance';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  const finance = useFinance();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="layout-root">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard totals={finance.totals} balance={finance.balance} />
        )}
        {activeTab === 'transactions' && (
          <Transactions
            transactions={finance.transactions}
            categories={finance.categories}
            addTransaction={finance.addTransaction}
            deleteTransaction={finance.deleteTransaction}
          />
        )}
        {['income', 'expenses', 'investments', 'settings'].includes(activeTab) && (
          <div className="glass-card placeholder-card">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p>Esta seção está em desenvolvimento. Use a aba "Lançamentos" para gerenciar seus dados.</p>
          </div>
        )}
      </main>

      <style>{`
        .layout-root {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          min-height: 100vh;
        }
        
        .main-content {
          flex: 1;
        }
        
        .placeholder-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 1rem;
        }
        
        .placeholder-card h2 {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        @media (max-width: 1024px) {
          .layout-root {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
            position: static;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
