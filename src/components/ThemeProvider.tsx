'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

function applyTheme(resolved: ResolvedTheme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

    // On mount: read saved preference from localStorage, default to 'light'
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const initial: Theme = saved === 'dark' ? 'dark' : 'light';
        setThemeState(initial);
        setResolvedTheme(initial);
        applyTheme(initial);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        const valid: Theme = next === 'dark' ? 'dark' : 'light';
        setThemeState(valid);
        localStorage.setItem('theme', valid);
        setResolvedTheme(valid);
        applyTheme(valid);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
