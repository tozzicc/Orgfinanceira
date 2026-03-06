import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    PieChart
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart as RePieChart,
    Pie
} from 'recharts';

interface DashboardProps {
    totals: {
        income: number;
        expense: number;
        investment: number;
    };
    balance: number;
}

export function Dashboard({ totals, balance }: DashboardProps) {
    const chartData = [
        { name: 'Receitas', value: totals.income, color: '#10b981' },
        { name: 'Despesas', value: totals.expense, color: '#ef4444' },
        { name: 'Investimento', value: totals.investment, color: '#3b82f6' },
    ];

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="dashboard-content">
            <div className="stats-grid">
                <StatCard
                    title="Saldo Geral"
                    value={formatCurrency(balance)}
                    icon={<Wallet className="icon-blue" />}
                    trend={balance >= 0 ? 'positive' : 'negative'}
                />
                <StatCard
                    title="Receitas"
                    value={formatCurrency(totals.income)}
                    icon={<TrendingUp className="icon-green" />}
                />
                <StatCard
                    title="Despesas"
                    value={formatCurrency(totals.expense)}
                    icon={<TrendingDown className="icon-red" />}
                />
                <StatCard
                    title="Investimentos"
                    value={formatCurrency(totals.investment)}
                    icon={<PieChart className="icon-purple" />}
                />
            </div>

            <div className="charts-grid">
                <div className="glass-card chart-container">
                    <h3>Resumo Financeiro</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" hide />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <style>{`
        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          flex: 1;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .stat-info h4 {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .stat-info p {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .chart-container h3 {
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        
        .icon-blue { color: #3b82f6; }
        .icon-green { color: #10b981; }
        .icon-red { color: #ef4444; }
        .icon-purple { color: #a855f7; }
      `}</style>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: any) {
    return (
        <div className="glass-card stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <h4>{title}</h4>
                <p>{value}</p>
            </div>
        </div>
    );
}
