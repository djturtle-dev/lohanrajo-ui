'use client'

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from 'lucide-react';
import { getAssetUrl } from '@/lib/utils';

interface AboutPhotoGalleryProps {
    images: string[];
    establishedText?: string;
    altText?: string;
}

export default function AboutPhotoGallery({
    images,
    establishedText = "Estd in 1992",
    altText = "LOHANRAJO Industries and Technologies"
}: AboutPhotoGalleryProps) {
    const validImages = images && images.length > 0 ? images : ['/our company.png'];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const nextPhoto = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, [validImages.length]);

    const prevPhoto = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }, [validImages.length]);

    // Auto-advance every 6s unless hovered or lightbox open
    useEffect(() => {
        if (validImages.length <= 1 || isHovered || lightboxOpen) return;
        const timer = setInterval(() => {
            nextPhoto();
        }, 6000);
        return () => clearInterval(timer);
    }, [validImages.length, isHovered, lightboxOpen, nextPhoto]);

    // Keyboard navigation when lightbox is open
    useEffect(() => {
        if (!lightboxOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, nextPhoto, prevPhoto]);

    const currentImageSrc = getAssetUrl(validImages[currentIndex]) || '/our company.png';

    return (
        <>
            <div 
                className="relative card-glass p-5 sm:p-7 flex flex-col justify-between h-full min-h-[380px] group overflow-hidden border border-brand-border/60"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Corner Technical Decors */}
                <span className="absolute top-3 left-3 text-[10px] font-mono text-brand-muted/50 tracking-wider z-20">
                    01 // LIAT {validImages.length > 1 ? `[${currentIndex + 1}/${validImages.length}]` : ''}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-mono text-brand-accent/80 font-semibold tracking-wider z-20">
                    {establishedText}
                </span>
                <span className="absolute bottom-3 left-3 w-2 h-2 border-l border-b border-brand-accent z-20" />
                <span className="absolute bottom-3 right-3 w-2 h-2 border-r border-b border-brand-accent z-20" />

                {/* Main Image Display Area */}
                <div className="relative w-full aspect-[4/3] max-w-md my-auto flex items-center justify-center mx-auto">
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-brand-accent/10 rounded-2xl blur-xl group-hover:bg-brand-accent/20 transition-all duration-700 pointer-events-none" />

                    <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                        <Image
                            key={currentIndex}
                            src={currentImageSrc}
                            alt={`${altText} - Photo ${currentIndex + 1}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-contain p-2 transition-all duration-500 group-hover:scale-[1.03]"
                            priority={currentIndex === 0}
                        />
                    </div>

                    {/* Expand / Lightbox Button */}
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        aria-label="View photo in full screen"
                        className="absolute bottom-2 right-2 z-20 p-2 rounded-full bg-brand-panel/80 hover:bg-brand-accent hover:text-white border border-brand-border/60 text-brand-text opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm cursor-pointer"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Navigation Arrows for multi-photo */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prevPhoto}
                                aria-label="Previous photo"
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-brand-panel/80 hover:bg-brand-accent hover:text-white border border-brand-border/60 text-brand-text opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={nextPhoto}
                                aria-label="Next photo"
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-brand-panel/80 hover:bg-brand-accent hover:text-white border border-brand-border/60 text-brand-text opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails strip (visible when there are 2+ photos) */}
                {validImages.length > 1 && (
                    <div className="mt-4 pt-3 border-t border-brand-border/40 relative z-20">
                        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
                            {validImages.map((img, idx) => {
                                const thumbSrc = getAssetUrl(img) || '/our company.png';
                                const isActive = idx === currentIndex;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentIndex(idx)}
                                        aria-label={`Go to photo ${idx + 1}`}
                                        className={`relative w-11 h-8 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer shrink-0 ${
                                            isActive
                                                ? 'border-brand-accent ring-2 ring-brand-accent/40 scale-105'
                                                : 'border-brand-border/60 opacity-60 hover:opacity-100 hover:border-brand-accent/50'
                                        }`}
                                    >
                                        <Image
                                            src={thumbSrc}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            sizes="44px"
                                            className="object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-label="Full size photo view"
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in-0 duration-200"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div 
                        className="relative max-w-5xl w-full h-[80vh] flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Bar with Counter & Close */}
                        <div className="w-full flex items-center justify-between text-white/80 pb-3 border-b border-white/10 mb-4 px-2">
                            <span className="font-mono text-xs tracking-wider">
                                Photo {currentIndex + 1} of {validImages.length}
                            </span>
                            <button
                                type="button"
                                onClick={() => setLightboxOpen(false)}
                                aria-label="Close full size view"
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Large Image View */}
                        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
                            <Image
                                src={currentImageSrc}
                                alt={`${altText} - Full view`}
                                fill
                                sizes="90vw"
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Modal Navigation Controls */}
                        {validImages.length > 1 && (
                            <div className="w-full flex items-center justify-between pt-4 mt-2 px-2">
                                <button
                                    type="button"
                                    onClick={prevPhoto}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                <div className="flex gap-1.5">
                                    {validImages.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setCurrentIndex(i)}
                                            aria-label={`Jump to slide ${i + 1}`}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                i === currentIndex ? 'bg-brand-accent w-6' : 'bg-white/30 hover:bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={nextPhoto}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors cursor-pointer"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
