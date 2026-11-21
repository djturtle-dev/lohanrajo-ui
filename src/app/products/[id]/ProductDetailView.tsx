'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetUrl } from '@/lib/utils';
import { 
    X, 
    ChevronLeft, 
    ChevronRight, 
    Maximize2, 
    ZoomIn, 
    ZoomOut, 
    RotateCcw, 
    ArrowLeft,
    Send,
    Images
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';

interface ProductDetailViewProps {
    product: {
        id: string;
        name: string;
        description: string;
        images: string[];
        category: { id: string; name: string };
        subCategory?: { id: string; name: string } | null;
    };
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
    const rawImages = product.images && product.images.length > 0 ? product.images : [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Zoom & Pan state for fullscreen modal
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDraggingPan, setIsDraggingPan] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Touch Swipe state for main image card
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const nextImage = useCallback(() => {
        if (rawImages.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % rawImages.length);
    }, [rawImages.length]);

    const prevImage = useCallback(() => {
        if (rawImages.length <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + rawImages.length) % rawImages.length);
    }, [rawImages.length]);

    // Reset zoom & pan when image changes or modal closes
    useEffect(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, [currentIndex, isModalOpen]);

    // Fullscreen keyboard & scroll management
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === '+' || e.key === '=') handleZoomIn();
            if (e.key === '-' || e.key === '_') handleZoomOut();
            if (e.key === '0') handleResetZoom();
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('data-gallery-open', 'true');
        } else {
            document.body.style.overflow = '';
            document.body.removeAttribute('data-gallery-open');
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            document.body.removeAttribute('data-gallery-open');
        };
    }, [isModalOpen, nextImage, prevImage]);

    const openModal = (index: number) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Zoom Handlers
    const handleZoomIn = () => setZoom((prev) => Math.min(Number((prev + 0.5).toFixed(2)), 3.5));
    const handleZoomOut = () => {
        setZoom((prev) => {
            const next = Math.max(Number((prev - 0.5).toFixed(2)), 1);
            if (next === 1) setPan({ x: 0, y: 0 });
            return next;
        });
    };
    const handleResetZoom = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    // Mouse Wheel Zoom in Fullscreen
    const handleWheelZoom = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    // Pan Dragging in Fullscreen
    const handleMouseDownPan = (e: React.MouseEvent) => {
        if (zoom <= 1) return;
        setIsDraggingPan(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMovePan = (e: React.MouseEvent) => {
        if (!isDraggingPan || zoom <= 1) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUpPan = () => {
        setIsDraggingPan(false);
    };

    // Touch Swipe Handlers for Main Card
    const minSwipeDistance = 45;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEndX(null);
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const distance = touchStartX - touchEndX;
        if (distance > minSwipeDistance) {
            nextImage();
        } else if (distance < -minSwipeDistance) {
            prevImage();
        }
    };

    const activeImageSrc = rawImages.length > 0 ? getAssetUrl(rawImages[currentIndex]) : '';

    return (
        <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 sm:px-8 pt-24 md:pt-28 pb-16">
            {/* Back Button */}
            <ScrollReveal direction="down" delay={0.1}>
                <Link 
                    href="/products" 
                    className="inline-flex items-center text-brand-muted hover:text-brand-text mb-8 transition-colors font-sans text-sm group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
                    Back to catalog
                </Link>
            </ScrollReveal>

            {/* Layout Grid: 2 Clean Sections (Left: Image, Right: Content) starting from top */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                
                {/* ============================================================== */}
                {/* SECTION 1: Product Image (Left)                                */}
                {/* ============================================================== */}
                <div className="flex flex-col justify-start lg:sticky lg:top-28">
                    <ScrollReveal direction="left" delay={0.15}>
                        <div 
                            className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-brand-panel border border-brand-border rounded-2xl flex flex-col items-center justify-center overflow-hidden group select-none shadow-lg cursor-pointer"
                            onClick={() => openModal(currentIndex)}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                        >
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-brand-accent/5 rounded-2xl blur-xl group-hover:bg-brand-accent/15 transition-all duration-700 pointer-events-none" />

                            {/* Main Image */}
                            {activeImageSrc ? (
                                <div className="relative w-full h-full p-4 flex items-center justify-center pointer-events-none">
                                    <Image
                                        key={currentIndex}
                                        src={activeImageSrc}
                                        alt={`${product.name} - Image ${currentIndex + 1}`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-contain p-4 z-0 transition-all duration-500 group-hover:scale-[1.03] select-none"
                                        priority={currentIndex === 0}
                                        draggable={false}
                                    />
                                </div>
                            ) : (
                                <div className="z-10 text-center p-6">
                                    <span className="text-brand-muted font-sans text-xs border border-brand-border px-4 py-2 rounded-full">
                                        No image provided
                                    </span>
                                </div>
                            )}

                            {/* Corner Decors & Photo Index */}
                            <span className="absolute top-3 left-3 text-[10px] font-mono text-brand-muted/70 tracking-wider z-10 px-2 py-0.5 rounded-full bg-brand-panel/80 border border-brand-border/40 backdrop-blur-sm pointer-events-none">
                                {rawImages.length > 0 ? `0${currentIndex + 1} / 0${rawImages.length}` : '01 // LIAT'}
                            </span>

                            {/* Fullscreen Button */}
                            {rawImages.length > 0 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(currentIndex);
                                    }}
                                    aria-label="View full screen with zoom"
                                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-brand-panel/80 hover:bg-brand-accent hover:text-white border border-brand-border text-brand-text transition-all duration-300 shadow-md backdrop-blur-sm cursor-pointer"
                                >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {/* In-Card Left & Right Navigation Arrows (without fullscreen) */}
                            {rawImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        aria-label="Previous image"
                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full btn-glass-secondary border border-brand-border/80 text-brand-text hover:text-brand-accent shadow-md backdrop-blur-md opacity-85 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        aria-label="Next image"
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full btn-glass-secondary border border-brand-border/80 text-brand-text hover:text-brand-accent shadow-md backdrop-blur-md opacity-85 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </>
                            )}

                            {/* Bottom Swipe Hint on mobile */}
                            {rawImages.length > 1 && (
                                <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1.5 z-10 pointer-events-none md:hidden">
                                    {rawImages.map((_, i) => (
                                        <span 
                                            key={i} 
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                i === currentIndex ? 'w-4 bg-brand-accent' : 'w-1.5 bg-brand-muted/40'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollReveal>
                </div>

                {/* ============================================================== */}
                {/* SECTION 2: Product Content (Right, unboxed, top-aligned)       */}
                {/* ============================================================== */}
                <ScrollReveal direction="right" delay={0.2} className="flex flex-col justify-start space-y-6">
                    {/* Line 1: Category & Sub Category Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent font-sans text-xs font-semibold tracking-wider uppercase w-fit">
                        <span>{product.category.name}</span>
                        {product.subCategory && (
                            <>
                                <span className="opacity-50">•</span>
                                <span>{product.subCategory.name}</span>
                            </>
                        )}
                    </div>

                    {/* Line 2: Product Name */}
                    <h1 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl text-brand-text text-balance">
                        {product.name}
                    </h1>

                    <div className="h-px w-full bg-brand-border/60" />

                    {/* Product Description */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-brand-muted/70 block">
                            Specification &amp; Overview
                        </span>
                        <div
                            className="prose prose-invert prose-brand text-brand-muted max-w-none font-sans text-sm sm:text-base leading-relaxed
                            prose-headings:font-playfair prose-headings:italic
                            prose-a:text-brand-accent prose-strong:text-brand-text"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>

                    {/* Extra Images in Smaller Grids */}
                    {rawImages.length > 1 && (
                        <div className="pt-2 space-y-3">
                            <div className="flex items-center justify-between pb-1 border-b border-brand-border/40">
                                <span className="text-xs font-sans uppercase tracking-widest text-brand-text font-semibold flex items-center gap-2">
                                    <Images className="w-4 h-4 text-brand-accent" />
                                    Product Views &amp; Details
                                </span>
                                <span className="font-mono text-xs text-brand-muted">
                                    {rawImages.length} images
                                </span>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {rawImages.map((img, i) => {
                                    const thumbSrc = getAssetUrl(img);
                                    const isActive = i === currentIndex;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setCurrentIndex(i)}
                                            className={`relative aspect-square rounded-xl overflow-hidden border bg-brand-panel transition-all duration-200 cursor-pointer p-1.5 group/thumb ${
                                                isActive
                                                    ? 'border-brand-accent ring-2 ring-brand-accent/50 scale-105 shadow-md z-10'
                                                    : 'border-brand-border/60 opacity-70 hover:opacity-100 hover:border-brand-accent/60'
                                            }`}
                                            aria-label={`Select photo ${i + 1}`}
                                        >
                                            <Image
                                                src={thumbSrc}
                                                alt={`${product.name} thumbnail ${i + 1}`}
                                                fill
                                                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 12vw"
                                                className="object-contain p-1 pointer-events-none select-none transition-transform group-hover/thumb:scale-105"
                                                draggable={false}
                                            />
                                            <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/60 text-white pointer-events-none">
                                                0{i + 1}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Direct Request Button */}
                    <div className="pt-4">
                        <Link 
                            href={`/contact?product=${encodeURIComponent(product.name)}`}
                            className="w-full sm:w-auto px-10 py-4 rounded-full btn-glass-primary font-playfair italic font-semibold text-center text-sm sm:text-base inline-flex items-center justify-center gap-2 group shadow-lg"
                        >
                            <span>Request a Quote</span>
                            <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </ScrollReveal>

            </div>

            {/* ============================================================== */}
            {/* FULLSCREEN LIGHTBOX MODAL WITH ZOOM IN / ZOOM OUT / PAN        */}
            {/* ============================================================== */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isModalOpen && rawImages.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-md select-none"
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                        >
                            {/* Top Control Bar: Product Title, Zoom Controls, Close Button */}
                            <div className="w-full flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 z-[10002] bg-black/60 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <span className="font-playfair italic text-white text-base sm:text-lg truncate max-w-[200px] sm:max-w-md">
                                        {product.name}
                                    </span>
                                    <span className="font-mono text-xs text-white/50 px-2 py-0.5 rounded-full border border-white/20">
                                        {currentIndex + 1} / {rawImages.length}
                                    </span>
                                </div>

                                {/* Zoom & Action Tools */}
                                <div className="flex items-center gap-2">
                                    {/* Zoom Out Button */}
                                    <button
                                        type="button"
                                        onClick={handleZoomOut}
                                        disabled={zoom <= 1}
                                        aria-label="Zoom out"
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                                        title="Zoom out (-)"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </button>

                                    {/* Zoom Percentage */}
                                    <button
                                        type="button"
                                        onClick={handleResetZoom}
                                        aria-label="Reset zoom to 100%"
                                        className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors cursor-pointer min-w-[56px] text-center"
                                        title="Reset zoom (0)"
                                    >
                                        {Math.round(zoom * 100)}%
                                    </button>

                                    {/* Zoom In Button */}
                                    <button
                                        type="button"
                                        onClick={handleZoomIn}
                                        disabled={zoom >= 3.5}
                                        aria-label="Zoom in"
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                                        title="Zoom in (+)"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>

                                    {/* Reset Pan/Zoom Button */}
                                    {zoom > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleResetZoom}
                                            aria-label="Reset view"
                                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                            title="Reset view"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    )}

                                    <div className="h-5 w-px bg-white/20 mx-1" />

                                    {/* Close Button */}
                                    <button 
                                        type="button"
                                        onClick={closeModal}
                                        aria-label="Close fullscreen view"
                                        className="p-2 rounded-full bg-white/10 hover:bg-brand-accent text-white transition-colors cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Zoomable Viewport */}
                            <div 
                                className={`relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden p-2 sm:p-6 ${
                                    zoom > 1 ? (isDraggingPan ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
                                }`}
                                onWheel={handleWheelZoom}
                                onMouseDown={handleMouseDownPan}
                                onMouseMove={handleMouseMovePan}
                                onMouseUp={handleMouseUpPan}
                                onDoubleClick={() => {
                                    if (zoom > 1) {
                                        handleResetZoom();
                                    } else {
                                        setZoom(2);
                                    }
                                }}
                            >
                                <div 
                                    className="relative w-full h-[76vh] max-w-6xl max-h-[80vh] flex items-center justify-center transition-transform duration-100 ease-out"
                                    style={{
                                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                        transformOrigin: 'center center'
                                    }}
                                >
                                    {rawImages[currentIndex] && (
                                        <Image
                                            key={`${currentIndex}-${rawImages[currentIndex]}`}
                                            src={getAssetUrl(rawImages[currentIndex])}
                                            alt={`${product.name} - Fullscreen View`}
                                            fill
                                            sizes="100vw"
                                            className="object-contain pointer-events-none select-none no-download"
                                            quality={95}
                                            draggable={false}
                                            priority
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Left & Right Modal Navigation Arrows */}
                            {rawImages.length > 1 && (
                                <>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        aria-label="Previous image"
                                        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white hover:text-brand-accent p-3 transition-colors z-[10001] bg-black/60 hover:bg-black/90 border border-white/10 rounded-full cursor-pointer shadow-xl"
                                    >
                                        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        aria-label="Next image"
                                        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white hover:text-brand-accent p-3 transition-colors z-[10001] bg-black/60 hover:bg-black/90 border border-white/10 rounded-full cursor-pointer shadow-xl"
                                    >
                                        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </button>
                                </>
                            )}

                            {/* Bottom Dots & Zoom Hint Toolbar */}
                            <div className="w-full py-4 flex items-center justify-center gap-4 z-[10002] bg-black/60 border-t border-white/10">
                                {rawImages.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        {rawImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`h-2 rounded-full transition-all cursor-pointer ${
                                                    idx === currentIndex ? 'bg-brand-accent w-6' : 'bg-white/40 hover:bg-white w-2'
                                                }`}
                                                aria-label={`Go to image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                                <span className="text-[11px] font-sans text-white/50 hidden sm:inline-block">
                                    Scroll to zoom • Double-click to toggle • Drag to pan
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
