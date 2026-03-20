import { ShieldCheck, Factory, Lightbulb, UserCheck, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getAssetUrl } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'About | LOHANRAJO Metal Arts',
    description: 'Learn about our profile, infrastructure, accreditation, and vision.',
};

export default async function AboutPage() {
    const p = prisma as any;
    let content = null;

    if (p.aboutContent) {
        try {
            content = await p.aboutContent.findUnique({
                where: { id: 'singleton' }
            });
        } catch (e) {
            console.warn("Database schema mismatch or fetch error. Falling back to defaults.", e);
        }
    } else {
        console.warn("Prisma model 'aboutContent' not found in client. Please run 'npx prisma generate'.");
    }

    // Fallback values if DB is empty or lacks new fields
    const defaults = {
        title: 'The Foundation of Excellence',
        subtitle: 'From humble beginnings to an industry leader in IP Standard Enclosures, BMS Panels, and Industrial Metal Arts.',
        profileContent: 'LOHANRAJO Metal Arts was established with a clear mandate: to provide uncompromising quality in electrical enclosures and industrial metal products. Over the years, we have grown from a local supplier to a trusted partner for major infrastructure projects nationwide.\n\nOur commitment to precision engineering, utilizing premium raw materials like Mild Steel and Stainless Steel, ensures that every product leaving our facility meets strict operational standards.',
        profileImage: '/our company.png',
        establishedText: 'Since 1992',
        infrastructureContent: 'Our expansive manufacturing facility is equipped with state-of-the-art CNC machinery, automated welding stations, and an advanced powder-coating line. This robust infrastructure allows us to maintain strict tolerances and scale production seamlessly.',
        infrastructureItems: ['CNC Fabrication', 'Automated Assembly', 'Polymer & Powder Coating'],
        accreditationContent: 'We operate under stringent ISO-certified quality management systems. Every enclosure and panel is tested for IP rating compliance, ensuring absolute protection against dust, water, and mechanical impact.',
        visionContent: 'To be the defining standard in industrial metal arts—pioneering solutions that integrate seamlessly with the automation and building management needs of tomorrow. We envision a future built on our resilient infrastructure.',
        founderNames: 'MR.L.L.BASKAR & L.L.SEKAR',
    };

    const data = { ...defaults, ...content };

    return (
        <div className="flex flex-col gap-12">
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 mb-12">
                <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tighter text-brand-text mb-6 text-balance">
                    {data.title.split(' ').map((word: string, i: number) =>
                        word.toLowerCase() === 'excellence' ? (
                            <span key={i} className="text-brand-accent">{word} </span>
                        ) : word + ' '
                    )}
                </h1>
                <p className="text-xl text-brand-muted font-light leading-relaxed">
                    {data.subtitle}
                </p>
            </section>

            {/* Profile Section */}
            <section id="profile" className="bg-brand-panel border-y border-brand-border py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto px-4 sm:px-8 items-center">
                    {/* Image on the Left */}
                    <div className="aspect-square border border-brand-border relative overflow-hidden flex items-center justify-center p-8 bg-brand-white">
                        <Image
                            src={getAssetUrl(data.profileImage) || "/our company.png"}
                            alt="Lohan Rajo Metal Arts Profile"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8"
                        />
                    </div>

                    {/* Text on the Right */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 mb-2">
                            <UserCheck className="w-8 h-8 text-brand-accent" />
                            <h2 className="font-oswald text-3xl uppercase tracking-widest text-brand-text">Our Profile</h2>
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
                            <div className="flex items-center space-x-4">
                                <UserCheck className="w-5 h-5 text-brand-accent" />
                                <span className="text-sm font-oswald tracking-widest uppercase text-brand-text">
                                    {data.founderNames ? (data.founderNames.toUpperCase().startsWith('FOUNDERS:') ? data.founderNames : `Founders: ${data.founderNames}`) : "Founders: MR.L.L.BASKAR & L.L.SEKAR"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accreditation & Vision */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-8">
                <div id="accreditation" className="p-10 border border-brand-border bg-brand-panel relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                    <ShieldCheck className="w-10 h-10 text-brand-accent mb-6" />
                    <h2 className="font-oswald text-3xl uppercase tracking-widest text-brand-text mb-4">Accreditation</h2>
                    <p className="text-brand-muted leading-relaxed">
                        {data.accreditationContent}
                    </p>
                </div>

                <div id="vision" className="p-10 border border-brand-border bg-brand-panel relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
                    <Lightbulb className="w-10 h-10 text-brand-accent mb-6" />
                    <h2 className="font-oswald text-3xl uppercase tracking-widest text-brand-text mb-4">Vision</h2>
                    <p className="text-brand-muted leading-relaxed">
                        {data.visionContent}
                    </p>
                </div>
            </section>

            {/* Infrastructure Section */}
            <section id="infrastructure" className="bg-brand-panel border-y border-brand-border py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Factory className="w-12 h-12 text-brand-accent mx-auto mb-6" />
                        <h2 className="font-oswald text-4xl uppercase tracking-widest text-brand-text mb-6">Infrastructure</h2>
                        <p className="text-brand-muted leading-relaxed">
                            {data.infrastructureContent}
                        </p>
                    </div>
                    <div className={`grid grid-cols-1 ${data.infrastructureItems.length >= 3 ? 'sm:grid-cols-3' : data.infrastructureItems.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-6`}>
                        {data.infrastructureItems.map((item: string, i: number) => (
                            <div key={i} className="p-8 border border-brand-border bg-brand-white flex flex-col items-center text-center">
                                <span className="font-oswald text-4xl text-brand-accent/20 mb-4 inline-block font-black">0{i + 1}</span>
                                <h3 className="font-bold text-brand-text uppercase tracking-widest text-sm mb-2 font-oswald">{item}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
