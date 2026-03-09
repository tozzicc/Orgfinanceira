import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart as RePieChart,
    Pie,
    Legend
} from 'recharts';
import { usePreferences } from '../contexts/PreferencesContext';

interface DashboardProps {
    totals: {
        income: number;
        expense: number;
        investment: number;
    };
    balance: number;
}

export function Dashboard({ totals, balance }: DashboardProps) {
    const { chartStyle, colors } = usePreferences();

    const chartData = [
        { name: 'Receitas', value: totals.income, color: colors.income },
        { name: 'Despesas', value: totals.expense, color: colors.expense },
        { name: 'Investimentos', value: totals.investment, color: colors.investment },
    ];

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const tooltipStyle = {
        contentStyle: { background: '#1e293b', border: 'none', borderRadius: '8px' },
        itemStyle: { color: '#fff' },
    };

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
                    icon={<PieChartIcon className="icon-purple" />}
                />
            </div>

            <div className="charts-grid">
                <div className="glass-card chart-container">
                    <h3>Resumo Financeiro</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        {/* ── Barras ── */}
                        {chartStyle === 'bar' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" hide />
                                <Tooltip {...tooltipStyle} formatter={(v: any) => formatCurrency(v)} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : chartStyle === 'pie' ? (
                            /* ── Pizza ── */
                            <RePieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    innerRadius={55}
                                    paddingAngle={3}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {chartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip {...tooltipStyle} formatter={(v: any) => formatCurrency(v)} />
                                <Legend />
                            </RePieChart>
                        ) : (
                            /* ── Linhas ── */
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" hide />
                                <Tooltip {...tooltipStyle} formatter={(v: any) => formatCurrency(v)} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#lineGradient)"
                                    strokeWidth={3}
                                    dot={(props: any) => {
                                        const { cx, cy, index } = props;
                                        return (
                                            <circle
                                                key={index}
                                                cx={cx} cy={cy} r={6}
                                                fill={chartData[index]?.color || '#6366f1'}
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        );
                                    }}
                                />
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={colors.income} />
                                        <stop offset="50%" stopColor={colors.expense} />
                                        <stop offset="100%" stopColor={colors.investment} />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        )}
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
