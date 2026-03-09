import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface FinanceData {
    transactions: Transaction[];
    categories: Category[];
}

export function useFinance() {
    const { authFetch } = useAuth();

    const [data, setData] = useState<FinanceData>({ transactions: [], categories: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Buscar dados do backend ──────────────────────────────────
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [txRes, catRes] = await Promise.all([
                authFetch(`${API_URL}/api/transactions`),
                authFetch(`${API_URL}/api/categories`),
            ]);

            if (!txRes.ok) throw new Error('Falha ao buscar transações');
            if (!catRes.ok) throw new Error('Falha ao buscar categorias');

            const transactions: Transaction[] = await txRes.json();
            const categories: Category[] = await catRes.json();

            setData({ transactions, categories });
        } catch (err: any) {
            console.error('Erro ao carregar dados:', err);
            setError(err.message || 'Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Transações ───────────────────────────────────────────────
    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const res = await authFetch(`${API_URL}/api/transactions`, {
                method: 'POST',
                body: JSON.stringify(transaction),
            });
            if (!res.ok) throw new Error('Falha ao criar transação');
            const novo: Transaction = await res.json();
            setData(prev => ({ ...prev, transactions: [novo, ...prev.transactions] }));
        } catch (err: any) { setError(err.message); }
    };

    const deleteTransaction = async (id: string) => {
        try {
            const res = await authFetch(`${API_URL}/api/transactions/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao remover transação');
            setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
        } catch (err: any) { setError(err.message); }
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        try {
            const res = await authFetch(`${API_URL}/api/transactions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Falha ao atualizar transação');
            const updated: Transaction = await res.json();
            setData(prev => ({
                ...prev,
                transactions: prev.transactions.map(t => t.id === id ? updated : t),
            }));
        } catch (err: any) { setError(err.message); }
    };

    // ── Categorias ───────────────────────────────────────────────
    const addCategory = async (category: Omit<Category, 'id'>) => {
        try {
            const res = await authFetch(`${API_URL}/api/categories`, {
                method: 'POST',
                body: JSON.stringify(category),
            });
            if (!res.ok) throw new Error('Falha ao criar categoria');
            const nova: Category = await res.json();
            setData(prev => ({ ...prev, categories: [...prev.categories, nova] }));
        } catch (err: any) { setError(err.message); }
    };

    // ── Totais calculados ────────────────────────────────────────
    const totals = {
        income: data.transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0),
        expense: data.transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0),
        investment: data.transactions.filter(t => t.type === 'investment').reduce((a, t) => a + t.amount, 0),
    };

    const balance = totals.income - totals.expense - totals.investment;

    return { ...data, loading, error, refetch: fetchData, addTransaction, deleteTransaction, updateTransaction, addCategory, totals, balance };
}
