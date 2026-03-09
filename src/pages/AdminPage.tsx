import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Users, Plus, LogOut, Shield, ToggleLeft, ToggleRight,
    Trash2, X, Eye, EyeOff, CheckCircle, XCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: string;
    _count: { transactions: number };
}

export function AdminPage() {
    const { user, logout, authFetch } = useAuth();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await authFetch(`${API_URL}/api/admin/users`);
            const data = await res.json();
            setUsers(data);
        } catch {
            setError('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggle = async (id: string) => {
        await authFetch(`${API_URL}/api/admin/users/${id}/toggle`, { method: 'PATCH' });
        fetchUsers();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Remover o usuário "${name}" e todos os seus dados?`)) return;
        await authFetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    };

    return (
        <div className="admin-root">
            {/* Header */}
            <header className="admin-header glass-card">
                <div className="admin-brand">
                    <div className="admin-badge"><Shield size={20} /></div>
                    <div>
                        <h1>Painel Administrativo</h1>
                        <p>Logado como <strong>{user?.name}</strong></p>
                    </div>
                </div>
                <button className="btn-logout" onClick={logout}>
                    <LogOut size={16} /> Sair
                </button>
            </header>

            {/* Body */}
            <div className="admin-body">
                {/* Stats */}
                <div className="admin-stats">
                    <Stat label="Total de usuários" value={users.length} color="#6366f1" />
                    <Stat label="Ativos" value={users.filter(u => u.active && u.role !== 'admin').length} color="#10b981" />
                    <Stat label="Inativos" value={users.filter(u => !u.active).length} color="#ef4444" />
                </div>

                {/* Tabela */}
                <div className="glass-card table-wrap">
                    <div className="table-header">
                        <div className="table-title">
                            <Users size={18} />
                            <h2>Usuários</h2>
                        </div>
                        <button className="btn-new" onClick={() => setShowModal(true)}>
                            <Plus size={16} /> Novo Usuário
                        </button>
                    </div>

                    {error && <div className="admin-error">{error}</div>}

                    {loading ? (
                        <div className="admin-loading"><div className="loading-spinner" /></div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Usuário</th>
                                    <th>Email</th>
                                    <th>Perfil</th>
                                    <th>Lançamentos</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="td-name">{u.name}</td>
                                        <td className="td-email">{u.email}</td>
                                        <td>
                                            <span className={`role-badge role-${u.role}`}>
                                                {u.role === 'admin' ? '👑 Admin' : '👤 Usuário'}
                                            </span>
                                        </td>
                                        <td className="td-center">{u._count?.transactions ?? 0}</td>
                                        <td>
                                            {u.active
                                                ? <span className="status-badge active"><CheckCircle size={13} /> Ativo</span>
                                                : <span className="status-badge inactive"><XCircle size={13} /> Inativo</span>
                                            }
                                        </td>
                                        <td className="td-actions">
                                            {u.role !== 'admin' && (
                                                <>
                                                    <button
                                                        className={`btn-toggle ${u.active ? 'on' : 'off'}`}
                                                        onClick={() => handleToggle(u.id)}
                                                        title={u.active ? 'Desativar' : 'Ativar'}
                                                    >
                                                        {u.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                    </button>
                                                    <button
                                                        className="btn-del"
                                                        onClick={() => handleDelete(u.id, u.name)}
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <NewUserModal
                    onClose={() => setShowModal(false)}
                    onCreated={fetchUsers}
                    authFetch={authFetch}
                />
            )}

            <style>{`
        .admin-root {
          min-height: 100vh;
          background: var(--bg-primary, #0f172a);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-badge {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }

        .admin-brand h1 {
          font-size: 1.25rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .admin-brand p { font-size: 0.8rem; color: var(--text-secondary, #94a3b8); }
        .admin-brand strong { color: var(--text-primary, #f1f5f9); }

        .btn-logout {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }
        .btn-logout:hover { background: rgba(239,68,68,0.22); }

        .admin-body { display: flex; flex-direction: column; gap: 1.25rem; }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }

        .table-wrap { padding: 0; overflow: hidden; }

        .table-header {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-glass, rgba(255,255,255,0.08));
        }

        .table-title {
          display: flex; align-items: center; gap: 0.6rem;
          color: var(--text-primary, #f1f5f9); font-weight: 600;
        }
        .table-title h2 { font-size: 1rem; }

        .btn-new {
          display: flex; align-items: center; gap: 0.4rem;
          background: var(--primary-gradient, linear-gradient(135deg,#6366f1,#8b5cf6));
          color: white; border: none;
          padding: 0.5rem 1.1rem;
          border-radius: 8px; cursor: pointer;
          font-weight: 600; font-size: 0.875rem;
          transition: opacity 0.2s, transform 0.2s;
        }
        .btn-new:hover { opacity: 0.9; transform: translateY(-1px); }

        .admin-table {
          width: 100%; border-collapse: collapse; text-align: left;
        }
        .admin-table th, .admin-table td {
          padding: 0.9rem 1.5rem;
          border-bottom: 1px solid var(--border-glass, rgba(255,255,255,0.06));
        }
        .admin-table th {
          color: var(--text-secondary, #94a3b8);
          font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .td-name { font-weight: 600; color: var(--text-primary, #f1f5f9); }
        .td-email { color: var(--text-secondary, #94a3b8); font-size: 0.875rem; }
        .td-center { text-align: center; }
        .td-actions { display: flex; align-items: center; gap: 0.5rem; }

        .role-badge {
          padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 600;
        }
        .role-admin { background: rgba(99,102,241,0.15); color: #818cf8; }
        .role-user  { background: rgba(148,163,184,0.1); color: #94a3b8; }

        .status-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 600;
        }
        .status-badge.active   { background: rgba(16,185,129,0.12); color: #34d399; }
        .status-badge.inactive { background: rgba(239,68,68,0.12);  color: #f87171; }

        .btn-toggle { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; transition: opacity 0.2s; }
        .btn-toggle.on  { color: #34d399; }
        .btn-toggle.off { color: #94a3b8; }
        .btn-toggle:hover { opacity: 0.75; }

        .btn-del { background: none; border: none; color: #f87171; cursor: pointer; padding: 4px; border-radius: 6px; transition: opacity 0.2s; }
        .btn-del:hover { opacity: 0.75; }

        .admin-error {
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
          color: #f87171; padding: 0.6rem 1rem; margin: 0 1.5rem; border-radius: 8px; font-size: 0.875rem;
        }

        .admin-loading {
          display: flex; justify-content: center; padding: 3rem;
        }
        .loading-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #6366f1;
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}

// ── Stat card ─────────────────────────────────────────────────
function Stat({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="glass-card stat-mini">
            <span className="stat-mini-value" style={{ color }}>{value}</span>
            <span className="stat-mini-label">{label}</span>
            <style>{`
        .stat-mini { display:flex; flex-direction:column; gap:0.25rem; }
        .stat-mini-value { font-size:2rem; font-weight:700; }
        .stat-mini-label { font-size:0.8rem; color:var(--text-secondary,#94a3b8); }
      `}</style>
        </div>
    );
}

// ── Modal novo usuário ────────────────────────────────────────
function NewUserModal({ onClose, onCreated, authFetch }: {
    onClose: () => void;
    onCreated: () => void;
    authFetch: (url: string, opts?: RequestInit) => Promise<Response>;
}) {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const res = await authFetch(`${API_URL}/api/admin/users`, {
                method: 'POST',
                body: JSON.stringify({ ...form, role: 'user' }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Erro ao criar usuário');
            }
            onCreated();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-card modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                    <h3>Novo Usuário</h3>
                    <button className="modal-close" onClick={onClose}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {(['name', 'email'] as const).map(f => (
                        <div className="mfield" key={f}>
                            <label>{f === 'name' ? 'Nome' : 'Email'}</label>
                            <input
                                type={f === 'email' ? 'email' : 'text'}
                                value={form[f]}
                                onChange={e => setForm({ ...form, [f]: e.target.value })}
                                placeholder={f === 'name' ? 'Nome completo' : 'email@exemplo.com'}
                                required
                            />
                        </div>
                    ))}

                    <div className="mfield">
                        <label>Senha</label>
                        <div className="pass-wrap">
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                                required
                            />
                            <button type="button" className="pass-eye" onClick={() => setShowPass(p => !p)}>
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="modal-error">{error}</div>}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={saving}>
                            {saving ? <span className="mini-spin" /> : 'Criar Usuário'}
                        </button>
                    </div>
                </form>

                <style>{`
          .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px); }
          .modal-box { width:100%;max-width:440px;display:flex;flex-direction:column;gap:1.5rem; }
          .modal-head { display:flex;justify-content:space-between;align-items:center; }
          .modal-head h3 { font-size:1.1rem;font-weight:700;color:var(--text-primary); }
          .modal-close { background:none;border:none;color:var(--text-secondary);cursor:pointer;padding:4px;border-radius:6px; }
          .modal-form { display:flex;flex-direction:column;gap:1rem; }
          .mfield { display:flex;flex-direction:column;gap:0.4rem; }
          .mfield label { font-size:0.82rem;color:var(--text-secondary);font-weight:500; }
          .mfield input, .pass-wrap input {
            background:rgba(255,255,255,0.05);border:1px solid var(--border-glass);
            color:var(--text-primary);padding:0.65rem 0.9rem;border-radius:8px;font-size:0.9rem;outline:none;width:100%;
          }
          .mfield input:focus, .pass-wrap input:focus { border-color:#6366f1; }
          .pass-wrap { position:relative;display:flex;align-items:center; }
          .pass-wrap input { padding-right:2.5rem; }
          .pass-eye { position:absolute;right:0.75rem;background:none;border:none;color:var(--text-secondary);cursor:pointer; }
          .modal-error { background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#f87171;border-radius:8px;padding:0.5rem 0.8rem;font-size:0.82rem; }
          .modal-actions { display:flex;justify-content:flex-end;gap:0.75rem;margin-top:0.5rem; }
          .btn-cancel { background:transparent;border:1px solid var(--border-glass);color:var(--text-secondary);padding:0.55rem 1.2rem;border-radius:8px;cursor:pointer; }
          .btn-save { background:var(--primary-gradient,linear-gradient(135deg,#6366f1,#8b5cf6));color:white;border:none;padding:0.55rem 1.4rem;border-radius:8px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;min-width:120px; }
          .btn-save:disabled { opacity:0.65;cursor:not-allowed; }
          .mini-spin { width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite; }
        `}</style>
            </div>
        </div>
    );
}
