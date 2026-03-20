'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, List } from 'lucide-react';
import { getAssetUrl } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Prisma } from '@prisma/client';

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

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    if (products.length === 0) {
        return (
            <div className="py-24 text-center border border-dashed border-brand-border flex items-center justify-center flex-col">
                <p className="text-brand-muted mb-4 font-oswald uppercase tracking-widest">No products found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-brand-panel border border-brand-border p-3">
                <p className="text-xs md:text-sm tracking-widest uppercase font-oswald text-brand-muted">
                    Showing {products.length} of {totalCount} Product{totalCount !== 1 && 's'}
                </p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 border transition-colors ${viewMode === 'list' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/50'}`}
                        aria-label="List View"
                    >
                        <List className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 border transition-colors ${viewMode === 'grid' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/50'}`}
                        aria-label="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                    {products.map(product => (
                        <Link href={`/products/${product.id}`} key={product.id} className="group border border-brand-border bg-brand-panel overflow-hidden flex flex-col hover:border-brand-accent/50 transition-colors">
                            <div className="aspect-[4/3] bg-brand-dark flex items-center justify-center p-4 md:p-6 relative">
                                <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply group-hover:bg-brand-accent/5 transition-colors z-10" />
                                {product.images?.[0] ? (
                                    <Image
                                        src={getAssetUrl(product.images[0])}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        className="object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                ) : (
                                    <span className="text-brand-muted font-oswald tracking-widest uppercase text-xs z-0 border border-brand-border px-2 md:px-4 py-1 md:py-2">Image</span>
                                )}
                            </div>
                            <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <p className="text-brand-accent text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2">
                                        {product.category.name} {product.subCategory && `• ${product.subCategory.name}`}
                                    </p>
                                    <h3 className="text-brand-text font-oswald text-base md:text-xl uppercase tracking-wide mb-2 line-clamp-2 md:line-clamp-none">{product.name}</h3>
                                </div>
                                <div className="h-1 w-4 md:w-8 bg-brand-border group-hover:w-full group-hover:bg-brand-accent transition-all mt-4 md:mt-6" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {products.map(product => (
                        <Link href={`/products/${product.id}`} key={product.id} className="group border border-brand-border bg-brand-panel flex flex-col md:flex-row hover:border-brand-accent/50 transition-colors">
                            <div className="w-full md:w-48 aspect-[4/3] md:aspect-square bg-brand-dark flex items-center justify-center relative shrink-0">
                                <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply group-hover:bg-brand-accent/5 transition-colors z-10" />
                                {product.images?.[0] ? (
                                    <Image
                                        src={getAssetUrl(product.images[0])}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 200px"
                                        className="object-cover z-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                ) : (
                                    <span className="text-brand-muted font-oswald tracking-widest uppercase text-xs z-0 border border-brand-border px-2 py-1">Image</span>
                                )}
                            </div>
                            <div className="p-4 md:p-6 flex flex-col justify-center flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-brand-accent text-xs font-bold tracking-widest uppercase">
                                        {product.category.name} {product.subCategory && `• ${product.subCategory.name}`}
                                    </p>
                                    <span className="hidden md:block text-brand-muted text-[10px] md:text-xs border border-brand-border px-2 py-1 tracking-widest font-oswald uppercase">View Details</span>
                                </div>
                                <h3 className="text-brand-text font-oswald text-lg md:text-2xl uppercase tracking-wide mb-2 md:mb-3">{product.name}</h3>
                                <p className="text-brand-muted text-xs md:text-sm line-clamp-2 max-w-2xl">{stripHtml(product.description)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 md:mt-12 font-oswald tracking-widest uppercase text-sm">
                    {currentPage > 1 ? (
                        <Link 
                            href={buildUrl(currentPage - 1)}
                            className="px-4 py-2 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/50 transition-colors bg-brand-panel"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span className="px-4 py-2 border border-brand-border/30 text-brand-muted/50 cursor-not-allowed bg-brand-panel/50">
                            Previous
                        </span>
                    )}
                    
                    <span className="px-4 py-2 text-brand-text">
                        Page {currentPage} of {totalPages}
                    </span>

                    {currentPage < totalPages ? (
                        <Link 
                            href={buildUrl(currentPage + 1)}
                            className="px-4 py-2 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/50 transition-colors bg-brand-panel"
                        >
                            Next
                        </Link>
                    ) : (
                        <span className="px-4 py-2 border border-brand-border/30 text-brand-muted/50 cursor-not-allowed bg-brand-panel/50">
                            Next
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
