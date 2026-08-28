'use client';

import { useRef, useEffect } from 'react';
import { Factory, ShieldCheck, Lightbulb } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/animations/ScrollReveal';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Pillar {
    icon: string;
    title: string;
    desc: string;
}

export default function SpatialNodeMap({ pillars }: { pillars: Pillar[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !lineRef.current) return;

        gsap.fromTo(lineRef.current,
            { scaleX: 0, transformOrigin: 'left center' },
            {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    end: 'bottom 80%',
                    scrub: 1,
                }
            }
        );

        return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    }, []);

    const getIcon = (iconName: string) => {
        const cls = 'text-brand-accent w-10 h-10';
        switch (iconName) {
            case 'Factory':    return <Factory    className={cls} strokeWidth={1.5} />;
            case 'ShieldCheck': return <ShieldCheck className={cls} strokeWidth={1.5} />;
            case 'Lightbulb':  return <Lightbulb  className={cls} strokeWidth={1.5} />;
            default:           return <Factory    className={cls} strokeWidth={1.5} />;
        }
    };

    return (
        <section ref={containerRef} className="relative w-full bg-brand-bg py-20 border-b border-brand-border/30 overflow-hidden">
            {/* Subtle grid background */}
            <div
                className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, var(--th-border) 1px, transparent 1px), linear-gradient(to bottom, var(--th-border) 1px, transparent 1px)',
                    backgroundSize: '5rem 5rem'
                }}
            />

            <div className="relative w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4">
                {/* Animated connector line (desktop only) */}
                <div className="hidden md:block absolute top-[5.5rem] left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-brand-border overflow-hidden">
                    <div
                        ref={lineRef}
                        className="absolute inset-0 bg-gradient-to-r from-brand-accent via-brand-accent2 to-brand-accent origin-left"
                        style={{ transform: 'scaleX(0)' }}
                    />
                </div>

                <ScrollReveal staggerChildren direction="up" staggerAmount={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {pillars.map((pillar, i) => (
                            <div
                                key={i}
                                className="relative card-glass p-8 group transition-all duration-500"
                            >
                                {/* Node dot on connector line (desktop) */}
                                <div className="hidden md:block absolute -top-[0.3rem] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-brand-accent bg-brand-bg group-hover:bg-brand-accent transition-colors duration-500" />

                                <div className="mb-6 transform group-hover:-translate-y-1 transition-transform duration-500">
                                    {getIcon(pillar.icon)}
                                </div>
                                <h3 className="font-sans text-xl uppercase tracking-widest text-brand-text mb-3 group-hover:text-brand-accent transition-colors duration-500">
                                    {pillar.title}
                                </h3>
                                <p className="text-brand-muted text-sm font-mono leading-relaxed">
                                    {pillar.desc}
                                </p>

                                {/* Bottom accent bar */}
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-accent group-hover:w-full transition-all duration-700" />
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

