import { prisma } from '@/lib/prisma';
import { getAssetUrl } from '@/lib/utils';
import Link from 'next/link';
import { Search } from 'lucide-react';
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
}

interface PageProps {
    searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = params.query || '';
    const category = params.category || '';
    const page = Number(params.page) || 1;
    const pageSize = 12;

    const getCategories = unstable_cache(
        async () => {
            return await prisma.category.findMany({
                where: { isDeleted: false },
                orderBy: { name: 'asc' }
            });
        },
        ['products-categories-list'],
        { revalidate: 3600, tags: ['categories'] }
    );
    const categories = await getCategories();

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-20">
            <ScrollReveal direction="up" className="flex flex-col md:flex-row justify-between items-start mb-6 ">
                <div>
                    <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter text-brand-text mb-6 text-balance">Product <span className="text-brand-accent">Catalog</span></h1>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="space-y-8 relative z-[100]">
                    <div>
                        <h3 className="font-oswald tracking-widest uppercase text-brand-text mb-4">Search</h3>
                        <SearchAutocomplete initialQuery={query} initialCategory={category} />
                    </div>

                    <div>
                        <h3 className="font-oswald tracking-widest uppercase text-brand-text mb-4">Categories</h3>
                        <ul className="flex flex-row overflow-x-auto gap-4 pb-2 lg:flex-col lg:gap-0 lg:space-y-2 lg:overflow-visible snap-x">
                            <li className="shrink-0 snap-start">
                                <Link href={`/products${query ? `?query=${query}` : ''}`} className={`text-sm tracking-wide block py-1 whitespace-nowrap ${!category ? 'text-brand-accent font-bold' : 'text-brand-muted hover:text-brand-text'}`}>
                                    All Products
                                </Link>
                            </li>
                            {categories.map((cat: typeof categories[number]) => (
                                <li key={cat.id} className="shrink-0 snap-start">
                                    <Link
                                        href={`/products?category=${cat.id}${query ? `&query=${query}` : ''}`}
                                        className={`text-sm tracking-wide block py-1 whitespace-nowrap ${category === cat.id ? 'text-brand-accent font-bold' : 'text-brand-muted hover:text-brand-text'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <main className="lg:col-span-3">
                    <Suspense key={`${query}-${category}-${page}`} fallback={
                        <div className="flex items-center justify-center py-24">
                            <div className="spinner"></div>
                        </div>
                    }>
                        <ProductGrid query={query} category={category} page={page} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

async function ProductGrid({ query, category, page }: { query: string; category: string; page: number }) {
    const pageSize = 12;

    const getProducts = unstable_cache(
        async (q: string, c: string, p: number) => {
            const currentWhere: Prisma.ProductWhereInput = {
                isDeleted: false,
                name: { contains: q, mode: 'insensitive' },
                ...(c ? { categoryId: c } : {})
            };

            return await prisma.$transaction([
                prisma.product.count({ where: currentWhere }),
                prisma.product.findMany({
                    where: currentWhere,
                    include: {
                        category: true,
                        subCategory: true
                    },
                    orderBy: { category: { name: 'asc' } },
                    skip: (p - 1) * pageSize,
                    take: pageSize
                })
            ]);
        },
        ['products-list', query, category, page.toString()],
        { revalidate: 3600, tags: ['products'] }
    );

    const [totalCount, products] = await getProducts(query, category, page);

    return <ProductsDisplay products={products} totalCount={totalCount} currentPage={page} pageSize={pageSize} />;
}
