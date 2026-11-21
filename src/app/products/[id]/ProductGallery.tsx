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

    // Cleanup scroll lock, hide chatbot, and listen for global keyboard events
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
            if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            // Prevent download shortcuts (Ctrl+S / Cmd+S)
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleGlobalKeyDown);
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('data-gallery-open', 'true');
        } else {
            document.body.style.overflow = '';
            document.body.removeAttribute('data-gallery-open');
        }

        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
            document.body.style.overflow = '';
            document.body.removeAttribute('data-gallery-open');
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
                className="aspect-square bg-brand-panel border border-brand-border flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer no-download select-none"
                onClick={() => images.length > 0 && openModal(0)}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
            >
                {images.length > 0 ? (
                    <Image
                        src={getAssetUrl(images[0])}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover z-0 transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                        priority
                        draggable={false}
                    />
                ) : (
                    <div className="z-20 text-center">
                        <span className="text-brand-muted font-sans text-xs border border-brand-border px-4 py-2">No image provided</span>
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
                            className="aspect-square bg-brand-panel border border-brand-border relative overflow-hidden group cursor-pointer no-download select-none"
                            onClick={() => openModal(i + 1)}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                        >
                            <Image
                                src={getAssetUrl(img)}
                                alt={`${productName} ${i + 2}`}
                                fill
                                sizes="(max-width: 768px) 25vw, 12vw"
                                className="object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none select-none"
                                draggable={false}
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
                            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/98 backdrop-blur-md select-none"
                            onClick={closeModal}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                        >
                            {/* Close Button */}
                            <button 
                                className="absolute top-6 right-6 text-white hover:text-brand-accent p-2.5 transition-colors z-[10001] bg-black/40 hover:bg-black/70 rounded-full cursor-pointer"
                                onClick={closeModal}
                                aria-label="Close fullscreen view"
                            >
                                <X className="w-8 h-8 md:w-9 md:h-9" />
                            </button>

                            <div 
                                className="relative w-full h-full flex items-center justify-center p-4 md:p-12 select-none"
                                onClick={(e) => {
                                    // Close only if clicking the empty space of this container, not the image itself
                                    if (e.target === e.currentTarget) closeModal();
                                }}
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                            >
                                <Image
                                    src={getAssetUrl(images[currentIndex])}
                                    alt={`${productName} - Image ${currentIndex + 1}`}
                                    fill
                                    className="object-contain pointer-events-none select-none no-download"
                                    quality={100}
                                    unoptimized
                                    draggable={false}
                                />
                                {/* Transparent protection shield overlay */}
                                <div 
                                    className="absolute inset-0 z-20 pointer-events-auto"
                                    onContextMenu={(e) => e.preventDefault()}
                                    onDragStart={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        // Allow clicking empty background space around image to close
                                        if (e.target === e.currentTarget) closeModal();
                                    }}
                                />
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button 
                                        className="absolute left-4 md:left-8 text-white hover:text-brand-accent p-2 md:p-3 transition-colors z-[10001] bg-black/40 hover:bg-black/70 rounded-full cursor-pointer"
                                        onClick={prevImage}
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                                    </button>
                                    <button 
                                        className="absolute right-4 md:right-8 text-white hover:text-brand-accent p-2 md:p-3 transition-colors z-[10001] bg-black/40 hover:bg-black/70 rounded-full cursor-pointer"
                                        onClick={nextImage}
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                                    </button>
                                    
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-[10001] bg-black/40 px-4 py-2 rounded-full">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'bg-brand-accent w-6 md:w-8' : 'bg-white/50 hover:bg-white'}`}
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
