'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const videoUrls = ['/1.mp4', '/2.mp4'];
const IDLE_DELAY_MS = 15000; // Pause after 15 seconds of cursor/interaction inactivity

export default function HeroBlobVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTabActiveRef = useRef<boolean>(true);
    const isMountedRef = useRef<boolean>(true);
    const playPromiseRef = useRef<Promise<void> | null>(null);

    const playVideo = useCallback(async () => {
        const video = videoRef.current;
        if (!video || !isMountedRef.current || !video.isConnected) return;
        if (!isTabActiveRef.current || document.visibilityState !== 'visible') return;

        // If already playing or a play promise is in-flight, do nothing
        if (!video.paused || playPromiseRef.current) return;

        try {
            const promise = video.play();
            if (promise !== undefined) {
                playPromiseRef.current = promise;
                await promise;
            }
        } catch {
            // Intentionally suppress AbortError / interruption by pause or DOM removal
        } finally {
            playPromiseRef.current = null;
        }
    }, []);

    const pauseVideo = useCallback(async () => {
        const video = videoRef.current;
        if (!video || !isMountedRef.current) return;

        // If a play request is in-flight, await it first so we don't interrupt it prematurely
        if (playPromiseRef.current) {
            try {
                await playPromiseRef.current;
            } catch {
                // Ignore
            }
        }

        if (video && isMountedRef.current && video.isConnected && !video.paused) {
            video.pause();
        }
    }, []);

    const handleVideoEnd = () => {
        if (!isMountedRef.current) return;
        setCurrentIndex((prev) => (prev + 1) % videoUrls.length);
    };

    // When video index changes, attempt playback if tab is active
    useEffect(() => {
        if (isTabActiveRef.current && document.visibilityState === 'visible') {
            playVideo();
        }
    }, [currentIndex, playVideo]);

    useEffect(() => {
        isMountedRef.current = true;

        const handleActivity = () => {
            if (!isMountedRef.current) return;

            // Only resume if currently paused and tab is active
            if (document.visibilityState === 'visible' && isTabActiveRef.current) {
                const video = videoRef.current;
                if (video && video.paused) {
                    playVideo();
                }
            }

            // Reset idle timer
            if (idleTimeoutRef.current) {
                clearTimeout(idleTimeoutRef.current);
            }

            idleTimeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                    pauseVideo();
                }
            }, IDLE_DELAY_MS);
        };

        const handleVisibilityChange = () => {
            if (!isMountedRef.current) return;

            if (document.hidden) {
                isTabActiveRef.current = false;
                pauseVideo();
                if (idleTimeoutRef.current) {
                    clearTimeout(idleTimeoutRef.current);
                }
            } else {
                isTabActiveRef.current = true;
                handleActivity();
            }
        };

        const handleBlur = () => {
            if (!isMountedRef.current) return;
            isTabActiveRef.current = false;
            pauseVideo();
            if (idleTimeoutRef.current) {
                clearTimeout(idleTimeoutRef.current);
            }
        };

        const handleFocus = () => {
            if (!isMountedRef.current) return;
            isTabActiveRef.current = true;
            handleActivity();
        };

        // Window & Tab visibility listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        // User activity listeners
        window.addEventListener('mousemove', handleActivity, { passive: true });
        window.addEventListener('touchstart', handleActivity, { passive: true });
        window.addEventListener('touchmove', handleActivity, { passive: true });
        window.addEventListener('scroll', handleActivity, { passive: true });
        window.addEventListener('keydown', handleActivity, { passive: true });

        // Kick off initial playback and idle timer
        handleActivity();

        return () => {
            isMountedRef.current = false;

            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);

            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
            window.removeEventListener('touchmove', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            window.removeEventListener('keydown', handleActivity);

            if (idleTimeoutRef.current) {
                clearTimeout(idleTimeoutRef.current);
            }

            // If a video element exists on unmount, gracefully pause it without throwing
            const video = videoRef.current;
            if (video && !video.paused) {
                try {
                    video.pause();
                } catch {
                    // Ignore on unmount
                }
            }
        };
    }, [playVideo, pauseVideo]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
            <video
                ref={videoRef}
                src={videoUrls[currentIndex]}
                onEnded={handleVideoEnd}
                autoPlay
                muted
                playsInline
                preload="auto"
                suppressHydrationWarning
                className="absolute inset-0 w-full h-full min-w-full min-h-full max-w-full max-h-full object-cover opacity-40 dark:opacity-35 transition-opacity duration-700 pointer-events-none"
            />
        </div>
    );
}
