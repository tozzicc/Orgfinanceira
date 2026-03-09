import React, { useState } from 'react';
import { Plus, Trash2, Filter } from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionsProps {
    transactions: Transaction[];
    categories: Category[];
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
}

export function Transactions({ transactions, categories, addTransaction, deleteTransaction }: TransactionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

    const filteredTransactions = filterType === 'all'
        ? transactions
        : transactions.filter(t => t.type === filterType);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="transactions-view">
            <div className="view-header">
                <h2>Lançamentos</h2>
                <div className="header-actions">
                    <select
                        className="glass-input select-filter"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                    >
                        <option value="all">Todos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                        <option value="investment">Investimentos</option>
                    </select>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        <span>Novo Lançamento</span>
                    </button>
                </div>
            </div>

            <div className="glass-card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((t) => (
                            <tr key={t.id}>
                                <td>{format(new Date(t.date), 'dd/MM/yyyy')}</td>
                                <td>{t.description}</td>
                                <td>{categories.find(c => c.id === t.categoryId)?.name || 'Outros'}</td>
                                <td className={t.type === 'income' ? 'text-green' : t.type === 'expense' ? 'text-red' : 'text-blue'}>
                                    {formatCurrency(t.amount)}
                                </td>
                                <td>
                                    <span className={`badge badge-${t.type}`}>
                                        {t.type === 'income' ? 'Entrada' : t.type === 'expense' ? 'Saída' : 'Inv.'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-icon text-red" onClick={() => deleteTransaction(t.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                    Nenhum lançamento encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <TransactionModal
                    categories={categories}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(data: Omit<Transaction, 'id'>) => {
                        addTransaction(data);
                        setIsModalOpen(false);
                    }}
                />
            )}

            <style>{`
        .transactions-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        
        .glass-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          outline: none;
          font-size: 0.95rem;
        }

        .glass-input:focus {
          border-color: rgba(99, 102, 241, 0.6);
          background: rgba(255, 255, 255, 0.08);
        }

        /* Selects com fundo escuro — corrige o dropdown branco no Windows */
        select.glass-input {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.25rem;
          background-color: #1e293b;
          cursor: pointer;
        }

        select.glass-input:focus {
          background-color: #1e293b;
        }

        select.glass-input option {
          background-color: #1e293b;
          color: #f1f5f9;
          padding: 0.5rem;
        }

        select.glass-input option:hover,
        select.glass-input option:checked {
          background-color: #6366f1;
          color: white;
        }
        
        .btn-primary {
          background: var(--primary-gradient);
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
        }
        
        .table-container {
          padding: 0;
          overflow: hidden;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        
        .data-table th, .data-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-glass);
        }
        
        .data-table th {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .text-green { color: var(--accent-green); }
        .text-red { color: var(--accent-red); }
        .text-blue { color: var(--accent-blue); }
        
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .badge-income { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); }
        .badge-expense { background: rgba(239, 68, 68, 0.1); color: var(--accent-red); }
        .badge-investment { background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); }
        
        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .btn-icon:hover { opacity: 1; }
      `}</style>
        </div>
    );
}

interface TransactionModalProps {
    categories: Category[];
    onClose: () => void;
    onSubmit: (data: Omit<Transaction, 'id'>) => void;
}

function TransactionModal({ categories, onClose, onSubmit }: TransactionModalProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        categoryId: categories[0]?.id || '',
        type: 'expense' as TransactionType
    });

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content">
                <h3>Novo Lançamento</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit({
                        ...formData,
                        amount: parseFloat(formData.amount)
                    });
                }}>
                    <div className="form-group">
                        <label>Data</label>
                        <input
                            type="date"
                            className="glass-input w-full"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            className="glass-input w-full"
                            placeholder="Ex: Supermercado"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Valor</label>
                        <input
                            type="number"
                            step="0.01"
                            className="glass-input w-full"
                            placeholder="0,00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            className="glass-input w-full"
                            value={formData.type}
                            onChange={(e) => {
                                const type = e.target.value as TransactionType;
                                const filteredCats = categories.filter((c: any) => c.type === type);
                                setFormData({
                                    ...formData,
                                    type,
                                    categoryId: filteredCats[0]?.id || ''
                                });
                            }}
                        >
                            <option value="income">Receita</option>
                            <option value="expense">Despesa</option>
                            <option value="investment">Investimento</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Categoria</label>
                        <select
                            className="glass-input w-full"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            {categories
                                .filter((c: any) => c.type === formData.type)
                                .map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar</button>
                    </div>
                </form>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        
        .modal-content {
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .w-full { width: 100%; }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .btn-secondary {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-glass);
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}
