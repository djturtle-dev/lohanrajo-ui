import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import HeroVideoBackground from '@/components/HeroVideoBackground';
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
            {/* Custom Masked Blob Hero Section */}
            <section className="relative w-full pt-36 md:pt-40 pb-0 overflow-hidden flex flex-col px-4 sm:px-0 max-w-5xl mx-auto">
                <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center">

                    {/* Top Row: Hero Text, Button & Description */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 w-full">
                        {/* Left Side: Hero Text and Button */}
                        <div className="flex-1 w-full flex flex-col items-start lg:-mt-2">
                            <div className="w-full">
                                <HeroTextAnimation lines={homeContent.heroLines} />
                            </div>
                            <div className="mt-2 lg:mt-2">
                                <Link href="/products" className="group btn-glass-secondary px-6 py-3 md:px-8 font-oswald tracking-widest uppercase inline-flex items-center text-xs md:text-sm">
                                    Explore <span className="hidden md:inline ml-1">Products</span> <ArrowRight className="ml-2 md:ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                                </Link>
                            </div>
                        </div>
                        
                        {/* Right Side: Paragraph */}
                        <div className="w-full lg:max-w-md lg:pb-4 lg:pt-10">
                            <p className="text-brand-muted text-sm md:text-base leading-relaxed text-justify">
                                LOHANRAJO merges uncompromised quality with state-of-the-art manufacturing. Our mission is to deliver enclosures and metal solutions that are exceptionally resilient and seamlessly functional, redefining standards in the physical infrastructure space.
                            </p>
                        </div>
                    </div>

                    {/* Third Row: The Masked Video Blob */}
                    <HeroBlobVideo />

                </div>
            </section>

            {/* Spatial Node Map Section */}
            <SpatialNodeMap pillars={pillars} />

            {/* Featured Categories */}
            <section className="px-4 sm:px-0 max-w-5xl mx-auto w-full">
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
        ['active-categories'],
        { revalidate: 3600, tags: ['categories'] }
    );
    const dbCategories = await getCategories();

    const categories = [
        { name: 'Panels',     label: 'BMS Panels',      icon: 'Server', imageUrl: '/images/products/bms-panels.png' },
        { name: 'Enclosures', label: 'IP Enclosures',   icon: 'Box',    imageUrl: '/images/products/ip-enclosures.png' },
        { name: 'Reflectors', label: 'Reflectors',      icon: 'Sun',    imageUrl: '/images/products/reflectors.png' },
        { name: 'Poles',      label: 'Industrial Poles',icon: 'Zap',    imageUrl: '/images/products/industrial-poles.png' },
    ].map(cat => ({
        ...cat,
        id: dbCategories.find((db: typeof dbCategories[number]) => db.name === cat.name)?.id
    }));

    return <CategoryCards categories={categories} />;
}
