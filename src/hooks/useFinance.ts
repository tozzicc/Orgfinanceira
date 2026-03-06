import { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../types';

const STORAGE_KEY = 'finance_app_data';

interface FinanceData {
    transactions: Transaction[];
    categories: Category[];
}

const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Alimentação', type: 'expense' },
    { id: '2', name: 'Transporte', type: 'expense' },
    { id: '3', name: 'Moradia', type: 'expense' },
    { id: '4', name: 'Salário', type: 'income' },
    { id: '5', name: 'Rendimentos', type: 'income' },
    { id: '6', name: 'Ações', type: 'investment' },
];

export function useFinance() {
    const [data, setData] = useState<FinanceData>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse stored data', e);
            }
        }
        return {
            transactions: [],
            categories: DEFAULT_CATEGORIES,
        };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = {
            ...transaction,
            id: crypto.randomUUID(),
        };
        setData(prev => ({
            ...prev,
            transactions: [newTransaction, ...prev.transactions],
        }));
    };

    const deleteTransaction = (id: string) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id),
        }));
    };

    const updateTransaction = (id: string, updates: Partial<Transaction>) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t),
        }));
    };

    const addCategory = (category: Omit<Category, 'id'>) => {
        const newCategory = {
            ...category,
            id: crypto.randomUUID(),
        };
        setData(prev => ({
            ...prev,
            categories: [...prev.categories, newCategory],
        }));
    };

    const totals = {
        income: data.transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0),
        expense: data.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0),
        investment: data.transactions
            .filter(t => t.type === 'investment')
            .reduce((acc, t) => acc + t.amount, 0),
    };

    const balance = totals.income - totals.expense - totals.investment;

    return {
        ...data,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addCategory,
        totals,
        balance,
    };
}
