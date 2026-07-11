'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, List } from 'lucide-react';
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
            <div className="py-24 text-center border border-dashed border-brand-border flex items-center justify-center flex-col">
                <p className="text-brand-muted mb-4 font-sans uppercase tracking-widest">No products found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-brand-panel border border-brand-border p-3 clip-chamfer">
                <p className="text-xs md:text-sm tracking-widest uppercase font-sans text-brand-muted">
                    Showing {products.length} of {totalCount} Product{totalCount !== 1 && 's'}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 border transition-colors ${viewMode === 'list' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary'}`}
                        aria-label="List View"
                    >
                        <List className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 border transition-colors ${viewMode === 'grid' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary'}`}
                        aria-label="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
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
                                    <span className="text-brand-muted font-sans tracking-widest uppercase text-xs z-0 border border-brand-border px-4 py-2">
                                        No Image
                                    </span>
                                )}
                            </div>
                            <div className="p-4 md:p-6 flex-grow flex flex-col justify-between relative z-20">
                                <div>
                                    <p className="text-brand-accent text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2 drop-shadow-md">
                                        {product.category.name}{product.subCategory && ` • ${product.subCategory.name}`}
                                    </p>
                                    <h3 className="text-white font-sans text-sm md:text-lg uppercase tracking-wide mb-2 line-clamp-2 drop-shadow-md">{product.name}</h3>
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
                                    <span className="text-brand-muted font-sans tracking-widest uppercase text-xs z-0 border border-brand-border px-2 py-1">No Image</span>
                                )}
                            </div>
                            <div className="p-4 md:p-6 flex flex-col justify-center flex-grow min-w-0 relative z-20">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <p className="text-brand-accent text-xs font-bold tracking-widest uppercase drop-shadow-md">
                                        {product.category.name}{product.subCategory && ` • ${product.subCategory.name}`}
                                    </p>
                                    <span className="hidden md:block text-brand-muted text-[10px] border border-brand-border px-2 py-1 tracking-widest font-sans uppercase shrink-0">
                                        View Details
                                    </span>
                                </div>
                                <h3 className="text-white font-sans text-base md:text-xl uppercase tracking-wide mb-2 md:mb-3 truncate drop-shadow-md">{product.name}</h3>
                                <div
                                    className="text-gray-300 text-xs line-clamp-2 font-mono
                                    [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_strong]:text-white [&_a]:text-brand-accent drop-shadow-md"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 md:mt-12 font-sans tracking-widest uppercase text-sm">
                    {currentPage > 1 ? (
                        <Link
                            href={buildUrl(currentPage - 1)}
                            className="px-4 py-2 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition-colors bg-brand-panel clip-chamfer"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span className="px-4 py-2 border border-brand-border/30 text-brand-muted/40 cursor-not-allowed bg-brand-panel/50 clip-chamfer">
                            Previous
                        </span>
                    )}

                    <span className="px-4 py-2 text-brand-text font-mono text-xs">
                        Page {currentPage} of {totalPages}
                    </span>

                    {currentPage < totalPages ? (
                        <Link
                            href={buildUrl(currentPage + 1)}
                            className="px-4 py-2 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition-colors bg-brand-panel clip-chamfer"
                        >
                            Next
                        </Link>
                    ) : (
                        <span className="px-4 py-2 border border-brand-border/30 text-brand-muted/40 cursor-not-allowed bg-brand-panel/50 clip-chamfer">
                            Next
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
