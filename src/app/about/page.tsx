import { ShieldCheck, Factory, Lightbulb, UserCheck, CalendarDays } from 'lucide-react';
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
                include: { infrastructureCards: true } // Fetch the new relation
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
        founderNames: 'MR.L.L.BASKAR & MR.L.L.SEKAR',
    };

    const data = { ...defaults, ...content };
    
    // Map existing string items to cards if DB cards are empty (migration fallback)
    const displayCards = data.infrastructureCards?.length > 0 
        ? data.infrastructureCards 
        : data.infrastructureItems.map((item: string, i: number) => ({
            id: `fallback-${i}`,
            title: item,
            description: "State-of-the-art infrastructure enabling high-precision engineering and manufacturing at scale.",
            icon: "Factory"
        }));

    return (
        <div className="flex flex-col gap-12 pt-32 md:pt-40">
            {/* Header */}
            <ScrollReveal direction="up" className="max-w-4xl mx-auto text-center px-4 mb-12">
                <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter text-brand-text mb-6 text-balance">
                    {data.title.split(' ').map((word: string, i: number) =>
                        word.toLowerCase() === 'excellence' ? (
                            <span key={i} className="text-brand-accent">{word} </span>
                        ) : word + ' '
                    )}
                </h1>
                <p className="text-xl text-brand-muted font-light leading-relaxed">
                    {data.subtitle}
                </p>
            </ScrollReveal>

            {/* Profile Section */}
            <section id="profile" className="bg-brand-panel border-y border-brand-border py-12 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto px-4 sm:px-8 items-center">
                    {/* Image on the Left */}
                    <ScrollReveal direction="left" className="aspect-square card-glass relative flex items-center justify-center p-8 bg-brand-white/10">
                        <Image
                            src={getAssetUrl(data.profileImage) || "/our company.png"}
                            alt="Lohan Rajo Metal Arts Profile"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8"
                        />
                    </ScrollReveal>

                    {/* Text on the Right */}
                    <ScrollReveal direction="right" className="space-y-6">
                        <div className="flex items-center space-x-4 mb-2">
                            <UserCheck className="w-8 h-8 text-brand-accent" />
                            <h2 className="font-sans text-3xl uppercase tracking-widest text-brand-text">Our Profile</h2>
                        </div>
                        <div className="space-y-4">
                            {data.profileContent.split('\n').map((para: string, i: number) => (
                                para.trim() && (
                                    <p key={i} className="text-brand-muted leading-relaxed">
                                        {para}
                                    </p>
                                )
                            ))}
                        </div>
                        <div className="space-y-4 pt-4 border-t border-brand-border">
                            <div className="flex items-center space-x-4">
                                <CalendarDays className="w-5 h-5 text-brand-accent" />
                                <span className="text-sm font-oswald tracking-widest uppercase text-brand-text">
                                    {data.establishedText || "Since 1992"}
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Accreditation & Vision */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-8">
                <ScrollReveal direction="up" delay={0.1} className="p-10 card-glass group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                    <ShieldCheck className="w-10 h-10 text-brand-accent mb-6" />
                    <h2 className="font-sans text-3xl uppercase tracking-widest text-brand-text mb-4" id="mission">Mission</h2>
                    <div className="text-brand-muted leading-relaxed space-y-2">
                        {data.accreditationContent.split('\n').map((line: string, i: number) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.2} className="p-10 card-glass">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
                    <Lightbulb className="w-10 h-10 text-brand-accent mb-6" />
                    <h2 className="font-sans text-3xl uppercase tracking-widest text-brand-text mb-4" id="vision">Vision</h2>
                    <p className="text-brand-muted leading-relaxed">
                        {data.visionContent}
                    </p>
                </ScrollReveal>
            </section>

            {/* Infrastructure Section (New Layout) */}
            <section id="infrastructure" className="bg-brand-panel border-y border-brand-border py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="font-sans text-4xl uppercase tracking-widest text-brand-text">Infrastructure</h2>
                    </ScrollReveal>
                    
                    {/* New Card Layout matching Mission/Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {displayCards.map((card: any, i: number) => {
                            const availableIcons: Record<string, any> = { ShieldCheck, Factory, Lightbulb, UserCheck, CalendarDays };
                            const IconComponent = availableIcons[card.icon] || Factory;
                            
                            return (
                                <ScrollReveal key={card.id} direction="up" delay={0.1 * i} className="p-10 card-glass group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                                    
                                    <IconComponent className="w-10 h-10 text-brand-accent mb-6 relative z-10" />
                                    
                                    <h3 className="font-sans text-2xl uppercase tracking-widest text-brand-text mb-4 relative z-10">{card.title}</h3>
                                    <p className="text-brand-muted leading-relaxed relative z-10">
                                        {card.description}
                                    </p>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
