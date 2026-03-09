import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ChartStyle = 'bar' | 'pie' | 'line';

export type ColorPalette =
    | 'default'   // verde/vermelho/azul
    | 'ocean'     // tons de azul e ciano
    | 'sunset'    // laranja, rosa e roxo
    | 'forest'    // verdes naturais
    | 'candy';    // rosa, lilás e amarelo

export interface ChartColors {
    income: string;
    expense: string;
    investment: string;
}

const PALETTES: Record<ColorPalette, ChartColors> = {
    default: { income: '#10b981', expense: '#ef4444', investment: '#3b82f6' },
    ocean: { income: '#06b6d4', expense: '#0ea5e9', investment: '#6366f1' },
    sunset: { income: '#f97316', expense: '#ec4899', investment: '#a855f7' },
    forest: { income: '#22c55e', expense: '#84cc16', investment: '#14b8a6' },
    candy: { income: '#f472b6', expense: '#c084fc', investment: '#facc15' },
};

interface Preferences {
    chartStyle: ChartStyle;
    colorPalette: ColorPalette;
    colors: ChartColors;
}

interface PreferencesContextValue extends Preferences {
    setChartStyle: (s: ChartStyle) => void;
    setColorPalette: (p: ColorPalette) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const STORAGE_KEY = 'finance_preferences';

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [chartStyle, setChartStyleState] = useState<ChartStyle>(() => {
        try { return (JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').chartStyle) || 'bar'; }
        catch { return 'bar'; }
    });

    const [colorPalette, setColorPaletteState] = useState<ColorPalette>(() => {
        try { return (JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').colorPalette) || 'default'; }
        catch { return 'default'; }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ chartStyle, colorPalette }));
    }, [chartStyle, colorPalette]);

    const setChartStyle = (s: ChartStyle) => setChartStyleState(s);
    const setColorPalette = (p: ColorPalette) => setColorPaletteState(p);

    return (
        <PreferencesContext.Provider value={{
            chartStyle,
            colorPalette,
            colors: PALETTES[colorPalette],
            setChartStyle,
            setColorPalette,
        }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const ctx = useContext(PreferencesContext);
    if (!ctx) throw new Error('usePreferences must be inside PreferencesProvider');
    return ctx;
}

export { PALETTES };
