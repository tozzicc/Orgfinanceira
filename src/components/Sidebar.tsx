import React from 'react';
import {
  LayoutDashboard,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  PieChart,
  Wallet,
  Sun,
  Moon,
  DollarSign
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Lançamentos', icon: Wallet },
  { id: 'income', label: 'Receitas', icon: ArrowUpCircle },
  { id: 'expenses', label: 'Despesas', icon: ArrowDownCircle },
  { id: 'investments', label: 'Investimentos', icon: PieChart },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, theme, toggleTheme }: SidebarProps) {
  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-header">
        <h2 className="logo-text">Organização Financeira</h2>
        <button onClick={toggleTheme} className="theme-toggle" title="Alternar Tema">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <nav className="nav-menu">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              'nav-item',
              activeTab === item.id && 'active'
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        .sidebar {
          width: 260px;
          height: calc(100vh - 4rem);
          position: sticky;
          top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          color: #6366f1;
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
        }
        
        .theme-toggle {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
        
        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-size: 1rem;
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        
        .nav-item.active {
          background: var(--primary-gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </aside>
  );
}
