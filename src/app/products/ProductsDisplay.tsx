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

    const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(currentPage * pageSize, totalCount);
    const countText = totalCount === 0
        ? 'No products found'
        : totalCount <= pageSize
            ? `Showing ${totalCount} of ${totalCount} products`
            : `Showing ${startItem}–${endItem} of ${totalCount} products`;

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
            {/* Top Bar with Pagination Status & Floating Grid/List Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-border/40">
                {/* Left: Visible Top Pagination Status & Quick Page Switcher */}
                <div className="flex items-center gap-3">
                    <span className="text-xs font-sans text-brand-muted tracking-wide">
                        {countText}
                    </span>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5 font-sans">
                            {currentPage > 1 ? (
                                <Link
                                    href={buildUrl(currentPage - 1)}
                                    className="p-1 rounded border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent bg-brand-panel transition-colors"
                                    title="Previous page"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <span className="p-1 rounded border border-brand-border/30 text-brand-muted/30 cursor-not-allowed bg-brand-panel/40">
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </span>
                            )}
                            <span className="text-[11px] font-mono text-brand-muted px-1.5 py-0.5 rounded bg-brand-panel border border-brand-border/40">
                                {currentPage} / {totalPages}
                            </span>
                            {currentPage < totalPages ? (
                                <Link
                                    href={buildUrl(currentPage + 1)}
                                    className="p-1 rounded border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-accent bg-brand-panel transition-colors"
                                    title="Next page"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <span className="p-1 rounded border border-brand-border/30 text-brand-muted/30 cursor-not-allowed bg-brand-panel/40">
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Floating Glass Capsule Toggle for Grid / List View */}
                <div className="ml-auto inline-flex items-center p-1 rounded-xl bg-white dark:bg-brand-panel border border-brand-border/60 shadow-sm backdrop-blur-md">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                            viewMode === 'grid'
                                ? 'bg-brand-accent text-white shadow-xs'
                                : 'text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                        aria-label="Grid view"
                        title="Grid view"
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                            viewMode === 'list'
                                ? 'bg-brand-accent text-white shadow-xs'
                                : 'text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                        aria-label="List view"
                        title="List view"
                    >
                        <List className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">List</span>
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

            {/* Pagination & Results Count */}
            {totalCount > 0 && (
                <div className="flex flex-col items-center justify-center gap-3.5 mt-10 md:mt-14 pt-6 border-t border-brand-border/40">
                    {/* Showing X–Y of Z products */}
                    <span className="text-xs font-sans text-brand-muted tracking-wide">
                        {countText}
                    </span>

                    {/* Pagination Controls */}
                    {totalPages > 1 ? (
                        <div className="flex justify-center items-center gap-2 font-sans text-sm">
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
                    ) : totalCount > 0 ? (
                        <div className="flex justify-center items-center gap-2 font-sans text-sm">
                            <span className="px-3.5 py-2 border border-brand-border/30 text-brand-muted/40 cursor-not-allowed bg-brand-panel/50 rounded-lg flex items-center gap-1 text-xs font-medium">
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </span>
                            <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-brand-accent text-white font-semibold text-xs shadow-sm" aria-current="page">
                                1
                            </span>
                            <span className="px-3.5 py-2 border border-brand-border/30 text-brand-muted/40 cursor-not-allowed bg-brand-panel/50 rounded-lg flex items-center gap-1 text-xs font-medium">
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
