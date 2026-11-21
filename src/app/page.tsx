import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import HeroTextAnimation from '@/components/HeroTextAnimation';
import { prisma } from '@/lib/prisma';
import ScrollReveal from '@/components/animations/ScrollReveal';
import dynamic from 'next/dynamic';

const Testimonials = dynamic(() => import('@/components/Testimonials'));
const SpatialNodeMap = dynamic(() => import('@/components/SpatialNodeMap'));

import CategoryCards from '@/components/CategoryCards';
import HeroBlobVideo from '@/components/HeroBlobVideo';

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
            {/* Full-Bleed Cinematic Hero + Metrics Shelf */}
            <div>
                <section className="relative w-full h-[100svh] min-h-[600px] max-h-[1100px] overflow-hidden">
                    {/* Full-bleed video background */}
                    <HeroBlobVideo />

                    {/* Cinematic gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/70 via-brand-bg/20 to-transparent z-10" />
                    {/* Vignette */}
                    <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, var(--th-bg) 100%)' }} />

                    {/* Bottom-left content */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 md:px-8 pb-20 md:pb-28">
                        <div className="max-w-2xl">
                            {/* Animated hero text */}
                            <HeroTextAnimation lines={homeContent.heroLines} />

                            {/* Red accent line */}
                            <div className="w-16 h-[2px] bg-brand-accent mt-3 mb-4" />

                            {/* Brief tagline */}
                            <p className="text-brand-muted text-sm md:text-base leading-relaxed max-w-md opacity-80">
                                Uncompromised quality meets state-of-the-art manufacturing. Redefining standards in physical infrastructure.
                            </p>

                            {/* CTA */}
                            <div className="mt-6">
                                <Link href="/products" className="group btn-glass-primary px-6 py-3 md:px-8 font-oswald tracking-widest uppercase inline-flex items-center text-xs md:text-sm">
                                    Explore <span className="hidden md:inline ml-1">Products</span> <ArrowRight className="ml-2 md:ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                                </Link>
                            </div>

                            {/* Metrics */}
                            <div className="flex gap-10 md:gap-14 mt-8 pt-6 border-t border-brand-border/30">
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-3xl font-bold font-sans text-brand-text">50+</span>
                                    <span className="text-[9px] md:text-xs text-brand-muted font-sans uppercase tracking-widest mt-0.5">Industries</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-3xl font-bold font-sans text-brand-text">100%</span>
                                    <span className="text-[9px] md:text-xs text-brand-muted font-sans uppercase tracking-widest mt-0.5">Satisfaction</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                        <div className="w-5 h-5 border-r-2 border-b-2 border-brand-accent/60 rotate-45" />
                    </div>
                </section>

            </div>

            {/* Spatial Node Map Section */}
            <SpatialNodeMap pillars={pillars} />

            {/* Featured Categories */}
            <section className="px-4 md:px-8 w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto">
                <ScrollReveal direction="left">
                    <div className="flex justify-between items-end mb-12 border-b border-brand-border pb-6">
                        <h2 className="font-oswald text-4xl md:text-5xl uppercase tracking-widest text-brand-text">Our Products</h2>
                        <Link href="/products" className="hidden md:flex items-center text-sm font-sans tracking-widest uppercase text-brand-text hover:text-brand-accent transition-colors">
                            View All <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </ScrollReveal>

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
        ['active-categories-v2'],
        { revalidate: 60, tags: ['categories'] }
    );
    const dbCategories = await getCategories();

    const categories = [
        { name: 'Panels',     label: 'BMS Panels',      icon: 'Server', imageUrl: '/images/products/bms-panels.png' },
        { name: 'Enclosures', label: 'IP Enclosures',   icon: 'Box',    imageUrl: '/images/products/ip-enclosures.png' },
        { name: 'Reflectors', label: 'Reflectors',      icon: 'Sun',    imageUrl: '/images/products/reflectors.png' },
        { name: 'Poles',      label: 'Industrial Poles',icon: 'Zap',    imageUrl: '/images/products/industrial-poles.png' },
    ].map(cat => ({
        ...cat,
        id: dbCategories.find((db: typeof dbCategories[number]) => 
            db.name.toLowerCase() === cat.name.toLowerCase() ||
            db.name.toLowerCase().includes(cat.name.toLowerCase().replace(/s$/, '')) ||
            cat.name.toLowerCase().includes(db.name.toLowerCase().replace(/s$/, ''))
        )?.id
    }));

    return <CategoryCards categories={categories} />;
}

