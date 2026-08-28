import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ProductGallery from './ProductGallery';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;

    const product = await prisma.product.findFirst({
        where: { id, isDeleted: false },
        include: {
            category: true,
            subCategory: true
        }
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-20">
            <ScrollReveal direction="down" delay={0.1}>
                <Link href="/products" className="inline-flex items-center text-brand-muted hover:text-brand-text mb-8 transition-colors font-oswald tracking-widest uppercase text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
                </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ScrollReveal direction="left" delay={0.2} className="space-y-4">
                    <ProductGallery productName={product.name} images={product.images || []} />
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.3} staggerChildren={true} staggerAmount={0.1} className="flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-2 block">
                            {product.category.name} {product.subCategory ? `• ${product.subCategory.name}` : ''}
                        </span>
                        <h1 className="font-oswald text-4xl uppercase tracking-wider text-brand-text mb-6">{product.name}</h1>
                        <div className="h-px w-full bg-brand-border mb-6" />
                    </div>

                    <div
                        className="prose prose-invert prose-brand mb-8 text-brand-muted max-w-none
                        prose-headings:font-oswald prose-headings:uppercase prose-headings:tracking-wider
                        prose-a:text-brand-accent prose-strong:text-brand-text"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />

                    <div className="mt-auto">
                        <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="w-full btn-glass-primary block text-center px-8 py-4 font-oswald tracking-widest uppercase">
                            Request Quote
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}

