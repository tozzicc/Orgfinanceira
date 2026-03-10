import { useState, useEffect } from 'react';
import { useFinance } from './hooks/useFinance';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Settings } from './components/Settings';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

import { DateProvider, useDate } from './contexts/DateContext';
import { DateSelector } from './components/DateSelector';

// ── App financeiro (role=user) ─────────────────────────────────
function FinanceAppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  );
  const finance = useFinance();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <PreferencesProvider>
      <div className="layout-root">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />

        <main className="main-content">
          {finance.error && (
            <div className="api-error-banner">
              <span>⚠️ {finance.error}</span>
              <button onClick={finance.refetch}>Tentar novamente</button>
            </div>
          )}

          {/* Seletor de Data visível apenas no Dashboard e Transações */}
          {['dashboard', 'transactions'].includes(activeTab) && <DateSelector />}

          {finance.loading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <p>Carregando dados...</p>
            </div>
          )}

          {!finance.loading && activeTab === 'dashboard' && (
            <Dashboard totals={finance.totals} balance={finance.balance} />
          )}
          {!finance.loading && activeTab === 'transactions' && (
            <Transactions
              transactions={finance.transactions}
              categories={finance.categories}
              addTransaction={finance.addTransaction}
              deleteTransaction={finance.deleteTransaction}
            />
          )}
          {!finance.loading && activeTab === 'settings' && <Settings />}
          {!finance.loading && ['income', 'expenses', 'investments'].includes(activeTab) && (
            <div className="glass-card placeholder-card">
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <p>Esta seção está em desenvolvimento.</p>
            </div>
          )}
        </main>

        <style>{`
          .layout-root { display:flex; gap:2rem; padding:2rem; min-height:100vh; }
          .main-content { flex:1; position:relative; }
          .api-error-banner {
            display:flex; align-items:center; justify-content:space-between;
            background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4);
            border-radius:10px; padding:0.75rem 1.25rem; margin-bottom:1.5rem;
            color:#f87171; font-size:0.9rem; gap:1rem;
          }
          .api-error-banner button {
            background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.5);
            color:#f87171; border-radius:6px; padding:0.3rem 0.75rem;
            cursor:pointer; font-size:0.8rem; white-space:nowrap;
          }
          .loading-overlay { display:flex; flex-direction:column; align-items:center; justify-content:center; height:400px; gap:1rem; opacity:0.6; }
          .loading-spinner { width:40px; height:40px; border:3px solid rgba(255,255,255,0.1); border-top-color:var(--accent,#6366f1); border-radius:50%; animation:spin 0.8s linear infinite; }
          @keyframes spin { to { transform:rotate(360deg); } }
          .placeholder-card { display:flex; flex-direction:column; align-items:center; justify-content:center; height:400px; gap:1rem; }
          .placeholder-card h2 { background:var(--primary-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          @media (max-width:1024px) { .layout-root { flex-direction:column; } }
        `}</style>
      </div>
    </PreferencesProvider>
  );
}

// ── App financeiro (role=user) ───────────────────────────────
function FinanceApp() {
  return (
    <DateProvider>
      <FinanceAppContent />
    </DateProvider>
  );
}

// ── Root com roteamento por role ───────────────────────────────
function AppRouter() {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
        <style>{`.loading-spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,0.1);border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;}@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    );
  }

  if (!user) return <LoginPage />;
  if (isAdmin) return <AdminPage />;
  return <FinanceApp />;
}

// ── Export principal ───────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
