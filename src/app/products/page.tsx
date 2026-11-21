import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { X } from 'lucide-react';
import ProductsDisplay from './ProductsDisplay';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Prisma } from '@prisma/client';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Catalog | LIAT - LOHANRAJO INDUSTRIES AND TECHNOLOGIES',
    description: 'Explore our catalog of BMS Panels, IP Enclosures, Reflectors, and custom metal solutions.',
};

const pageSize = 6;

// Module-level cached queries to avoid recreation on every render
const getCachedCategories = unstable_cache(
    async () => {
        return await prisma.category.findMany({
            where: { isDeleted: false },
            include: {
                subCategories: {
                    where: { isDeleted: false },
                    orderBy: { name: 'asc' }
                }
            },
            orderBy: { name: 'asc' }
        });
    },
    ['products-categories-list-v3'],
    { revalidate: 30, tags: ['categories'] }
);

const getCachedProducts = unstable_cache(
    async (q: string, c: string, sub: string, p: number) => {
        const trimmedQuery = q.trim();
        const searchConditions: Prisma.ProductWhereInput[] = trimmedQuery ? [
            { name: { contains: trimmedQuery, mode: 'insensitive' } },
            { description: { contains: trimmedQuery, mode: 'insensitive' } },
            { category: { name: { contains: trimmedQuery, mode: 'insensitive' } } },
            { subCategory: { name: { contains: trimmedQuery, mode: 'insensitive' } } },
        ] : [];

        const currentWhere: Prisma.ProductWhereInput = {
            isDeleted: false,
            ...(c ? { categoryId: c } : {}),
            ...(sub ? { subCategoryId: sub } : {}),
            ...(searchConditions.length > 0 ? { OR: searchConditions } : {})
        };

        const totalCount = await prisma.product.count({ where: currentWhere });

        // Guard against out-of-bounds page (e.g. switching filters while on page 2)
        const validPage = (p - 1) * pageSize >= totalCount && totalCount > 0 ? 1 : p;

        const products = await prisma.product.findMany({
            where: currentWhere,
            include: {
                category: true,
                subCategory: true
            },
            orderBy: [
                { category: { name: 'asc' } },
                { createdAt: 'desc' },
                { id: 'asc' }
            ],
            skip: (validPage - 1) * pageSize,
            take: pageSize
        });

        return { totalCount, products, validPage };
    },
    ['products-catalog-query-v3'],
    { revalidate: 30, tags: ['products'] }
);

