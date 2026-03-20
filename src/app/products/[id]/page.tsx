import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

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
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
            <Link href="/products" className="inline-flex items-center text-brand-muted hover:text-brand-text mb-8 transition-colors font-oswald tracking-widest uppercase text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="aspect-square bg-brand-panel border border-brand-border flex flex-col items-center justify-center relative overflow-hidden group">
                        {product.images?.[0] ? (
                            <Image
                                src={getAssetUrl(product.images[0])}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-700"
                                priority
                            />
                        ) : (
                            <div className="z-20 text-center">
                                <span className="text-brand-muted font-oswald tracking-widest uppercase border border-brand-border px-4 py-2">No Image Provided</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors" />
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(1).map((img: typeof product.images[number], i: number) => (
                                <div key={i} className="aspect-square bg-brand-panel border border-brand-border relative overflow-hidden group cursor-pointer">
                                    <Image
                                        src={getAssetUrl(img)}
                                        alt={`${product.name} ${i + 2}`}
                                        fill
                                        sizes="(max-width: 768px) 25vw, 12vw"
                                        className="object-cover z-0 grayscale group-hover:grayscale-0 transition-all"
                                    />
                                    <div className="absolute inset-0 bg-brand-dark/10 mix-blend-multiply z-10" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-2 block">
                            {product.category.name} {product.subCategory ? `/ ${product.subCategory.name}` : ''}
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
                        <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="w-full block text-center px-8 py-4 bg-brand-accent text-brand-dark font-oswald font-bold tracking-widest uppercase hover:bg-white transition-colors">
                            Request Quote
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
