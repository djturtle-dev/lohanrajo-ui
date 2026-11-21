'use client';

import { useEffect, useState } from 'react';

export default function ImageProtection() {
    const [shieldActive, setShieldActive] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        let noticeTimeout: NodeJS.Timeout | null = null;

        const clearClipboard = async () => {
            try {
                if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText('');
                }
            } catch {
                // Ignore permissions policy error if clipboard access is blocked
            }
        };

        const triggerShield = (reason?: string) => {
            document.body.setAttribute('data-focus-lost', 'true');
            setShieldActive(true);
            if (reason) {
                setNotice(reason);
                if (noticeTimeout) clearTimeout(noticeTimeout);
                noticeTimeout = setTimeout(() => {
                    setNotice(null);
                }, 2500);
            }
        };

        const releaseShield = () => {
            document.body.removeAttribute('data-focus-lost');
            setShieldActive(false);
        };

        const handleBlur = () => {
            // Focus lost to external window, Snipping Tool, or OS overlay
            triggerShield();
        };

        const handleFocus = () => {
            // Regained window focus
            releaseShield();
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerShield();
            } else {
                releaseShield();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Detect PrintScreen or OS screenshot shortcuts
            const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.key === 'Snapshot';
            const isSnippingShortcut = (e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '4' || e.key === '3');

            if (isPrintScreen || isSnippingShortcut) {
                triggerShield('Screenshot restricted');
                clearClipboard();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.key === 'Snapshot') {
                triggerShield('Screenshot restricted');
                clearClipboard();
                // Keep shield for 1.2s to overwrite any OS clipboard buffer
                setTimeout(() => {
                    if (document.hasFocus()) {
                        releaseShield();
                    }
                }, 1200);
            }
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keyup', handleKeyUp, true);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('keyup', handleKeyUp, true);
            if (noticeTimeout) clearTimeout(noticeTimeout);
            document.body.removeAttribute('data-focus-lost');
        };
    }, []);

    if (!notice) return null;

    return (
        <div 
            aria-live="polite"
            className="fixed bottom-6 right-6 z-[10005] px-4 py-2.5 rounded-full bg-brand-panel/95 border border-brand-accent/50 text-brand-text shadow-2xl backdrop-blur-md text-xs font-sans font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
            <span>{notice}</span>
        </div>
    );
}
