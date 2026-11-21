'use client';

import { useEffect, useState, useRef } from 'react';

export default function ImageProtection() {
    const [notice, setNotice] = useState<string | null>(null);
    const noticeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lockUntilRef = useRef<number>(0);

    useEffect(() => {
        const showNotice = (text: string) => {
            setNotice(text);
            if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
            noticeTimeoutRef.current = setTimeout(() => {
                setNotice(null);
            }, 2500);
        };

        const triggerShield = (reason?: string, lockDurationMs = 0) => {
            document.body.setAttribute('data-focus-lost', 'true');
            if (lockDurationMs > 0) {
                lockUntilRef.current = Math.max(lockUntilRef.current, Date.now() + lockDurationMs);
            }
            if (reason) {
                showNotice(reason);
            }
        };

        const releaseShield = (force = false) => {
            if (!force && Date.now() < lockUntilRef.current) {
                const remaining = lockUntilRef.current - Date.now();
                setTimeout(() => {
                    if (document.hasFocus() && !document.hidden) {
                        document.body.removeAttribute('data-focus-lost');
                    }
                }, remaining + 50);
                return;
            }
            document.body.removeAttribute('data-focus-lost');
        };

        const handleBlur = () => {
            // Focus lost to external window, Snipping Tool overlay, or task switcher
            triggerShield('Screenshot restricted', 2000);
        };

        const handleFocus = () => {
            releaseShield();
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerShield('Screenshot restricted', 2000);
            } else {
                releaseShield();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // 1. PrintScreen key (any modifier)
            const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.key === 'Snapshot';

            // 2. Windows Snipping Tool (Win + Shift + S) or Mac (Cmd + Shift + 3/4/5)
            // Note: Windows OS captures the 'S' key globally, so we intercept the (Meta + Shift) combo directly
            const isMetaShift = (e.metaKey && e.shiftKey) || 
                                (e.key === 'Meta' && e.shiftKey) || 
                                (e.key === 'Shift' && e.metaKey);

            // 3. Ctrl + Shift + S (browser screenshot / devtools)
            const isCtrlShiftS = e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S' || e.code === 'KeyS');

            // 4. Windows Game Bar / Screen Recorder (Win + G or Win + Alt + PrtScn)
            const isGameBar = e.metaKey && (e.key === 'g' || e.key === 'G' || e.altKey);

            if (isPrintScreen || isMetaShift || isCtrlShiftS || isGameBar) {
                triggerShield('Screenshot restricted', 3500);
            }
        };

        // Attach listeners with capture phase
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('keydown', handleKeyDown, true);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('keydown', handleKeyDown, true);
            if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
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
