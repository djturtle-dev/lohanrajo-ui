'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'system',
    resolvedTheme: 'dark',
    setTheme: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(resolved: ResolvedTheme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

    // On mount: read saved preference from localStorage
    useEffect(() => {
        const saved = (localStorage.getItem('theme') as Theme | null) ?? 'system';
        setThemeState(saved);

        const resolved = saved === 'system' ? getSystemTheme() : saved;
        setResolvedTheme(resolved);
        applyTheme(resolved);
    }, []);

    // Watch system preference changes when theme === 'system'
    useEffect(() => {
        if (theme !== 'system') return;

        const mq = window.matchMedia('(prefers-color-scheme: light)');
        const handler = (e: MediaQueryListEvent) => {
            const resolved: ResolvedTheme = e.matches ? 'light' : 'dark';
            setResolvedTheme(resolved);
            applyTheme(resolved);
        };

        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next);
        localStorage.setItem('theme', next);

        const resolved: ResolvedTheme = next === 'system' ? getSystemTheme() : next;
        setResolvedTheme(resolved);
        applyTheme(resolved);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
