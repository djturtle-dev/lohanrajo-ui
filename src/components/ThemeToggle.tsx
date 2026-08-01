'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

const themes = ['system', 'dark', 'light'] as const;

const icons = {
    system: Monitor,
    dark: Moon,
    light: Sun,
};

const labels = {
    system: 'System theme',
    dark: 'Dark mode',
    light: 'Light mode',
};

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    function cycle() {
        const idx = themes.indexOf(theme);
        const next = themes[(idx + 1) % themes.length];
        setTheme(next);
    }

    const Icon = icons[theme];

    return (
        <button
            onClick={cycle}
            aria-label={labels[theme]}
            title={labels[theme]}
            className="relative h-10 w-10 rounded-full btn-glass-secondary flex-shrink-0 hover:scale-105 flex items-center justify-center cursor-pointer"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex items-center justify-center"
                >
                    <Icon className="w-4 h-4" style={{ color: 'var(--th-text)' }} />
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
