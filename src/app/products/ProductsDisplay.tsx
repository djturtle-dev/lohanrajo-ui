'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAssetUrl } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Prisma } from '@prisma/client';
import ScrollReveal from '@/components/animations/ScrollReveal';

type ProductWithRelations = Prisma.ProductGetPayload<{
    include: { category: true; subCategory: true; }
}>;

export default function ProductsDisplay({
    products,
    totalCount,
    currentPage,
    pageSize
}: {
    products: ProductWithRelations[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
}) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(totalCount / pageSize);

    const buildUrl = (page: number) => {
        const sp = new URLSearchParams(searchParams.toString());
        sp.set('page', page.toString());
        return `/products?${sp.toString()}`;
    };

    if (products.length === 0) {
        return (
            <div className="py-24 text-center border border-dashed border-brand-border flex items-center justify-center flex-col gap-4">
                <p className="text-brand-muted font-sans text-sm">No products found</p>
                <Link
                    href="/products"
                    className="btn-glass-secondary px-6 py-2.5 font-playfair italic text-xs inline-flex items-center"
                >
                    View all products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex justify-end items-center bg-brand-panel border border-brand-border p-2.5 clip-chamfer">
                <div className="flex gap-1.5">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 border transition-colors cursor-pointer rounded ${viewMode === 'grid' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary'}`}
                        aria-label="Grid view"
                        title="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 border transition-colors cursor-pointer rounded ${viewMode === 'list' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary'}`}
                        aria-label="List view"
                        title="List view"
                    >
                        <List className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {products.map(product => (
                        <Link
                            href={`/products/${product.id}`}
                            key={product.id}
                            className="card-glass group flex flex-col"
                        >
                            <div className="aspect-[4/3] bg-brand-dark flex items-center justify-center relative overflow-hidden">
                                {product.images?.[0] ? (
                                    <Image
                                        src={getAssetUrl(product.images[0])}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        className="object-cover z-0 transition-all duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-brand-muted font-sans text-xs z-0 border border-brand-border px-4 py-2">
                                        No image
                                    </span>
                                )}
                            </div>
                            <div className="p-4 md:p-6 flex-grow flex flex-col justify-between relative z-20 min-w-0">
                                <div className="min-w-0">
                                    <p className="text-brand-accent text-[10px] md:text-xs font-semibold mb-1 md:mb-2 drop-shadow-md truncate" title={`${product.category.name}${product.subCategory ? ` • ${product.subCategory.name}` : ''}`}>
                                        {product.category.name}{product.subCategory && ` • ${product.subCategory.name}`}
                                    </p>
                                    <h3 className="text-brand-text font-sans text-sm md:text-lg mb-2 line-clamp-2 break-words">{product.name}</h3>
                                </div>
                                <div className="h-px w-8 bg-brand-border group-hover:w-full group-hover:bg-brand-accent transition-all duration-500 mt-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {products.map(product => (
                        <Link
                            href={`/products/${product.id}`}
                            key={product.id}
                            className="card-glass group flex flex-row"
                        >
                            <div className="w-24 md:w-44 shrink-0 bg-brand-dark flex items-center justify-center relative overflow-hidden">
                                {product.images?.[0] ? (
                                    <Image
                                        src={getAssetUrl(product.images[0])}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 200px"
                                        className="object-cover z-0 transition-all duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-brand-muted font-sans text-xs z-0 border border-brand-border px-2 py-1">No image</span>
                                )}
                            </div>
                            <div className="p-4 md:p-6 flex flex-col justify-center flex-grow min-w-0 relative z-20">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <p className="text-brand-accent text-xs font-semibold drop-shadow-md">
                                        {product.category.name}{product.subCategory && ` • ${product.subCategory.name}`}
                                    </p>
                                    <span className="hidden md:block text-brand-muted text-[10px] border border-brand-border px-2 py-1 font-sans shrink-0">
                                        View details
                                    </span>
                                </div>
                                <h3 className="text-brand-text font-sans text-base md:text-xl mb-2 md:mb-3 truncate">{product.name}</h3>
                                <div
                                    className="text-brand-muted text-xs line-clamp-2 font-mono
                                    [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_strong]:text-brand-text [&_a]:text-brand-accent"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 md:mt-12 font-sans text-sm">
                    {currentPage > 1 ? (
                        <Link
                            href={buildUrl(currentPage - 1)}
                            className="px-3.5 py-2 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition-colors bg-brand-panel rounded-lg flex items-center gap-1 text-xs font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </Link>
                    ) : (
                        <span className="px-3.5 py-2 border border-brand-border/30 text-brand-muted/40 cursor-not-allowed bg-brand-panel/50 rounded-lg flex items-center gap-1 text-xs font-medium">
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </span>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                            const isCurrent = p === currentPage;
                            return isCurrent ? (
                                <span
                                    key={p}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-brand-accent text-white font-semibold text-xs shadow-sm"
                                    aria-current="page"
                                >
                                    {p}
                                </span>
                            ) : (
                                <Link
                                    key={p}
                                    href={buildUrl(p)}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary bg-brand-panel transition-colors text-xs font-medium"
                                >
                                    {p}
                                </Link>
                            );
                        })}
                    </div>

                    {currentPage < totalPages ? (
                        <Link
                            href={buildUrl(currentPage + 1)}
                            className="px-3.5 py-2 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition-colors bg-brand-panel rounded-lg flex items-center gap-1 text-xs font-medium"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <span className="px-3.5 py-2 border border-brand-border/30 text-brand-muted/40 cursor-not-allowed bg-brand-panel/50 rounded-lg flex items-center gap-1 text-xs font-medium">
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
