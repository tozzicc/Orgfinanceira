export type TransactionType = 'income' | 'expense' | 'investment';

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    icon?: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    categoryId: string;
    type: TransactionType;
}

export interface MonthlyBudget {
    categoryId: string;
    amount: number;
}
