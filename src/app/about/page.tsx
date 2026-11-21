import { 
    ShieldCheck, 
    Factory, 
    Lightbulb, 
    UserCheck, 
    CalendarDays,
    MapPin,
    Award,
    CheckCircle2,
    Compass,
    Building2,
    Layers,
    Cpu,
    Sparkles
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getAssetUrl } from '@/lib/utils';
import ScrollReveal from '@/components/animations/ScrollReveal';

export const metadata: Metadata = {
    title: 'About | LIAT - LOHANRAJO INDUSTRIES AND TECHNOLOGIES',
    description: 'Learn about our profile, infrastructure, mission, and vision.',
};

export default async function AboutPage() {
    const p = prisma as any;
    let content = null;

    if (p.aboutContent) {
        try {
            content = await p.aboutContent.findUnique({
                where: { id: 'singleton' },
                include: { infrastructureCards: true }
            });
        } catch (e) {
            console.warn("Database schema mismatch or fetch error. Falling back to defaults.", e);
        }
    } else {
        console.warn("Prisma model 'aboutContent' not found in client. Please run 'npx prisma generate'.");
    }

    // Fallback values if DB is empty or lacks new fields
    const defaults = {
        title: 'LOHANRAJO INDUSTRIES AND TECHNOLOGIES',
        subtitle: 'Precision engineering and manufacturing excellence.',
        profileContent: 'LOHANRAJO INDUSTRIES AND TECHNOLOGIES PRIVATE LIMITED (LIAT) is an ISO 9001:2015 certified engineering and manufacturing company specializing in the design, manufacturing IP rated enclosures, assembly & wiring of control panels, and customized engineering solutions conforming to IP standards.\n\nThe company traces its origins to Lohanrajo Metal Arts, Estd in 1992 by visionary entrepreneurs Mr.L.L.Baskar & Mr.L.L.Sekar. Backed by more than three decades of manufacturing excellence and extensive industry expertise, the organization has built a strong reputation for quality, reliability, innovation and on-time delivery.',
        profileImage: '/our company.png',
        establishedText: 'Estd in 1992',
        infrastructureContent: 'Operating from a modern manufacturing facility spread across 7,200 sq.ft at Perungudi, Chennai, TamilNadu, India, the company has consistently expanded its capabilities to meet the evolving needs of its customers.',
        infrastructureItems: ['CNC Fabrication', 'Automated Assembly', 'Polymer & Powder Coating'],
        infrastructureCards: [],
        accreditationContent: 'Deliver quality products on time\nProvide value engineering solutions\nContinuously improve technology and manufacturing capability\nBuild long-term customer relationships\nEnsure customer satisfaction through quality, reliability, and service',
        visionContent: 'To become one of India\'s most trusted engineering manufacturing companies by delivering innovative, high-quality products with world-class customer service.',
        founderNames: 'Mr.L.L.Baskar & Mr.L.L.Sekar',
    };

    const data = { ...defaults, ...content };
    
    // Map existing string items to cards if DB cards are empty (migration fallback)
    const displayCards = data.infrastructureCards?.length > 0 
        ? data.infrastructureCards 
        : data.infrastructureItems.map((item: string, i: number) => ({
            id: `fallback-${i}`,
            title: item,
            description: "State-of-the-art infrastructure enabling high-precision engineering and manufacturing at scale.",
            icon: i === 0 ? "Factory" : i === 1 ? "Cpu" : "Layers"
        }));

    const iconMap: Record<string, any> = {
        ShieldCheck,
        Factory,
        Lightbulb,
        UserCheck,
        CalendarDays,
        MapPin,
        Award,
        Compass,
        Building2,
        Layers,
        Cpu,
        Sparkles
    };

    const missionPoints = data.accreditationContent
        ? data.accreditationContent.split('\n').filter((l: string) => l.trim().length > 0)
        : [];

    const profileParagraphs = data.profileContent
        ? data.profileContent.split('\n').filter((p: string) => p.trim().length > 0)
        : [];

    return (
        <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 sm:px-8 pt-24 md:pt-32 pb-24 space-y-20 md:space-y-28">
            
            {/* HERO / MASTHEAD */}
            <header className="relative max-w-5xl mx-auto text-center px-4 pt-4 pb-8 flex flex-col items-center">
                {/* Radial ambient glow backdrop */}
                <div 
                    aria-hidden="true" 
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" 
                />

                {/* Provenance Badge */}
                <ScrollReveal direction="down" delay={0.05} className="mb-8">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-panel/80 border border-brand-border/60 shadow-xs backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-xs font-sans tracking-widest uppercase text-brand-muted">
                            {data.establishedText || "Estd in 1992"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-brand-border" />
                        <span className="text-xs font-sans text-brand-accent font-semibold tracking-wide">
                            ISO 9001:2015
                        </span>
                    </div>
                </ScrollReveal>

                {/* Footer Logo Image as Primary Brand Title */}
                <ScrollReveal direction="up" delay={0.15} className="mb-6 flex justify-center w-full">
                    <div className="relative group p-2">
                        <Image
                            src="/Footer-logo.png"
                            alt={data.title || "LOHANRAJO INDUSTRIES AND TECHNOLOGIES"}
                            width={640}
                            height={190}
                            className="w-[280px] sm:w-[420px] md:w-[540px] lg:w-[600px] h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                            priority
                        />
                    </div>
                </ScrollReveal>
                <h1 className="sr-only">{data.title || "LOHANRAJO INDUSTRIES AND TECHNOLOGIES"}</h1>

                {/* Subtitle */}
                <ScrollReveal direction="up" delay={0.25} className="max-w-3xl">
                    <p className="font-playfair italic text-2xl sm:text-3xl md:text-4xl text-brand-text font-normal leading-relaxed text-balance">
                        {data.subtitle}
                    </p>
                </ScrollReveal>

                {/* Subtle Divider with Crosshair */}
                <div className="mt-10 flex items-center justify-center gap-3 w-full max-w-xs">
                    <div className="h-px bg-brand-border/60 flex-1" />
                    <span className="text-brand-accent text-xs">◆</span>
                    <div className="h-px bg-brand-border/60 flex-1" />
                </div>
            </header>

            {/* SECTION 01: OUR PROFILE (EDITORIAL ASYMMETRIC SPLIT) */}
            <section id="profile" aria-labelledby="profile-heading" className="relative">
                <ScrollReveal direction="up" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    
                    {/* Visual Anchor (Left Column, 5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div className="relative card-glass p-6 md:p-8 flex flex-col items-center justify-center h-full min-h-[380px] group overflow-hidden border border-brand-border/60">
                            {/* Corner Technical Decors */}
                            <span className="absolute top-3 left-3 text-[10px] font-mono text-brand-muted/50 tracking-wider">01 // LIAT</span>
                            <span className="absolute top-3 right-3 text-[10px] font-mono text-brand-accent/70 font-semibold tracking-wider">
                                {data.establishedText || "Estd in 1992"}
                            </span>
                            <span className="absolute bottom-3 left-3 w-2 h-2 border-l border-b border-brand-accent" />
                            <span className="absolute bottom-3 right-3 w-2 h-2 border-r border-b border-brand-accent" />

                            {/* Image Container with Ambient Backlight */}
                            <div className="relative w-full aspect-[4/3] max-w-md my-auto flex items-center justify-center">
                                <div className="absolute inset-0 bg-brand-accent/5 rounded-2xl blur-xl group-hover:bg-brand-accent/15 transition-all duration-700" />
                                <Image
                                    src={getAssetUrl(data.profileImage) || "/our company.png"}
                                    alt="LOHANRAJO Industries and Technologies Profile"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    className="object-contain p-4 z-10 transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Founder Recognition Pill */}
                            {data.founderNames && (
                                <div className="w-full mt-4 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-sans text-brand-muted">
                                    <span className="inline-flex items-center gap-1.5 font-medium text-brand-text truncate">
                                        <Award className="w-4 h-4 text-brand-accent shrink-0" />
                                        <span className="truncate">{data.founderNames}</span>
                                    </span>
                                    <span className="font-mono text-[11px] text-brand-accent shrink-0 pl-2">
                                        {data.establishedText || "1992"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Narrative Text (Right Column, 7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-6 card-glass p-6 sm:p-10 border border-brand-border/60">
                        <div className="flex items-center gap-3 pb-2 border-b border-brand-border/40">
                            <div className="w-8 h-8 rounded-full btn-glass-primary flex items-center justify-center text-white shrink-0">
                                <UserCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-mono uppercase tracking-widest text-brand-accent block">
                                    01 • Profile
                                </span>
                                <h2 id="profile-heading" className="font-playfair italic text-3xl sm:text-4xl text-brand-text">
                                    Our Profile
                                </h2>
                            </div>
                        </div>

                        {/* Paragraphs with Editorial Typography */}
                        <div className="space-y-4 font-sans text-brand-muted leading-relaxed">
                            {profileParagraphs.map((para: string, idx: number) => (
                                <p 
                                    key={idx} 
                                    className={idx === 0 
                                        ? "text-base sm:text-lg text-brand-text font-normal leading-relaxed border-l-2 border-brand-accent pl-4 py-1"
                                        : "text-sm sm:text-base text-brand-muted leading-relaxed"
                                    }
                                >
                                    {para}
                                </p>
                            ))}
                        </div>

                        {/* Heritage Datum Bar */}
                        <div className="pt-4 border-t border-brand-border/40 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-brand-accent" />
                                <span className="text-xs font-sans uppercase tracking-wider text-brand-text font-semibold">
                                    {data.establishedText || "Estd in 1992"}
                                </span>
                            </div>
                            {data.founderNames && (
                                <div className="text-xs font-sans text-brand-muted">
                                    {data.founderNames}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* SECTION 02: GUIDING PRINCIPLES (MISSION & VISION ASYMMETRIC GRID) */}
            <section aria-labelledby="principles-heading" className="space-y-8">
                <ScrollReveal direction="up" className="flex items-center justify-between gap-4 pb-2 border-b border-brand-border/40">
                    <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-brand-accent block">
                            02 • Purpose & Horizon
                        </span>
                        <h2 id="principles-heading" className="font-playfair italic text-3xl sm:text-4xl text-brand-text">
                            Mission <span className="font-sans font-normal text-brand-muted">&</span> Vision
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Mission Charter (7 cols) */}
                    <ScrollReveal direction="up" delay={0.1} className="lg:col-span-7 flex flex-col justify-between card-glass p-8 sm:p-10 relative overflow-hidden border border-brand-border/60 group">
                        {/* Ambient Corner Flare */}
                        <div 
                            aria-hidden="true" 
                            className="absolute -top-16 -right-16 w-48 h-48 bg-brand-accent/10 rounded-full blur-2xl group-hover:bg-brand-accent/20 transition-all duration-700 pointer-events-none" 
                        />
                        
                        <div>
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 rounded-full btn-glass-secondary flex items-center justify-center text-brand-accent shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest block">Quality & Values</span>
                                    <h3 id="mission" className="font-playfair italic text-2xl sm:text-3xl text-brand-text">
                                        Mission
                                    </h3>
                                </div>
                            </div>

                            {/* Numbered Strategic Commitments */}
                            <div className="space-y-3.5 mt-6">
                                {missionPoints.map((line: string, i: number) => (
                                    <div 
                                        key={i} 
                                        className="group/item flex items-start gap-3.5 p-3 rounded-xl bg-brand-panel/40 border border-brand-border/30 hover:border-brand-accent/50 transition-all duration-300"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5 group-hover/item:bg-brand-accent group-hover/item:text-white transition-colors duration-300">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <p className="text-sm font-sans text-brand-text leading-snug pt-0.5">
                                            {line}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Quality Anchor */}
                        <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs text-brand-muted font-sans">
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent" />
                                ISO 9001:2015 Standards
                            </span>
                            <span className="font-mono text-[11px] text-brand-accent">01 // MISSION</span>
                        </div>
                    </ScrollReveal>

                    {/* Vision Manifesto (5 cols) */}
                    <ScrollReveal direction="up" delay={0.2} className="lg:col-span-5 flex flex-col justify-between card-glass p-8 sm:p-10 relative overflow-hidden border border-brand-border/60 group">
                        {/* Ambient Glow */}
                        <div 
                            aria-hidden="true" 
                            className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-accent/10 rounded-full blur-2xl group-hover:bg-brand-accent/20 transition-all duration-700 pointer-events-none" 
                        />

                        <div>
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 rounded-full btn-glass-secondary flex items-center justify-center text-brand-accent shrink-0">
                                    <Compass className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest block">Future Horizon</span>
                                    <h3 id="vision" className="font-playfair italic text-2xl sm:text-3xl text-brand-text">
                                        Vision
                                    </h3>
                                </div>
                            </div>

                            {/* Editorial Vision Quote */}
                            <div className="relative mt-8 p-6 rounded-2xl bg-brand-panel/50 border border-brand-border/40">
                                <span className="absolute -top-4 left-6 text-4xl font-playfair text-brand-accent select-none opacity-40">“</span>
                                <p className="font-playfair italic text-xl sm:text-2xl text-brand-text leading-relaxed tracking-wide pt-2">
                                    {data.visionContent}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Vision Datum */}
                        <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs text-brand-muted font-sans">
                            <span className="inline-flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-brand-accent" />
                                World-Class Service
                            </span>
                            <span className="font-mono text-[11px] text-brand-accent">02 // VISION</span>
                        </div>
                    </ScrollReveal>

                </div>
            </section>

            {/* SECTION 03: INFRASTRUCTURE & CAPABILITIES */}
            <section id="infrastructure" aria-labelledby="infrastructure-heading" className="space-y-8">
                <ScrollReveal direction="up" className="flex items-center justify-between gap-4 pb-2 border-b border-brand-border/40">
                    <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-brand-accent block">
                            03 • Manufacturing Facility
                        </span>
                        <h2 id="infrastructure-heading" className="font-playfair italic text-3xl sm:text-4xl text-brand-text">
                            Infrastructure
                        </h2>
                    </div>
                </ScrollReveal>

                {/* Facility Anchor Banner (Incorporating infrastructureContent) */}
                {data.infrastructureContent && (
                    <ScrollReveal direction="up" delay={0.05} className="card-glass p-6 sm:p-8 border border-brand-border/60 relative overflow-hidden group">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-8 space-y-2">
                                <div className="inline-flex items-center gap-2 text-xs font-sans text-brand-accent uppercase tracking-wider font-semibold">
                                    <MapPin className="w-4 h-4 shrink-0" />
                                    <span>Perungudi, Chennai, TamilNadu, India</span>
                                </div>
                                <p className="text-sm sm:text-base font-sans text-brand-text leading-relaxed">
                                    {data.infrastructureContent}
                                </p>
                            </div>

                            <div className="md:col-span-4 flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-brand-border/40 pt-4 md:pt-0 md:pl-6">
                                <div className="text-left md:text-right">
                                    <span className="text-[11px] font-mono uppercase tracking-widest text-brand-muted block">Area Scale</span>
                                    <span className="font-playfair italic text-2xl sm:text-3xl text-brand-text font-bold">7,200</span>
                                    <span className="text-xs font-sans text-brand-muted ml-1">sq.ft</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full btn-glass-secondary text-xs text-brand-text">
                                    <Factory className="w-3.5 h-3.5 text-brand-accent" />
                                    <span>Modern Facility</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* Capability Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayCards.map((card: any, i: number) => {
                        const IconComponent = iconMap[card.icon] || Factory;
                        const cardDescriptions = card.description
                            ? card.description.split('\n').filter((d: string) => d.trim().length > 0)
                            : [];

                        return (
                            <ScrollReveal 
                                key={card.id || i} 
                                direction="up" 
                                delay={0.1 * (i + 1)} 
                                className="card-glass p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border border-brand-border/60 group hover:border-brand-accent/50 transition-all duration-500"
                            >
                                {/* Ambient Corner Blur */}
                                <div 
                                    aria-hidden="true" 
                                    className="absolute top-0 right-0 w-36 h-36 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/15 transition-all duration-700 pointer-events-none" 
                                />

                                <div>
                                    {/* Top Icon and Index Marker */}
                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl btn-glass-secondary flex items-center justify-center text-brand-accent transition-transform duration-500 group-hover:scale-110">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="font-mono text-xs text-brand-muted/60 tracking-widest">
                                            0{i + 1} // CAPABILITY
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-playfair italic text-2xl sm:text-3xl text-brand-text mb-4 relative z-10">
                                        {card.title}
                                    </h3>

                                    {/* Description Lines */}
                                    <div className="space-y-2 relative z-10 font-sans text-brand-muted leading-relaxed text-sm sm:text-base">
                                        {cardDescriptions.length > 0 ? (
                                            cardDescriptions.map((descLine: string, dIdx: number) => (
                                                <p key={dIdx} className="flex items-start gap-2">
                                                    <span className="text-brand-accent text-xs mt-1.5">▪</span>
                                                    <span>{descLine}</span>
                                                </p>
                                            ))
                                        ) : (
                                            <p>{card.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-sans text-brand-muted relative z-10">
                                    <span className="text-[11px] font-mono tracking-wider uppercase text-brand-muted">Precision Engineering</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-accent group-hover:scale-150 transition-transform duration-300" />
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </section>

        </div>
    );
}
