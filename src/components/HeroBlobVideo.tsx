'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const videoUrls = ['/1.mp4', '/2.mp4'];

export default function HeroBlobVideo() {
    const blobRef = useRef<HTMLDivElement>(null);
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

    // useGSAP(() => {
    //     // Add a subtle floating/breathing animation to the entire blob container
    //     gsap.to(blobRef.current, {
    //         y: -15,
    //         duration: 4,
    //         repeat: -1,
    //         yoyo: true,
    //         ease: "sine.inOut"
    //     });

    //     // Add a subtle rotation breathing effect to make it feel organic
    //     gsap.to(blobRef.current, {
    //         rotationZ: 1,
    //         duration: 6,
    //         repeat: -1,
    //         yoyo: true,
    //         ease: "sine.inOut",
    //         delay: 1
    //     });
    // }, { scope: blobRef });

    return (
        <div ref={blobRef} className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[24/9] mt-6 md:mt-10 pointer-events-none">
            {/* The Video Container masked by the PNG */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    // Using CSS mask-image with the provided png
                    maskImage: "url('/mask.png')",
                    WebkitMaskImage: "url('/mask.png')",
                    maskSize: "100% 100%",
                    WebkitMaskSize: "100% 100%",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center"
                }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%]">
                    <video
                        ref={videoRef}
                        src={videoUrls[currentIndex]}
                        onEnded={handleVideoEnd}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        suppressHydrationWarning
                        className="w-full h-full object-cover scale-[1.05]"
                    />
                    {/* Dark gradient overlay to ensure the video blends with our dark theme */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-bg/80 via-transparent to-brand-accent/20" />
                </div>
            </div>

            {/* Metrics 2: Positioned inside the bottom-left cutout space of the mask */}
            <div className="absolute bottom-[8%] left-[5%] md:left-[8%] w-[65%] sm:w-[55%] md:w-[60%] flex flex-row justify-between items-center z-50 px-2 sm:px-4">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-sm sm:text-xl md:text-3xl font-bold font-sans text-brand-text">50+</span>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-brand-muted font-sans uppercase tracking-widest mt-0.5">Industries</span>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-sm sm:text-xl md:text-3xl font-bold font-sans text-brand-text">4 Wk</span>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-brand-muted font-sans uppercase tracking-widest mt-0.5">Turnaround</span>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-sm sm:text-xl md:text-3xl font-bold font-sans text-brand-text">100%</span>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-brand-muted font-sans uppercase tracking-widest mt-0.5">Satisfaction</span>
                </div>
            </div>
        </div>
    );
}
