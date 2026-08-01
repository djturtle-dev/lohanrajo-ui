'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 1, zIndex: 100 }}
                animate={{ opacity: 0, zIndex: -1 }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 1.8 }}
                className="fixed inset-0 bg-brand-bg flex items-center justify-center pointer-events-none"
            >
                {/* Subtle grid background */}
                <div 
                    className="absolute inset-0 opacity-10"
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
                        <defs>
                            <filter id="glow-template" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        
                        <motion.path 
                            d="M240.847 94.749L229.881 98.1035L240.847 116.816V117.23L195.155 216.896L240.847 234.393V237H13V25H240.847V94.749Z"
                            variants={{
                                hidden: { pathLength: 0, fillOpacity: 0, strokeOpacity: 0 },
                                visible: { 
                                    pathLength: 1, 
                                    strokeOpacity: 1,
                                    transition: { 
                                        pathLength: { type: "tween", duration: 1.2, ease: "easeInOut" },
                                        strokeOpacity: { duration: 0.1 }
                                    }
                                },
                                fill: {
                                    fillOpacity: 1,
                                    transition: { delay: 1.2, duration: 0.5, ease: "easeOut" }
                                }
                            }}
                            stroke="var(--color-brand-accent)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="var(--color-brand-accent)"
                            filter="url(#glow-template)"
                        />
                    </motion.svg>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.4 }}
                        className="absolute -bottom-16 w-max text-center"
                    >
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] uppercase text-brand-muted">
                            Loading
                        </span>
                    </motion.div>
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </>
    );
}
