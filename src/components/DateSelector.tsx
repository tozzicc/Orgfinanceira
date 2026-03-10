import React from 'react';
import { useDate } from '../contexts/DateContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function DateSelector() {
    const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useDate();

    const handlePrev = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNext = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    return (
        <div className="date-selector glass-card">
            <div className="period-display">
                <Calendar size={18} className="period-icon" />
                <span className="month-name">{MONTHS[selectedMonth]}</span>
                <span className="year-number">{selectedYear}</span>
            </div>

            <div className="nav-controls">
                <button className="nav-btn" onClick={handlePrev} title="Mês anterior">
                    <ChevronLeft size={20} />
                </button>
                <button className="nav-btn" onClick={handleNext} title="Próximo mês">
                    <ChevronRight size={20} />
                </button>
            </div>

            <style>{`
        .date-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          margin-bottom: 2rem;
          min-width: 320px;
        }

        .period-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .period-icon {
          color: #6366f1;
        }

        .month-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .year-number {
          padding: 0.2rem 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 6px;
          color: #818cf8;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .nav-controls {
          display: flex;
          gap: 0.5rem;
        }

        .nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
          border-color: #6366f1;
        }
      `}</style>
        </div>
    );
}
