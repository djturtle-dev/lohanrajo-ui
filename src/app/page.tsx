import Link from 'next/link';
import { ArrowRight, ShieldCheck, Factory, Lightbulb, Server, Box, Sun, Zap } from 'lucide-react';
import Image from 'next/image';
import HeroVideoBackground from '@/components/HeroVideoBackground';
import HeroTextAnimation from '@/components/HeroTextAnimation';
import Testimonials from '@/components/Testimonials';
import { prisma } from '@/lib/prisma';

import { unstable_cache } from 'next/cache';
import * as Icons from 'lucide-react';

export const revalidate = 3600; // revalidate every hour

export default async function Home() {
    const getHomeContent = unstable_cache(
        async () => {
            return await prisma.homeContent.findFirst() || {
                heroLines: [
                    "Precision in *Metal Arts*",
                    "*BMS* Panels",
                    "*IP Standard* Enclosures",
                    "Reflectors, *Poles*",
                    "*Oil,* CPG Panels"
                ],
                pillars: [
                    { icon: 'Factory', title: 'Infrastructure', desc: 'State-of-the-art manufacturing facilities ensuring uncompromised precision and scale.' },
                    { icon: 'ShieldCheck', title: 'ISO Certified', desc: 'ISO 9001:2015 certified quality management systems meeting rigorous international standards.' },
                    { icon: 'Lightbulb', title: 'Founded 1992', desc: 'Over three decades of pioneering innovative metal solutions for the evolving industrial landscape.' }
                ]
            };
        },
        ['home-content'],
        { revalidate: 3600, tags: ['home-content'] }
    );
    const homeContent = await getHomeContent();
    const pillars = (homeContent.pillars || []) as any[];

    const getIcon = (iconName: string) => {
        const Icon = (Icons as any)[iconName] || Icons.Factory;
        return <Icon size={40} strokeWidth={1} />;
    };

    return (
        <div className="flex flex-col gap-24">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center border-b border-brand-border mt-[-6rem] pt-24 overflow-hidden bg-white">
                {/* Looping Background Videos */}
                <div className="absolute inset-0 z-0 flex pointer-events-none">
                    <HeroVideoBackground />
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-white/85" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                    <HeroTextAnimation lines={homeContent.heroLines} />
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                        <Link href="/products" className="group relative px-10 py-5 bg-brand-text text-white font-oswald font-bold tracking-widest uppercase overflow-hidden flex items-center hover:bg-brand-accent transition-all duration-500 shadow-lg hover:shadow-brand-accent/20 hover:-translate-y-1">
                            <span className="relative z-10 flex items-center">
                                Explore Products <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>
                        <Link href="/contact" className="group px-10 py-5 border-2 border-brand-border text-brand-text font-oswald font-bold tracking-widest uppercase hover:border-brand-accent hover:text-brand-accent transition-all duration-500 hover:-translate-y-1 bg-white/50 backdrop-blur-sm">
                            Get an Estimate
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-0 max-w-5xl mx-auto w-full">
                {pillars.map((pillar, i) => (
                    <div key={i} className="p-8 border border-brand-border bg-white group hover:border-brand-accent transition-colors shadow-sm">
                        <div className="text-brand-accent mb-6 transform group-hover:-translate-y-2 transition-transform">
                            {getIcon(pillar.icon)}
                        </div>
                        <h3 className="font-oswald text-2xl uppercase tracking-widest text-brand-text mb-4">{pillar.title}</h3>
                        <p className="text-brand-muted leading-relaxed">{pillar.desc}</p>
                    </div>
                ))}
            </section>

            {/* Featured Categories */}
            <section className="px-4 sm:px-0 max-w-5xl mx-auto w-full">
                <div className="flex justify-between items-end mb-12 border-b border-brand-border pb-6">
                    <h2 className="font-oswald text-4xl md:text-5xl uppercase tracking-widest text-brand-text">Our Products</h2>
                    <Link href="/products" className="hidden md:flex items-center text-sm font-oswald tracking-widest uppercase text-brand-accent hover:text-red-700 transition-colors">
                        View All <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                <CategoryLinks />
            </section>

            {/* Testimonials Section */}
            <TestimonialsSection />
        </div>
    );
}

async function TestimonialsSection() {
    const getTestimonials = unstable_cache(
        async () => {
            return await prisma.testimonial.findMany({
                where: { featured: true },
                orderBy: { createdAt: 'desc' },
                take: 6
            });
        },
        ['featured-testimonials'],
        { revalidate: 3600, tags: ['testimonials'] }
    );
    const testimonials = await getTestimonials();

    return <Testimonials testimonials={testimonials} />;
}

async function CategoryLinks() {
    const getCategories = unstable_cache(
        async () => {
            return await prisma.category.findMany({
                where: { isDeleted: false }
            });
        },
        ['active-categories'],
        { revalidate: 3600, tags: ['categories'] }
    );
    const dbCategories = await getCategories();

    const categories = [
        { name: 'Panels', label: 'BMS Panels', icon: Server },
        { name: 'Enclosures', label: 'IP Enclosures', icon: Box },
        { name: 'Reflectors', label: 'Reflectors', icon: Sun },
        { name: 'Poles', label: 'Industrial Poles', icon: Zap },
    ].map(cat => ({
        ...cat,
        id: dbCategories.find((db: typeof dbCategories[number]) => db.name === cat.name)?.id
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                    <Link href={`/products${cat.id ? `?category=${cat.id}` : ''}`} key={i} className="group p-8 border border-brand-border bg-white flex flex-col justify-end relative overflow-hidden hover:border-brand-accent transition-colors shadow-sm min-h-[160px]">
                        <div className="absolute top-2 -right-4 text-brand-border transition-all duration-500 transform translate-x-4 scale-75 opacity-30 group-hover:-translate-x-6 group-hover:scale-110 group-hover:opacity-100 group-hover:text-brand-accent/20">
                            <Icon size={100} strokeWidth={1} />
                        </div>
                        <h3 className="relative z-10 font-oswald text-xl uppercase tracking-widest text-brand-text mb-2 group-hover:text-brand-accent transition-colors">{cat.label}</h3>
                        <div className="relative z-10 h-1 w-8 bg-brand-border group-hover:w-full group-hover:bg-brand-accent transition-all duration-500" />
                    </Link>
                );
            })}
        </div>
    );
}
