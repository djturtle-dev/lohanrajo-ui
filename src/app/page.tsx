import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import HeroTextAnimation from '@/components/HeroTextAnimation';
import HeroContent from '@/components/HeroContent';
import { prisma } from '@/lib/prisma';
import ScrollReveal from '@/components/animations/ScrollReveal';
import dynamic from 'next/dynamic';

const Testimonials = dynamic(() => import('@/components/Testimonials'));
const SpatialNodeMap = dynamic(() => import('@/components/SpatialNodeMap'));

import CategoryCards from '@/components/CategoryCards';
import HeroBlobVideo from '@/components/HeroBlobVideo';
import { getAssetUrl } from '@/lib/utils';

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
        <div className="flex flex-col gap-16 md:gap-20 w-full max-w-full overflow-x-hidden">
            {/* Full-Bleed Cinematic Hero + Metrics Shelf */}
            <div className="w-full max-w-full overflow-hidden">
                <section className="relative w-full max-w-full h-[100svh] min-h-[580px] max-h-[1050px] overflow-hidden">
                    {/* Full-bleed video background */}
                    <HeroBlobVideo />

                    {/* Cinematic gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/70 via-brand-bg/20 to-transparent z-10" />
                    {/* Vignette */}
                    <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, var(--th-bg) 100%)' }} />

                    {/* Hero Content with unified left edge */}
                    <HeroContent heading={<HeroTextAnimation lines={homeContent.heroLines} />} />

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
                        <h2 className="font-playfair italic text-4xl md:text-5xl text-brand-text">Our products</h2>
                        <Link href="/products" className="hidden md:flex items-center text-sm font-sans text-brand-text hover:text-brand-accent transition-colors">
                            View all <ArrowRight className="ml-2 w-4 h-4" />
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
    let homeContent: any = null;
    let dbCategories: any[] = [];

    try {
        const [content, cats] = await Promise.all([
            (prisma as any).homeContent.findFirst(),
            prisma.category.findMany({ where: { isDeleted: false } })
        ]);
        homeContent = content;
        dbCategories = cats;
    } catch {
        // Fallback if DB is unavailable
    }

    // Check if custom featured products are configured in DB
    const customFeatured = homeContent?.featuredProducts;
    if (Array.isArray(customFeatured) && customFeatured.length > 0) {
        const categories = customFeatured.map((item: any) => ({
            name: item.name || item.label,
            label: item.label || item.name,
            icon: item.icon || 'Server',
            id: item.categoryId || item.id,
            imageUrl: getAssetUrl(item.imageUrl) || item.imageUrl
        }));
        return <CategoryCards categories={categories} />;
    }

    // Default categories fallback
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

