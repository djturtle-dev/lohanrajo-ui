'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 1, zIndex: 100 }}
                animate={{ opacity: 0, zIndex: -1 }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                className="fixed inset-0 bg-brand-bg flex items-center justify-center pointer-events-none"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="/logo.svg"
                        alt="Loading Logo"
                        width={200}
                        height={200}
                        className="w-auto h-32 md:h-48"
                        priority
                    />
                </motion.div>
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
