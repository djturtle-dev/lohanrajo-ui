'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    function toggle() {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative h-10 w-10 rounded-full btn-glass-secondary !overflow-visible flex-shrink-0 hover:scale-105 flex items-center justify-center cursor-pointer"
            style={{ overflow: 'visible' }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex items-center justify-center overflow-visible"
                    style={{ overflow: 'visible' }}
                >
                    {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                        <Moon className="w-4 h-4 text-slate-800" />
                    )}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
