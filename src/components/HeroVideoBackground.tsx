'use client';

import { useState } from 'react';

const videos = ['/1.mp4', '/2.mp4'];

export default function HeroVideoBackground() {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <video 
            key={currentIndex}
            autoPlay 
            muted 
            playsInline 
            onEnded={() => setCurrentIndex((prev) => (prev + 1) % videos.length)}
            className="w-full h-full object-cover"
        >
            <source src={videos[currentIndex]} type="video/mp4" />
        </video>
    );
}
