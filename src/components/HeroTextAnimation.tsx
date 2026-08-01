'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function HeroTextAnimation({ lines = [] }: { lines?: string[] }) {
    const [index, setIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    const displayLines = lines.length > 0 ? lines : [
        "Precision in *Metal Arts*",
        "*BMS* Panels",
        "*IP Standard* Enclosures",
        "Reflectors, *Poles*",
        "*Oil,* CPG Panels"
    ];

    useEffect(() => {
        setIsMounted(true);
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % displayLines.length);
        }, 5000); // Slightly longer interval (5s) for better reading of staggered text
        return () => clearInterval(interval);
    }, [displayLines.length]);

    if (!isMounted) return <div className="h-30 sm:h-37.5 md:h-45 lg:h-55" />;

    // Animation variants for staggering
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.18,
                delayChildren: 0.4,
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: 45,
            filter: 'blur(8px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            transition: {
                type: "spring" as const,
                damping: 16,
                stiffness: 60
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: 'blur(8px)',
            transition: { duration: 1.2, ease: "easeInOut" as const }
        }
    };

    const parseAndAnimateLine = (text: string) => {
        // Split by highlights (*...*) or spaces, preserving both
        const parts = text.split(/(\*.*?\*)/g);

        const elements: any[] = [];
        let elementIdx = 0;

        parts.forEach((part) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                // It's a highlight, potentially with multiple words
                const content = part.slice(1, -1);
                // We want to animate each word within the highlight separately for the staggered effect
                const highlightWords = content.split(/\s+/);
                highlightWords.forEach((word) => {
                    elements.push(
                        <motion.span
                            key={elementIdx++}
                            variants={itemVariants}
                            className="inline-block mr-[0.2em] last:mr-0 text-brand-text font-bold"
                        >
                            {word}
                        </motion.span>
                    );
                });
            } else {
                // It's regular text, split into words
                const words = part.split(/\s+/).filter(w => w.length > 0);
                words.forEach((word) => {
                    elements.push(
                        <motion.span
                            key={elementIdx++}
                            variants={itemVariants}
                            className="inline-block text-brand-text mr-[0.2em] last:mr-0"
                        >
                            {word}
                        </motion.span>
                    );
                });
            }
        });

        return elements;
    };

    return (
        <div className="relative h-16 sm:h-20 md:h-24 w-fit flex items-center justify-start mb-1 perspective-1000 overflow-visible">
            <AnimatePresence>
                <motion.div
                    key={index}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute w-fit flex flex-nowrap whitespace-nowrap justify-start text-left"
                >
                    <h1 className="font-sans text-2xl md:text-3xl lg:text-4xl font-normal tracking-tighter text-brand-text leading-none flex flex-nowrap whitespace-nowrap justify-start">
                        {parseAndAnimateLine(displayLines[index])}
                    </h1>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
