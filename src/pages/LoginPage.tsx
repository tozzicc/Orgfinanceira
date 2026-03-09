import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, TrendingUp, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-root">
            <div className="login-card glass-card">
                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-icon-wrap">
                        <TrendingUp size={32} />
                    </div>
                    <h1>Organização Financeira</h1>
                    <p>Faça login para acessar sua conta</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label>Email</label>
                        <div className="input-wrap">
                            <Mail size={16} className="input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label>Senha</label>
                        <div className="input-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-pass"
                                onClick={() => setShowPass(p => !p)}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <span className="login-spinner" /> : 'Entrar'}
                    </button>
                </form>
            </div>

            <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: var(--bg-primary, #0f172a);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .login-logo {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: var(--primary-gradient, linear-gradient(135deg,#6366f1,#8b5cf6));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }

        .login-logo h1 {
          font-size: 1.4rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-logo p {
          color: var(--text-secondary, #94a3b8);
          font-size: 0.875rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .login-field label {
          font-size: 0.85rem;
          color: var(--text-secondary, #94a3b8);
          font-weight: 500;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.875rem;
          color: var(--text-secondary, #94a3b8);
          pointer-events: none;
        }

        .input-wrap input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass, rgba(255,255,255,0.1));
          color: var(--text-primary, #f1f5f9);
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 10px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-wrap input:focus {
          border-color: #6366f1;
          background: rgba(255,255,255,0.08);
        }

        .toggle-pass {
          position: absolute;
          right: 0.875rem;
          background: none;
          border: none;
          color: var(--text-secondary, #94a3b8);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .login-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.35);
          color: #f87171;
          border-radius: 8px;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          text-align: center;
        }

        .login-btn {
          width: 100%;
          padding: 0.85rem;
          background: var(--primary-gradient, linear-gradient(135deg,#6366f1,#8b5cf6));
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          margin-top: 0.25rem;
        }

        .login-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
