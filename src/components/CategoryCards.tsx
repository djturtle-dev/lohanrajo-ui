'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { Server, Box, Sun, Zap, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
if (typeof window !== "undefined") {
    // Only register plugins that don't cause SSR issues
}

const ICON_MAP: Record<string, LucideIcon> = { Server, Box, Sun, Zap };

interface Category {
    name: string;
    label: string;
    icon: string;
    id?: string;
    imageUrl?: string;
}

export default function CategoryCards({ categories }: { categories: Category[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useGSAP(() => {
        // Ambient background glow pulsing
        gsap.to('.ambient-glow', {
            scale: 1.1,
            opacity: 0.1,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        const validCards = cardsRef.current.filter(Boolean);
        if (validCards.length > 0) {
            gsap.fromTo(validCards, {
                y: 50,
                opacity: 0,
                scale: 0.95
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }
        
    }, { scope: containerRef });

    // 3D Magnetic Tilt effect & inner mouse tracking glow for all cards
    useEffect(() => {
        const cleanupFns: Array<() => void> = [];

        cardsRef.current.forEach((card) => {
            if (!card) return;
            
            const handleMouseMove = (e: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate tilt (normalized from -1 to 1, reversed for natural magnetic feel)
                const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
                const rotateY = ((x - centerX) / centerX) * 10;
                
                gsap.to(card, {
                    rotateX,
                    rotateY,
                    transformPerspective: 1500,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                
                const bgGlow = card.querySelector('.bento-mouse-glow') as HTMLElement | null;
                if (bgGlow) {
                    const maxOpacity = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--th-glow-opacity').trim()) || 0.2;
                    gsap.to(bgGlow, {
                        x: x - 150,
                        y: y - 150,
                        opacity: maxOpacity,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    overwrite: "auto"
                });
                
                const bgGlow = card.querySelector('.bento-mouse-glow');
                if (bgGlow) {
                    gsap.to(bgGlow, {
                        opacity: 0,
                        duration: 0.5
                    });
                }
            };

            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
            
            cleanupFns.push(() => {
                card.removeEventListener('mousemove', handleMouseMove);
                card.removeEventListener('mouseleave', handleMouseLeave);
            });
        });

        return () => {
            cleanupFns.forEach(fn => fn());
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Ambient background glow behind the entire section */}
            <div className="absolute inset-0 -inset-x-8 pointer-events-none overflow-hidden">
                <div className="ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#b8241d] blur-[120px] opacity-5" />
            </div>

            {/* Bento Grid */}
            <div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1500px" }}>
                {categories.map((cat, i) => {
                    const Icon = ICON_MAP[cat.icon] ?? Server;
                    
                    // The first item (BMS Panels) is the hero and spans 2 columns on desktop
                    const isHero = i === 0;

                    return (
                        <Link
                            href={`/products${cat.id ? `?category=${cat.id}` : ''}`}
                            key={i}
                            ref={el => { cardsRef.current[i] = el; }}
                            className={`group relative overflow-hidden card-glass flex flex-col min-h-[250px] ${isHero ? 'lg:col-span-2' : ''}`}
                            style={{ transformOrigin: 'center center' }}
                        >
                            {/* Hover mouse glow */}
                            <div className="bento-mouse-glow absolute top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0" style={{ background: 'rgba(184,36,29,0.3)', filter: 'blur(80px)', opacity: 0, ['--glow-max' as any]: 'var(--th-glow-opacity)' }} />

                            {/* Background Image (faded out subtly at bottom) */}
                            {cat.imageUrl && (
                                <div className="absolute inset-0 z-0">
                                    <img 
                                        src={cat.imageUrl} 
                                        alt={cat.label}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                                </div>
                            )}

                            {/* Large Background Icon */}
                            <div className="absolute -bottom-4 -right-4 z-0 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                                <Icon size={180} strokeWidth={1} />
                            </div>

                            {/* Content Area */}
                            <div className="relative z-10 flex-grow flex flex-col justify-end p-8">
                                <div className="flex items-center gap-3 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <Icon className="text-brand-accent w-6 h-6" />
                                    <span className="text-xs font-mono tracking-widest text-white/80 uppercase">Series 0{i+1}</span>
                                </div>
                                <h3 className="font-sans text-2xl md:text-3xl font-bold uppercase tracking-tight text-white drop-shadow-md">
                                    {cat.label}
                                </h3>
                                
                                {/* Hover Reveal Line */}
                                <div className="mt-4 overflow-hidden h-0 group-hover:h-auto group-hover:mt-6 transition-all duration-500">
                                    <div className="flex items-center text-xs font-mono tracking-widest uppercase text-brand-accent translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                        Explore Specs <ArrowUpRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* The 5th Card: View More */}
                <Link
                    href="/products"
                    ref={el => { cardsRef.current[categories.length] = el; }}
                    className="group relative overflow-hidden card-glass flex flex-col justify-center items-center min-h-[250px]"
                    style={{ transformOrigin: 'center center' }}
                >
                    <div className="bento-mouse-glow absolute top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0" style={{ background: 'rgba(184,36,29,0.3)', filter: 'blur(80px)', opacity: 0, ['--glow-max' as any]: 'var(--th-glow-opacity)' }} />
                    
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="w-16 h-16 rounded-full border border-brand-accent/30 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-transparent transition-colors duration-500">
                            <ArrowUpRight className="w-8 h-8 text-brand-accent group-hover:text-white group-hover:rotate-45 transition-all duration-500" />
                        </div>
                        <h3 className="font-sans text-xl font-bold uppercase tracking-widest text-brand-text text-center">
                            View All <br /> Products
                        </h3>
                    </div>
                </Link>
            </div>
        </div>
    );
}
