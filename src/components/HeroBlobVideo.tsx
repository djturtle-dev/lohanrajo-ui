'use client';

import { useRef, useState, useEffect } from 'react';

const videoUrls = ['/1.mp4', '/2.mp4'];

export default function HeroBlobVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleVideoEnd = () => {
        setCurrentIndex((prev) => (prev + 1) % videoUrls.length);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(console.error);
        }
    }, [currentIndex]);

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
