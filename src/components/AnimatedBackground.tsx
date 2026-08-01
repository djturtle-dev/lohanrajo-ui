'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ backgroundColor: 'var(--th-bg)' }}>
            {/* Mesh Wire Grid Background */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 100%)'
                }}
            >
                <div 
                    className="absolute inset-[-50%] opacity-100 rotate-45"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, var(--th-border) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--th-border) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px',
                        opacity: 0.5,
                    }}
                />
            </div>

            {/* Rotating Gear 1 */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-32 -right-32 w-96 h-96 opacity-[0.04]"
            >
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-white">
                    <path d="M96.7 44.8l-8.6-1.5c-.8-3.4-2.1-6.6-3.8-9.6l5.2-7.1c1.4-1.9 1-4.6-.7-6.3L81.2 12.6c-1.8-1.8-4.5-2.1-6.4-.7l-6.9 5.2c-3-1.8-6.2-3.1-9.6-4L56.9 4.3C56.5 1.9 54.4 0 52 0h-10c-2.4 0-4.5 1.9-4.9 4.3l-1.4 8.7c-3.4.8-6.6 2.2-9.6 4l-6.9-5.2c-1.9-1.4-4.6-1.1-6.4.7L5.2 20.3c-1.8 1.8-2.1 4.5-.7 6.3l5.2 7.1c-1.7 3-3 6.2-3.8 9.6L-2.7 44.8C-5.1 45.2-7 47.3-7 49.7v10c0 2.4 1.9 4.5 4.3 4.9l8.6 1.5c.8 3.4 2.1 6.6 3.8 9.6l-5.2 7.1c-1.4 1.9-1 4.6.7 6.3l7.6 7.6c1.8 1.8 4.5 2.1 6.4.7l6.9-5.2c3 1.8 6.2 3.1 9.6 4l1.4 8.7c.4 2.4 2.5 4.3 4.9 4.3h10c2.4 0 4.5-1.9 4.9-4.3l1.4-8.7c3.4-.8 6.6-2.2 9.6-4l6.9 5.2c1.9 1.4 4.6 1.1 6.4-.7l7.6-7.6c1.8-1.8 2.1-4.5.7-6.3l-5.2-7.1c1.7-3 3-6.2 3.8-9.6l8.6-1.5c2.4-.4 4.3-2.5 4.3-4.9v-10c.1-2.4-1.8-4.5-4.2-4.9zM47 67.5C35.7 67.5 26.5 58.3 26.5 47S35.7 26.5 47 26.5 67.5 35.7 67.5 47 58.3 67.5 47 67.5z"/>
                </svg>
            </motion.div>

            {/* Rotating Gear 2 */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/4 -left-32 w-80 h-80 opacity-[0.05]"
            >
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-brand-accent">
                    <path d="M96.7 44.8l-8.6-1.5c-.8-3.4-2.1-6.6-3.8-9.6l5.2-7.1c1.4-1.9 1-4.6-.7-6.3L81.2 12.6c-1.8-1.8-4.5-2.1-6.4-.7l-6.9 5.2c-3-1.8-6.2-3.1-9.6-4L56.9 4.3C56.5 1.9 54.4 0 52 0h-10c-2.4 0-4.5 1.9-4.9 4.3l-1.4 8.7c-3.4.8-6.6 2.2-9.6 4l-6.9-5.2c-1.9-1.4-4.6-1.1-6.4.7L5.2 20.3c-1.8 1.8-2.1 4.5-.7 6.3l5.2 7.1c-1.7 3-3 6.2-3.8 9.6L-2.7 44.8C-5.1 45.2-7 47.3-7 49.7v10c0 2.4 1.9 4.5 4.3 4.9l8.6 1.5c.8 3.4 2.1 6.6 3.8 9.6l-5.2 7.1c-1.4 1.9-1 4.6.7 6.3l7.6 7.6c1.8 1.8 4.5 2.1 6.4.7l6.9-5.2c3 1.8 6.2 3.1 9.6 4l1.4 8.7c.4 2.4 2.5 4.3 4.9 4.3h10c2.4 0 4.5-1.9 4.9-4.3l1.4-8.7c3.4-.8 6.6-2.2 9.6-4l6.9 5.2c1.9 1.4 4.6 1.1 6.4-.7l7.6-7.6c1.8-1.8 2.1-4.5.7-6.3l-5.2-7.1c1.7-3 3-6.2 3.8-9.6l8.6-1.5c2.4-.4 4.3-2.5 4.3-4.9v-10c.1-2.4-1.8-4.5-4.2-4.9zM47 67.5C35.7 67.5 26.5 58.3 26.5 47S35.7 26.5 47 26.5 67.5 35.7 67.5 47 58.3 67.5 47 67.5z"/>
                </svg>
            </motion.div>

            {/* Interactive Cursor Grid Mask - Only illuminates the grid lines with a gradient */}
            <div 
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
                }}
            >
                <div className="absolute inset-[-50%] rotate-45">
                    <motion.div 
                        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-br from-brand-accent2 via-brand-accent/60 to-transparent opacity-100 bg-[length:200%_200%]"
                        style={{
                            maskImage: `
                                linear-gradient(to right, black 1px, transparent 1px),
                                linear-gradient(to bottom, black 1px, transparent 1px)
                            `,
                            maskSize: '30px 30px',
                            WebkitMaskImage: `
                                linear-gradient(to right, black 1px, transparent 1px),
                                linear-gradient(to bottom, black 1px, transparent 1px)
                            `,
                            WebkitMaskSize: '30px 30px'
                        }}
                    />
                </div>
            </div>

            {/* Animated shooting stars, snapped to the rotated 30px grid */}
            <div className="absolute inset-[-50%] rotate-45 pointer-events-none">
                {/* Horizontal (diagonal top-left to bottom-right) */}
                <motion.div
                    animate={{ x: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 2, times: [0, 0.4, 0.5, 1] }}
                    className="absolute top-[900px] left-0 w-1/4 h-[1px] bg-gradient-to-r from-transparent to-brand-text/80 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[2px] after:h-[2px] after:bg-brand-text after:rounded-full"
                />
                <motion.div
                    animate={{ x: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 7, times: [0, 0.3, 0.4, 1] }}
                    className="absolute top-[1500px] left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent to-brand-accent/80 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[2px] after:h-[2px] after:bg-brand-accent after:rounded-full"
                />
                <motion.div
                    animate={{ x: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 1, times: [0, 0.2, 0.3, 1] }}
                    className="absolute top-[2100px] left-0 w-1/4 h-[2px] bg-gradient-to-r from-transparent to-brand-accent2/80 blur-[1px] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[3px] after:h-[3px] after:bg-brand-accent2 after:rounded-full"
                />
                <motion.div
                    animate={{ x: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 13, repeat: Infinity, ease: 'linear', delay: 4, times: [0, 0.3, 0.4, 1] }}
                    className="absolute top-[750px] left-0 w-1/4 h-[1px] bg-gradient-to-r from-transparent to-brand-text/60 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[2px] after:h-[2px] after:bg-brand-text after:rounded-full"
                />
                <motion.div
                    animate={{ x: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear', delay: 1, times: [0, 0.3, 0.4, 1] }}
                    className="absolute top-[1200px] left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent to-brand-accent/60 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[2px] after:h-[2px] after:bg-brand-accent after:rounded-full"
                />
                <motion.div
                    animate={{ x: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 6, times: [0, 0.2, 0.3, 1] }}
                    className="absolute top-[1800px] left-0 w-1/5 h-[1px] bg-gradient-to-r from-transparent to-brand-text/60 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[2px] after:h-[2px] after:bg-brand-text after:rounded-full"
                />

                {/* Vertical (diagonal top-right to bottom-left) */}
                <motion.div
                    animate={{ y: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 5, times: [0, 0.3, 0.4, 1] }}
                    className="absolute left-[900px] top-0 h-1/3 w-[1px] bg-gradient-to-b from-transparent to-brand-text/80 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-[2px] after:bg-brand-text after:rounded-full"
                />
                <motion.div
                    animate={{ y: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear', delay: 0, times: [0, 0.3, 0.4, 1] }}
                    className="absolute left-[1500px] top-0 h-1/2 w-[1px] bg-gradient-to-b from-transparent to-brand-accent/80 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-[2px] after:bg-brand-accent after:rounded-full"
                />
                <motion.div
                    animate={{ y: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 8, times: [0, 0.2, 0.3, 1] }}
                    className="absolute left-[2100px] top-0 h-1/3 w-[1px] bg-gradient-to-b from-transparent to-brand-text/60 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-[2px] after:bg-brand-text after:rounded-full"
                />
                <motion.div
                    animate={{ y: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 2, times: [0, 0.3, 0.4, 1] }}
                    className="absolute left-[750px] top-0 h-1/4 w-[1px] bg-gradient-to-b from-transparent to-brand-accent/60 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-[2px] after:bg-brand-accent after:rounded-full"
                />
                <motion.div
                    animate={{ y: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 5, times: [0, 0.2, 0.3, 1] }}
                    className="absolute left-[1200px] top-0 h-1/3 w-[1px] bg-gradient-to-b from-transparent to-brand-text/60 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-[2px] after:bg-brand-text after:rounded-full"
                />
                <motion.div
                    animate={{ y: ['-1000px', '4000px', '4000px'], opacity: [0, 1, 0, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 3, times: [0, 0.3, 0.4, 1] }}
                    className="absolute left-[1800px] top-0 h-1/4 w-[1px] bg-gradient-to-b from-transparent to-brand-text/60 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-[2px] after:bg-brand-text after:rounded-full"
                />
            </div>
        </div>
    );
}
