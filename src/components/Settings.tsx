import React from 'react';
import { BarChart2, PieChart, TrendingUp, Palette, CheckCircle2 } from 'lucide-react';
import { usePreferences, ChartStyle, ColorPalette, PALETTES } from '../contexts/PreferencesContext';

const CHART_OPTIONS: { id: ChartStyle; label: string; desc: string; Icon: React.FC<any> }[] = [
    { id: 'bar', label: 'Barras', desc: 'Comparação lado a lado', Icon: BarChart2 },
    { id: 'pie', label: 'Pizza', desc: 'Proporção entre categorias', Icon: PieChart },
    { id: 'line', label: 'Linhas', desc: 'Evolução ao longo do tempo', Icon: TrendingUp },
];

const PALETTE_OPTIONS: { id: ColorPalette; label: string }[] = [
    { id: 'default', label: 'Padrão' },
    { id: 'ocean', label: 'Oceano' },
    { id: 'sunset', label: 'Pôr do Sol' },
    { id: 'forest', label: 'Floresta' },
    { id: 'candy', label: 'Candy' },
];

export function Settings() {
    const { chartStyle, colorPalette, colors, setChartStyle, setColorPalette } = usePreferences();

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h2>Configurações</h2>
                <p>Personalize a aparência dos seus gráficos e cores</p>
            </div>

            {/* ── Estilo de Gráfico ──────────────────────────── */}
            <section className="settings-section glass-card">
                <div className="section-title">
                    <BarChart2 size={20} />
                    <h3>Estilo de Gráfico</h3>
                </div>
                <p className="section-desc">Escolha como os dados serão visualizados no Dashboard</p>

                <div className="chart-options">
                    {CHART_OPTIONS.map(({ id, label, desc, Icon }) => (
                        <button
                            key={id}
                            className={`chart-option ${chartStyle === id ? 'selected' : ''}`}
                            onClick={() => setChartStyle(id)}
                        >
                            <div className="chart-option-icon">
                                <Icon size={28} />
                            </div>
                            <div className="chart-option-info">
                                <span className="chart-option-label">{label}</span>
                                <span className="chart-option-desc">{desc}</span>
                            </div>
                            {chartStyle === id && (
                                <CheckCircle2 size={20} className="check-icon" />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Paleta de Cores ────────────────────────────── */}
            <section className="settings-section glass-card">
                <div className="section-title">
                    <Palette size={20} />
                    <h3>Paleta de Cores</h3>
                </div>
                <p className="section-desc">Define as cores usadas nos gráficos para Receitas, Despesas e Investimentos</p>

                <div className="palette-grid">
                    {PALETTE_OPTIONS.map(({ id, label }) => {
                        const pal = PALETTES[id];
                        const isActive = colorPalette === id;
                        return (
                            <button
                                key={id}
                                className={`palette-card ${isActive ? 'selected' : ''}`}
                                onClick={() => setColorPalette(id)}
                            >
                                <div className="palette-swatches">
                                    <span className="swatch" style={{ background: pal.income }} title="Receitas" />
                                    <span className="swatch" style={{ background: pal.expense }} title="Despesas" />
                                    <span className="swatch" style={{ background: pal.investment }} title="Investimentos" />
                                </div>
                                <span className="palette-label">{label}</span>
                                {isActive && <CheckCircle2 size={16} className="check-icon-sm" />}
                            </button>
                        );
                    })}
                </div>

                {/* Preview da paleta selecionada */}
                <div className="palette-preview">
                    <span className="preview-title">Pré-visualização</span>
                    <div className="preview-bars">
                        <div className="preview-bar-wrap">
                            <div className="preview-bar" style={{ background: colors.income, height: '60px' }} />
                            <span>Receitas</span>
                        </div>
                        <div className="preview-bar-wrap">
                            <div className="preview-bar" style={{ background: colors.expense, height: '44px' }} />
                            <span>Despesas</span>
                        </div>
                        <div className="preview-bar-wrap">
                            <div className="preview-bar" style={{ background: colors.investment, height: '36px' }} />
                            <span>Investimentos</span>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }
        .settings-header p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--text-primary);
        }
        .section-title h3 {
          font-size: 1.05rem;
          font-weight: 600;
        }
        .section-desc {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-top: -0.5rem;
        }

        /* ── Chart options ── */
        .chart-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .chart-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 1.5px solid var(--border-glass);
          background: rgba(255,255,255,0.03);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .chart-option:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateX(4px);
        }
        .chart-option.selected {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.12);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3);
        }

        .chart-option-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: rgba(99,102,241,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .chart-option.selected .chart-option-icon {
          background: rgba(99,102,241,0.25);
          color: #a5b4fc;
        }

        .chart-option-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .chart-option-label {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .chart-option-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .check-icon {
          color: #6366f1;
          flex-shrink: 0;
        }

        /* ── Palette grid ── */
        .palette-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .palette-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          padding: 1rem 0.75rem;
          border-radius: 12px;
          border: 1.5px solid var(--border-glass);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .palette-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-2px);
        }
        .palette-card.selected {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.12);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3);
        }

        .palette-swatches {
          display: flex;
          gap: 6px;
        }
        .swatch {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: block;
        }

        .palette-label {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .check-icon-sm {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #6366f1;
        }

        /* ── Preview ── */
        .palette-preview {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .preview-title {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .preview-bars {
          display: flex;
          align-items: flex-end;
          gap: 1.25rem;
          height: 80px;
        }
        .preview-bar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          flex: 1;
        }
        .preview-bar {
          width: 100%;
          border-radius: 6px 6px 0 0;
          transition: background 0.4s ease;
          min-height: 12px;
        }
        .preview-bar-wrap span {
          font-size: 0.72rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }
      `}</style>
        </div>
    );
}
