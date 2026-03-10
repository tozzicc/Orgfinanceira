import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

import { API_URL } from '../config';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restaurar sessão do localStorage
    useEffect(() => {
        const saved = localStorage.getItem('auth_token');
        if (saved) {
            // Validar token com o servidor
            fetch(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${saved}` },
            })
                .then(r => r.ok ? r.json() : Promise.reject())
                .then((u: AuthUser) => { setToken(saved); setUser(u); })
                .catch(() => localStorage.removeItem('auth_token'))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Erro ao fazer login');
        }
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
    };

    // Wrapper de fetch que injeta o Bearer token
    const authFetch = useCallback((url: string, options: RequestInit = {}) => {
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
    }, [token]);

    return (
        <AuthContext.Provider value={{
            user, token, isAdmin: user?.role === 'admin', isLoading, login, logout, authFetch,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
