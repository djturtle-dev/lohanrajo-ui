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
        <video
            ref={videoRef}
            src={videoUrls[currentIndex]}
            onEnded={handleVideoEnd}
            autoPlay
            muted
            playsInline
            preload="auto"
            suppressHydrationWarning
            className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-35 transition-opacity duration-700"
        />
    );
}