interface PageProps {
    searchParams: Promise<{ query?: string; category?: string; subCategory?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = params.query || '';
    const category = params.category || '';
    const subCategory = params.subCategory || '';
    const page = Math.max(1, Number(params.page) || 1);

    const [categories, { totalCount, products, validPage }] = await Promise.all([
        getCachedCategories(),
        getCachedProducts(query, category, subCategory, page)
    ]);

    const activeCategory = categories.find((cat: typeof categories[number]) => cat.id === category);
    const activeSubCategory = activeCategory?.subCategories?.find((sub: any) => sub.id === subCategory);

    return (
        <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 sm:px-8 pt-24 md:pt-28 pb-16">
            <ScrollReveal direction="up" className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                    <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6 text-balance">
                        Product <span className="text-brand-accent">catalog</span>
                    </h1>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar */}
                <div className="space-y-6 relative z-[100]">
                    <div>
                        <h3 className="font-playfair italic font-bold text-brand-text mb-3 text-lg">Search</h3>
                        <SearchAutocomplete initialQuery={query} initialCategory={category} />
                    </div>

                    <div>
                        <h3 className="font-playfair italic font-bold text-brand-text mb-3 text-lg">Categories</h3>
                        <ul className="flex flex-row overflow-x-auto gap-4 pb-2 lg:flex-col lg:gap-0 lg:space-y-2 lg:overflow-visible snap-x">
                            <li className="shrink-0 snap-start">
                                <Link
                                    href="/products"
                                    className={`text-sm tracking-wide block py-1 whitespace-nowrap lg:whitespace-normal break-words font-sans ${
                                        !category && !subCategory && !query
                                            ? 'text-brand-accent font-bold'
                                            : 'text-brand-muted hover:text-brand-text'
                                    }`}
                                >
                                    All products
                                </Link>
                            </li>
                            {categories.map((cat: typeof categories[number]) => {
                                const isCategoryActive = category === cat.id;
                                return (
                                    <li key={cat.id} className="shrink-0 snap-start">
                                        <Link
                                            href={`/products?category=${cat.id}`}
                                            className={`text-sm tracking-wide block py-1 whitespace-nowrap lg:whitespace-normal break-words font-sans ${
                                                isCategoryActive && !subCategory
                                                    ? 'text-brand-accent font-bold'
                                                    : 'text-brand-muted hover:text-brand-text'
                                            }`}
                                        >
                                            {cat.name}
                                        </Link>
                                        {isCategoryActive && cat.subCategories && cat.subCategories.length > 0 && (
                                            <ul className="pl-3 py-1 space-y-1">
                                                {cat.subCategories.map((sub: any) => (
                                                    <li key={sub.id}>
                                                        <Link
                                                            href={`/products?category=${cat.id}&subCategory=${sub.id}`}
                                                            className={`text-xs block py-0.5 font-sans break-words ${
                                                                subCategory === sub.id
                                                                    ? 'text-brand-accent font-semibold'
                                                                    : 'text-brand-muted/70 hover:text-brand-text'
                                                            }`}
                                                        >
                                                            └ {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <main className="lg:col-span-3">
                    {/* Active Filters Bar */}
                    {(query || category || subCategory) && (
                        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white dark:bg-brand-panel border border-brand-border clip-chamfer shadow-sm">
                            <span className="text-xs text-brand-muted font-sans mr-1">Filtered by:</span>
                            {query && (
                                <Link
                                    href={`/products?${new URLSearchParams({
                                        ...(category ? { category } : {}),
                                        ...(subCategory ? { subCategory } : {})
                                    }).toString()}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-brand-bg dark:bg-brand-dark border border-brand-border rounded text-brand-text hover:border-brand-accent transition-colors font-sans"
                                    title="Remove search query"
                                >
                                    <span>Search: "{query}"</span>
                                    <X className="w-3.5 h-3.5 text-brand-accent" />
                                </Link>
                            )}
                            {activeCategory && (
                                <Link
                                    href={`/products?${new URLSearchParams({
                                        ...(query ? { query } : {})
                                    }).toString()}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-brand-bg dark:bg-brand-dark border border-brand-border rounded text-brand-text hover:border-brand-accent transition-colors font-sans"
                                    title="Remove category filter"
                                >
                                    <span>Category: {activeCategory.name}</span>
                                    <X className="w-3.5 h-3.5 text-brand-accent" />
                                </Link>
                            )}
                            {activeSubCategory && (
                                <Link
                                    href={`/products?${new URLSearchParams({
                                        category,
                                        ...(query ? { query } : {})
                                    }).toString()}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-brand-bg dark:bg-brand-dark border border-brand-border rounded text-brand-text hover:border-brand-accent transition-colors font-sans"
                                    title="Remove subcategory filter"
                                >
                                    <span>Subcategory: {activeSubCategory.name}</span>
                                    <X className="w-3.5 h-3.5 text-brand-accent" />
                                </Link>
                            )}
                            <Link
                                href="/products"
                                className="text-xs text-brand-accent hover:text-brand-text dark:hover:text-white transition-colors font-sans font-semibold ml-auto"
                            >
                                Clear all
                            </Link>
                        </div>
                    )}

                    <Suspense
                        key={`${query}-${category}-${subCategory}-${page}`}
                        fallback={
                            <div className="flex items-center justify-center py-24">
                                <div className="spinner"></div>
                            </div>
                        }
                    >
                        <ProductsDisplay products={products} totalCount={totalCount} currentPage={validPage} pageSize={pageSize} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

