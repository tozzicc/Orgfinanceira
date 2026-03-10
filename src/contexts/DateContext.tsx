import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextType {
    selectedMonth: number; // 0-11
    selectedYear: number;
    setSelectedMonth: (month: number) => void;
    setSelectedYear: (year: number) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    return (
        <DateContext.Provider value={{ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }}>
            {children}
        </DateContext.Provider>
    );
}

export function useDate() {
    const context = useContext(DateContext);
    if (context === undefined) {
        throw new Error('useDate must be used within a DateProvider');
    }
    return context;
}
