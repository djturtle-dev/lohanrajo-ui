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
        <div ref={blobRef} className="relative w-full h-[80vh] lg:h-[90vh] mt-8 md:mt-12 pointer-events-none">
            {/* The Video Container masked by the PNG */}
            <div
                className="absolute inset-0 w-full h-full -top-[25%]"
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
                {/*
                    Using a container much larger than the blob to ensure the video covers the entire area
                */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%]">
                    <video
                        ref={videoRef}
                        src={videoUrls[currentIndex]}
                        onEnded={handleVideoEnd}
                        autoPlay
                        muted
                        playsInline
                        suppressHydrationWarning
                        className="w-full h-full object-center scale-[1.05]"
                    />
                    {/* Dark gradient overlay to ensure the video blends with our dark theme */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-bg/80 via-transparent to-brand-accent/20" />
                </div>
            </div>

            {/* Floating Stats positioned precisely inside the asymmetrical cutouts (Negative Space) */}
            {/* Top Right Cutout */}
            <div className="absolute top-[15%] right-[3%] sm:right-[5%] flex flex-col items-center text-center z-50">
                <span className="text-lg sm:text-xl md:text-2xl font-bold font-sans text-white">5000+</span>
                <span className="text-xs text-brand-muted font-sans">Clients</span>
            </div>

            {/* Bottom Left Huge Cutout (3 stats spread out) */}
            <div className="absolute bottom-[15%] left-[8%] sm:left-[10%] flex flex-col items-center text-center z-50">
                <span className="text-lg sm:text-xl md:text-2xl font-bold font-sans text-white">50+</span>
                <span className="text-xs text-brand-muted font-sans">Industries</span>
            </div>

            <div className="absolute bottom-[15%] left-[32%] sm:left-[35%] flex flex-col items-center text-center z-50">
                <span className="text-lg sm:text-xl md:text-2xl font-bold font-sans text-white">4 Week</span>
                <span className="text-xs text-brand-muted font-sans">Turnaround</span>
            </div>

            <div className="absolute bottom-[15%] left-[56%] sm:left-[60%] flex flex-col items-center text-center z-50">
                <span className="text-lg sm:text-xl md:text-2xl font-bold font-sans text-white">100%</span>
                <span className="text-xs text-brand-muted font-sans">Satisfaction</span>
            </div>
        </div>
    );
}
