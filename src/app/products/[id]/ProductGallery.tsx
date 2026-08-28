'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
    productName: string;
    images: string[];
}

export default function ProductGallery({ productName, images }: ProductGalleryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Cleanup scroll lock and listen for global keyboard events
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
            if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleGlobalKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
            document.body.style.overflow = '';
        };
    }, [isModalOpen, images.length]);

    const openModal = (index: number) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            <div 
                className="aspect-square bg-brand-panel border border-brand-border flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                onClick={() => images.length > 0 && openModal(0)}
            >
                {images.length > 0 ? (
                    <Image
                        src={getAssetUrl(images[0])}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                ) : (
                    <div className="z-20 text-center">
                        <span className="text-brand-muted font-oswald tracking-widest uppercase border border-brand-border px-4 py-2">No Image Provided</span>
                    </div>
                )}
                {images.length > 0 && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                )}
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.slice(1).map((img, i) => (
                        <div 
                            key={i} 
                            className="aspect-square bg-brand-panel border border-brand-border relative overflow-hidden group cursor-pointer"
                            onClick={() => openModal(i + 1)}
                        >
                            <Image
                                src={getAssetUrl(img)}
                                alt={`${productName} ${i + 2}`}
                                fill
                                sizes="(max-width: 768px) 25vw, 12vw"
                                className="object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-brand-dark/10 mix-blend-multiply z-10" />
                        </div>
                    ))}
                </div>
            )}

            {mounted && createPortal(
                <AnimatePresence>
                    {isModalOpen && images.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 backdrop-blur-md pt-24"
                            onClick={closeModal}
                        >
                            {/* Header: Product Name */}
                            <div className="absolute top-24 left-6 md:top-28 md:left-10 z-[110] pointer-events-none">
                                <h2 className="text-white font-oswald text-2xl md:text-4xl uppercase tracking-widest drop-shadow-lg">{productName}</h2>
                            </div>

                            <button 
                                className="absolute top-24 right-6 md:top-28 md:right-10 text-white hover:text-brand-accent p-2 transition-colors z-[110] bg-black/20 rounded-full"
                                onClick={closeModal}
                                aria-label="Close"
                            >
                                <X className="w-8 h-8 md:w-10 md:h-10" />
                            </button>

                            <div 
                                className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                                onClick={(e) => {
                                    // Close only if clicking the empty space of this container, not the image itself
                                    if (e.target === e.currentTarget) closeModal();
                                }}
                            >
                                <Image
                                    src={getAssetUrl(images[currentIndex])}
                                    alt={`${productName} - Image ${currentIndex + 1}`}
                                    fill
                                    className="object-contain pointer-events-none"
                                    quality={100}
                                    unoptimized
                                />
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button 
                                        className="absolute left-4 md:left-8 text-white hover:text-brand-accent p-2 md:p-4 transition-colors z-[110] bg-black/20 rounded-full"
                                        onClick={prevImage}
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                                    </button>
                                    <button 
                                        className="absolute right-4 md:right-8 text-white hover:text-brand-accent p-2 md:p-4 transition-colors z-[110] bg-black/20 rounded-full"
                                        onClick={nextImage}
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                                    </button>
                                    
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-[110] bg-black/20 px-4 py-2 rounded-full">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-brand-accent w-6 md:w-8' : 'bg-white/50 hover:bg-white'}`}
                                                aria-label={`Go to image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
