'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, Star } from 'lucide-react';

interface SourceStat {
    name: string;
    rating: number;
    count: number;
}

const iconComponents = {
    Google: (
        <svg viewBox="0 0 24 24" className="w-full h-full">
            <path fill="#4285F4" d="M 22.56 12.25 c 0 -0.78 -0.07 -1.53 -0.2 -2.25 H 12 v 4.26 h 5.92 c -0.26 1.37 -1.04 2.53 -2.21 3.31 v 2.77 h 3.57 c 2.08 -1.92 3.28 -4.74 3.28 -8.09 z" />
            <path fill="#34A853" d="M 12 23 c 2.97 0 5.46 -0.98 7.28 -2.66 l -3.57 -2.77 c -0.98 0.66 -2.23 1.06 -3.71 1.06 -2.86 0 -5.29 -1.93 -6.16 -4.53 H 2.18 v 2.84 C 3.99 20.53 7.7 23 12 23 z" />
            <path fill="#FBBC05" d="M 5.84 14.1 c -0.22 -0.66 -0.35 -1.36 -0.35 -2.1 s 0.13 -1.44 0.35 -2.1 V 7.06 H 2.18 C 1.43 8.55 1 10.22 1 12 s 0.43 3.45 1.18 4.94 l 3.66 -2.84 z" />
            <path fill="#EA4335" d="M 12 5.38 c 1.62 0 3.06 0.56 4.21 1.64 l 3.15 -3.15 C 17.45 2.09 14.97 1 12 1 c -4.3 0 -8.01 2.47 -9.82 6.06 l 3.66 2.84 c 0.87 -2.6 3.3 -4.52 6.16 -4.52 z" />
        </svg>
    ),
    Justdial: (
        <div className="w-full h-full bg-[#005c99] rounded-[2px] flex items-center justify-center p-[1px]">
            <span className="text-[10px] font-bold text-white leading-none italic tracking-tighter">jd</span>
        </div>
    ),
    WhatsApp: (
        <div className="w-full h-full bg-[#25D366] rounded-sm flex items-center justify-center p-[2px]">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        </div>
    ),
    Mail: (
        <div className="w-full h-full bg-brand-accent rounded-sm flex items-center justify-center">
            <Mail size={14} className="text-white" />
        </div>
    ),
};

export default function ReviewSourceAnimation({ stats }: { stats: SourceStat[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % stats.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [stats.length]);

    const currentStat = stats[index];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.3,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 150, damping: 25 }
        },
        exit: {
            y: -10,
            opacity: 0,
            transition: { duration: 1.0, ease: "easeInOut" as const }
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence>
                <motion.div
                    key={index}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3"
                >
                    <motion.div variants={itemVariants} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
                        {iconComponents[currentStat.name as keyof typeof iconComponents]}
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center gap-1 shrink-0">
                        <span className="font-oswald text-base font-bold text-brand-text">
                            {currentStat.rating.toFixed(1)}
                        </span>
                        <Star size={12} className="fill-brand-accent text-brand-accent" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
