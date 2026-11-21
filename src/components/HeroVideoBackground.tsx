'use client';

import { useState, useEffect, useRef } from 'react';

const videoUrls = ['/1.mp4', '/2.mp4'];

export default function HeroVideoBackground() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoSources, setVideoSources] = useState<string[]>(videoUrls);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
        isMountedRef.current = true;
        let objectUrls: string[] = [];

        const cacheVideosLocally = async () => {
            try {
                const blobs = await Promise.all(
                    videoUrls.map(url => fetch(url).then(res => res.blob()))
                );
                
                if (!isMountedRef.current) return;

                objectUrls = blobs.map(blob => URL.createObjectURL(blob));
                setVideoSources(objectUrls);
            } catch {
                // Fallback to static URLs
            }
        };

        cacheVideosLocally();

        return () => {
            isMountedRef.current = false;
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <video 
            ref={videoRef}
            key={currentIndex}
            autoPlay 
            muted 
            playsInline 
            preload="auto"
            suppressHydrationWarning
            onEnded={() => {
                if (isMountedRef.current) {
                    setCurrentIndex((prev) => (prev + 1) % videoSources.length);
                }
            }}
            className="w-full h-full object-cover absolute inset-0"
            style={{
                maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
            }}
        >
            <source src={videoSources[currentIndex]} type="video/mp4" />
        </video>
    );
}
