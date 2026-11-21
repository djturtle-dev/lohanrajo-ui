'use client';

import { useRef, useEffect } from 'react';
import { Factory, ShieldCheck, Lightbulb, Award, Cpu, Sparkles, Layers } from 'lucide-react';
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

interface PillarMeta {
    code: string;
    status: string;
    num: string;
    tags: string[];
}

const DEFAULT_METAS: Record<string, PillarMeta> = {
    'infrastructure': {
        code: 'SYS.01 // CAPACITY',
        status: 'FACILITY: ACTIVE',
        num: '01',
        tags: ['Automated CNC', 'BMS Enclosures', 'High-Tonnage Scale']
    },
    'iso certified': {
        code: 'STD.02 // COMPLIANCE',
        status: 'ISO 9001:2015',
        num: '02',
        tags: ['Zero-Tolerance QC', 'IP Standards', 'Mil-Spec Tested']
    },
    'founded 1992': {
        code: 'EST.03 // HERITAGE',
        status: '32+ YRS PROVEN',
        num: '03',
        tags: ['Pioneered 1992', 'Metal Arts Masters', 'Pan-India Reach']
    }
};

export default function SpatialNodeMap({ pillars }: { pillars: Pillar[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const laserTrackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !laserTrackRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(laserTrackRef.current,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        end: 'bottom 75%',
                        scrub: 0.8,
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const getIcon = (iconName: string) => {
        const cls = 'w-6 h-6 sm:w-7 sm:h-7 text-brand-accent transition-transform duration-500 group-hover:scale-110';
        switch (iconName?.toLowerCase()) {
            case 'factory':
                return <Factory className={cls} strokeWidth={1.5} />;
            case 'shieldcheck':
            case 'shield-check':
                return <ShieldCheck className={cls} strokeWidth={1.5} />;
            case 'lightbulb':
                return <Lightbulb className={cls} strokeWidth={1.5} />;
            case 'award':
                return <Award className={cls} strokeWidth={1.5} />;
            case 'cpu':
                return <Cpu className={cls} strokeWidth={1.5} />;
            case 'layers':
                return <Layers className={cls} strokeWidth={1.5} />;
            default:
                return <Factory className={cls} strokeWidth={1.5} />;
        }
    };

    const getMeta = (title: string, index: number): PillarMeta => {
        const normalized = title.trim().toLowerCase();
        if (DEFAULT_METAS[normalized]) {
            return DEFAULT_METAS[normalized];
        }
        return {
            code: `SPEC.0${index + 1} // CAPABILITY`,
            status: 'VERIFIED // ACTIVE',
            num: `0${index + 1}`,
            tags: ['Precision Engineered', 'Industrial Grade', 'Certified Scale']
        };
    };

    return (
        <section ref={containerRef} className="relative w-full py-0 overflow-hidden bg-transparent">
            <div className="relative w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 md:px-8">
                <ScrollReveal direction="up" duration={0.8}>
                    {/* Monolithic Telemetry Console Deck */}
                    <div className="relative rounded-2xl border border-brand-border/50 dark:border-white/10 bg-white dark:bg-[#0c0c0c]/90 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                        {/* Interactive Top Laser Runner */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-border/20 dark:bg-white/5 overflow-hidden z-20">
                            <div
                                ref={laserTrackRef}
                                className="h-full w-full bg-gradient-to-r from-brand-accent via-brand-accent2 to-brand-accent origin-left"
                                style={{ transform: 'scaleX(0)' }}
                            />
                        </div>

                        {/* Telemetry Status Bar */}
                        <div className="flex items-center justify-between px-5 sm:px-7 py-3 border-b border-brand-border/30 dark:border-white/10 bg-brand-panel/60 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
                                </span>
                                <span className="font-mono text-[11px] font-semibold tracking-widest text-brand-text uppercase">
                                    LIAT // CAPABILITY MATRIX
                                </span>
                            </div>

                            <div className="hidden lg:flex items-center gap-5 text-[10px] font-mono tracking-widest text-brand-muted/70 uppercase">
                                <span>TOLERANCE: ±0.05 MM</span>
                                <span className="inline-block w-1 h-1 rounded-full bg-brand-border/60" />
                                <span>CAD // CNC AUTOMATION</span>
                                <span className="inline-block w-1 h-1 rounded-full bg-brand-border/60" />
                                <span>STANDARDS: IP65 / IP67</span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-brand-muted">
                                <span className="px-2 py-0.5 rounded bg-brand-border/20 dark:bg-white/5 border border-brand-border/30 dark:border-white/10">
                                    NODES: 03 ONLINE
                                </span>
                            </div>
                        </div>

                        {/* 3 Interlocking Telemetry Bays */}
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-border/30 dark:divide-white/10">
                            {pillars.map((pillar, i) => {
                                const meta = getMeta(pillar.title, i);
                                return (
                                    <div
                                        key={i}
                                        className="group relative p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                                    >
                                        {/* Precision corner crosshair tick */}
                                        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-brand-border/40 group-hover:border-brand-accent transition-colors duration-300 pointer-events-none" />

                                        {/* Watermark Numeral in Playfair Italic */}
                                        <span className="absolute right-4 bottom-2 font-playfair italic font-bold text-7xl sm:text-8xl text-brand-text/[0.04] dark:text-white/[0.04] select-none pointer-events-none transition-all duration-700 group-hover:scale-105 group-hover:text-brand-accent/[0.08]">
                                            {meta.num}
                                        </span>

                                        {/* Top Bay Indicator */}
                                        <div className="flex items-center justify-between mb-6 z-10">
                                            <span className="font-mono text-[11px] tracking-wider text-brand-accent font-semibold flex items-center gap-1.5">
                                                <span className="inline-block w-1.5 h-1.5 bg-brand-accent rounded-sm" />
                                                {meta.code}
                                            </span>
                                            <span className="font-mono text-[10px] tracking-widest text-brand-muted/70 uppercase px-2 py-0.5 rounded bg-brand-border/15 dark:bg-white/5 border border-brand-border/20 dark:border-white/10">
                                                {meta.status}
                                            </span>
                                        </div>

                                        {/* Main Content: Icon Capsule, Title, Description */}
                                        <div className="z-10 mb-6">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-brand-panel/50 dark:bg-brand-panel border border-brand-border/60 dark:border-white/10 shadow-sm group-hover:border-brand-accent group-hover:shadow-[0_0_24px_rgba(184,36,29,0.25)] group-hover:-translate-y-1 transition-all duration-500 mb-5">
                                                {getIcon(pillar.icon)}
                                            </div>
                                            <h3 className="font-playfair italic text-2xl sm:text-3xl text-brand-text font-medium tracking-tight mb-3 group-hover:text-brand-accent transition-colors duration-300">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-brand-muted text-sm leading-relaxed font-sans">
                                                {pillar.desc}
                                            </p>
                                        </div>

                                        {/* Bottom Telemetry Spec Tags */}
                                        <div className="z-10 pt-4 border-t border-brand-border/20 dark:border-white/5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {meta.tags.map((tag, tagIdx) => (
                                                    <span
                                                        key={tagIdx}
                                                        className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider text-brand-muted/80 bg-black/[0.03] dark:bg-white/[0.04] border border-brand-border/30 dark:border-white/10 group-hover:border-brand-accent/30 transition-colors duration-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Interactive Hover Laser Beam */}
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-brand-accent via-brand-accent2 to-brand-accent group-hover:w-full transition-all duration-700 ease-out z-20" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
