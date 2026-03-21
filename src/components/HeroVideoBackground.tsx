'use client';

import { useState, useEffect } from 'react';

const videoUrls = ['/1.mp4', '/2.mp4'];

export default function HeroVideoBackground() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoSources, setVideoSources] = useState<string[]>(videoUrls); // Start with remote URLs for instant play

    useEffect(() => {
        let objectUrls: string[] = [];
        let isMounted = true;

        const cacheVideosLocally = async () => {
            try {
                // Fetch videos into local blobs
                const blobs = await Promise.all(
                    videoUrls.map(url => fetch(url).then(res => res.blob()))
                );
                
                if (!isMounted) return;

                // Create local object URLs to prevent repeating network requests
                objectUrls = blobs.map(blob => URL.createObjectURL(blob));
                setVideoSources(objectUrls);
            } catch (error) {
                console.error("Failed to cache videos locally:", error);
            }
        };

        cacheVideosLocally();

        return () => {
            isMounted = false;
            // Free up memory
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <video 
            key={currentIndex}
            autoPlay 
            muted 
            playsInline 
            onEnded={() => setCurrentIndex((prev) => (prev + 1) % videoSources.length)}
            className="w-full h-full object-cover"
        >
            <source src={videoSources[currentIndex]} type="video/mp4" />
        </video>
    );
}
