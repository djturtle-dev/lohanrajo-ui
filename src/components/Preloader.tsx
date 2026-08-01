'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Prevent scrolling while preloader is active
        document.body.style.overflow = 'hidden';
        
        // Total animation time is ~2.8s
        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = '';
        }, 2800);
        
        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, []);

    const pathVariants = {
        hidden: { 
            pathLength: 0, 
            fillOpacity: 0,
            strokeOpacity: 0
        },
        visible: { 
            pathLength: 1, 
            strokeOpacity: 1,
            transition: { 
                pathLength: { type: "tween", duration: 1.6, ease: "easeInOut" },
                strokeOpacity: { duration: 0.1 }
            }
        },
        fill: {
            fillOpacity: 1,
            transition: { delay: 1.6, duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[9999] bg-brand-bg flex items-center justify-center overflow-hidden"
                >
                    {/* Subtle grid background to match the site's industrial aesthetic */}
                    <div 
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(to right, var(--th-border) 1px, transparent 1px), linear-gradient(to bottom, var(--th-border) 1px, transparent 1px)',
                            backgroundSize: '4rem 4rem',
                            maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)'
                        }}
                    />
                    
                    <div className="relative w-32 h-32 md:w-40 md:h-40 z-10 flex flex-col items-center justify-center">
                        <motion.svg 
                            width="100%" 
                            height="100%" 
                            viewBox="0 0 250 250" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            initial="hidden"
                            animate={["visible", "fill"]}
                        >
                            {/* Glow filter for the trace */}
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            
                            <motion.path 
                                d="M240.847 94.749L229.881 98.1035L240.847 116.816V117.23L195.155 216.896L240.847 234.393V237H13V25H240.847V94.749Z"
                                variants={pathVariants}
                                stroke="var(--color-brand-accent)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="var(--color-brand-accent)"
                                filter="url(#glow)"
                            />
                        </motion.svg>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.5 }}
                            className="absolute -bottom-16 w-max text-center"
                        >
                            <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] uppercase text-brand-muted">
                                Initializing
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
