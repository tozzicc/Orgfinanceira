import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  PieChart,
  Wallet,
  Sun,
  Moon,
  LogOut,
  User
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
  const { user, logout } = useAuth();

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

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuário'}</span>
            <span className="user-role">{user?.role === 'admin' ? 'Administrador' : 'Conta Pessoal'}</span>
          </div>
        </div>

        <button className="logout-button" onClick={logout} title="Sair da conta">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>

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

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-glass);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.05);
          color: #f87171;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .logout-button:hover {
          background: rgba(239, 68, 68, 0.15);
          transform: translateY(-1px);
        }
      `}</style>
    </aside>
  );
}
