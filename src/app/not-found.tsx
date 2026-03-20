'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Settings, ArrowRight } from 'lucide-react';

export default function NotFound() {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';
    const mainUrl = process.env.NEXT_PUBLIC_MAIN_URL || 'http://localhost:3000';

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-white">
            {/* Geometric Background Pattern from globals.css */}
            <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    background: `
                        linear-gradient(135deg, #0000 20.5%, #f8f8f8 0 29.5%, #0000 0) 0 10px,
                        linear-gradient(45deg, #0000 8%, #f8f8f8 0 17%, #0000 0 58%) 20px 0,
                        linear-gradient(135deg, #0000 8%, #f8f8f8 0 17%, #0000 0 58%, #f8f8f8 0 67%, #0000 0),
                        linear-gradient(45deg, #0000 8%, #f8f8f8 0 17%, #0000 0 58%, #f8f8f8 0 67%, #0000 0 83%, #f8f8f8 0 92%, #0000 0),
                        #ffffff
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Content Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-2xl w-full text-center"
            >
                <motion.h1 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2 
                    }}
                    className="text-[12rem] md:text-[18rem] font-oswald font-black leading-none text-brand-accent/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
                >
                    404
                </motion.h1>

                <div className="bg-white/80 backdrop-blur-xl border border-brand-border p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                    {/* Interior accent line */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent" />
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-oswald font-bold uppercase tracking-tighter text-brand-text mb-4">
                            PAGE NOT <span className="text-brand-accent">FOUND</span>
                        </h2>
                        
                        <p className="font-inter text-brand-muted text-lg md:text-xl mb-8 max-w-md mx-auto">
                            The space you're looking for doesn't exist. It might have been moved, deleted, or never existed in the first place.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link 
                                    href={mainUrl}
                                    className="flex items-center gap-2 px-8 py-4 bg-brand-text text-white font-oswald font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors w-full sm:w-auto justify-center"
                                >
                                    <Home className="w-5 h-5" />
                                    Take Me Home
                                </Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link 
                                    href={adminUrl}
                                    className="flex items-center gap-2 px-8 py-4 bg-white border border-brand-border text-brand-text font-oswald font-bold uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all w-full sm:w-auto justify-center group/btn"
                                >
                                    <Settings className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-500" />
                                    Admin Portal
                                </Link>
                            </motion.div>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-2 text-brand-muted font-oswald font-bold uppercase tracking-widest text-sm opacity-50">
                            <span>LOHANRAJO</span>
                            <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                            <span>METAL ARTS</span>
                        </div>
                    </motion.div>

                    {/* Animated corner accent */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ 
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -bottom-8 -right-8 w-24 h-24 border-4 border-brand-accent/10 pointer-events-none"
                    />
                </div>
            </motion.div>
        </div>
    );
}
