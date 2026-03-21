'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Quote, Mail, Globe } from 'lucide-react';

interface Testimonial {
    id: string;
    authorName: string | null;
    content: string;
    rating: number | null;
    source: string;
    featured?: boolean;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
    const [constraints, setConstraints] = useState({ left: 0, right: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Ensure we always have exactly 6 slots
    const paddedTestimonials = [...testimonials];
    while (paddedTestimonials.length < 6) {
        paddedTestimonials.push({
            id: `placeholder-${paddedTestimonials.length}`,
            authorName: 'Verified Client',
            content: 'We are truly grateful for the trust our clients place in us. New testimonials and project success stories are added regularly as we complete new installations.',
            rating: 5,
            source: 'Verified',
        });
    }

    useEffect(() => {
        const updateConstraints = () => {
            if (containerRef.current && scrollRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const scrollWidth = scrollRef.current.scrollWidth;
                setConstraints({
                    left: -(scrollWidth - containerWidth),
                    right: 0
                });
            }
        };

        const timer = setTimeout(updateConstraints, 100);
        window.addEventListener('resize', updateConstraints);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateConstraints);
        };
    }, [paddedTestimonials]);

    return (
        <section className="bg-brand-light">
            <div className="max-w-5xl mx-auto flex justify-between items-end mb-12 border-b border-brand-border pb-6">
                <div>
                    <h2 className="font-oswald text-4xl md:text-5xl uppercase tracking-widest text-brand-text">Testimonials</h2>
                </div>
            </div>

            <div className="max-w-5xl mx-auto relative overflow-hidden" ref={containerRef}>
                <motion.div
                    ref={scrollRef}
                    className="flex gap-6 px-4 md:px-[calc((60vw-1280px)/2)] cursor-grab active:cursor-grabbing pb-12"
                    drag="x"
                    dragConstraints={constraints}
                    dragElastic={0.1}
                    dragTransition={{ bounceStiffness: 500, bounceDamping: 25 }}
                    whileTap={{ cursor: 'grabbing' }}
                >
                    {paddedTestimonials.map((t, idx) => {
                        const isPlaceholder = idx >= testimonials.length;
                        return (
                            <motion.div
                                key={t.id}
                                className={`min-w-[320px] md:min-w-[450px] bg-white border border-brand-border p-6 shadow-sm flex flex-col justify-between select-none ${isPlaceholder ? 'opacity-60 grayscale' : ''}`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={`${i < (t.rating || 5) ? 'fill-brand-accent text-brand-accent' : 'text-brand-border'}`}
                                                />
                                            ))}
                                        </div>
                                        <Quote className="text-brand-dark/10 w-12 h-12" />
                                    </div>
                                    <p className={`text-brand-text font-inter text-lg leading-relaxed italic mb-6 ${isPlaceholder ? 'text-brand-muted' : ''}`}>
                                        "{t.content}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-brand-border pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 rounded-none border border-brand-border overflow-hidden bg-brand-dark">
                                            <Image
                                                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${encodeURIComponent(t.authorName || 'User')}`}
                                                alt={t.authorName || 'Reviewer'}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                                draggable={false}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-oswald uppercase tracking-widest text-brand-text text-base">{t.authorName}</h4>
                                            <span className="text-xs uppercase tracking-[0.2em] text-brand-muted">{t.source} Review</span>
                                        </div>
                                    </div>
                                    {!isPlaceholder && t.source === 'Google' && (
                                        <div className="w-6 h-6">
                                            <svg viewBox="0 0 24 24" className="w-full h-full">
                                                <path fill="#4285F4" d="M 22.56 12.25 c 0 -0.78 -0.07 -1.53 -0.2 -2.25 H 12 v 4.26 h 5.92 c -0.26 1.37 -1.04 2.53 -2.21 3.31 v 2.77 h 3.57 c 2.08 -1.92 3.28 -4.74 3.28 -8.09 z" />
                                                <path fill="#34A853" d="M 12 23 c 2.97 0 5.46 -0.98 7.28 -2.66 l -3.57 -2.77 c -0.98 0.66 -2.23 1.06 -3.71 1.06 -2.86 0 -5.29 -1.93 -6.16 -4.53 H 2.18 v 2.84 C 3.99 20.53 7.7 23 12 23 z" />
                                                <path fill="#FBBC05" d="M 5.84 14.1 c -0.22 -0.66 -0.35 -1.36 -0.35 -2.1 s 0.13 -1.44 0.35 -2.1 V 7.06 H 2.18 C 1.43 8.55 1 10.22 1 12 s 0.43 3.45 1.18 4.94 l 3.66 -2.84 z" />
                                                <path fill="#EA4335" d="M 12 5.38 c 1.62 0 3.06 0.56 4.21 1.64 l 3.15 -3.15 C 17.45 2.09 14.97 1 12 1 c -4.3 0 -8.01 2.47 -9.82 6.06 l 3.66 2.84 c 0.87 -2.6 3.3 -4.52 6.16 -4.52 z" />
                                            </svg>
                                        </div>
                                    )}
                                    {!isPlaceholder && t.source === 'Justdial' && (
                                        <div className="w-10 h-6 flex items-center justify-center bg-[#005c99] rounded-sm p-1">
                                            <span className="text-xs font-bold text-white tracking-tighter italic">jd</span>
                                        </div>
                                    )}
                                    {!isPlaceholder && t.source === 'WhatsApp' && (
                                        <div className="w-6 h-6 bg-[#25D366] rounded-sm flex items-center justify-center p-[3px]">
                                            <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </div>
                                    )}
                                    {!isPlaceholder && (t.source === 'E-mail' || t.source === 'Email') && (
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <Mail size={20} className="text-blue-500" />
                                        </div>
                                    )}
                                    {!isPlaceholder && (t.source === 'Direct' || t.source === 'Verified') && (
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <Globe size={20} className="text-brand-accent" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                    {/* Extra space at the end to ensure the last item is fully visible */}
                    <div className="min-w-[100px] h-full" />
                </motion.div>
            </div>
        </section>
    );
}
