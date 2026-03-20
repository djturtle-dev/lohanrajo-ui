import { prisma } from '@/lib/prisma';
import { getAssetUrl } from '@/lib/utils';
import Link from 'next/link';
import { Search } from 'lucide-react';
import ProductsDisplay from './ProductsDisplay';
import { Prisma } from '@prisma/client';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';

export const metadata = {
    title: 'Catalog | LOHANRAJO Metal Arts',
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
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 ">
                <div>
                    <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tighter text-brand-text mb-6 text-balance">Product <span className="text-brand-accent">Catalog</span></h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="space-y-8">
                    <div>
                        <h3 className="font-oswald tracking-widest uppercase text-brand-text mb-4">Search</h3>
                        <form className="relative">
                            <input
                                type="text"
                                name="query"
                                defaultValue={query}
                                placeholder="Search products..."
                                className="w-full bg-brand-panel border border-brand-border px-4 py-3 pl-10 text-brand-text focus:outline-none focus:border-brand-accent transition-colors block"
                                autoComplete="off"
                            />
                            <Search className="absolute left-3 top-3.5 w-4 h-4 text-brand-muted" />
                            {category && <input type="hidden" name="category" value={category} />}
                        </form>
                    </div>

                    <div>
                        <h3 className="font-oswald tracking-widest uppercase text-brand-text mb-4">Categories</h3>
                        <ul className="flex flex-row overflow-x-auto gap-4 pb-2 lg:flex-col lg:gap-0 lg:space-y-2 lg:overflow-visible snap-x">
                            <li className="shrink-0 snap-start">
                                <Link href={`/products${query ? `?query=${query}` : ''}`} className={`text-sm tracking-wide block py-1 whitespace-nowrap ${!category ? 'text-brand-accent font-bold' : 'text-brand-muted hover:text-brand-text'}`}>
                                    All Products
                                </Link>
                            </li>
                            {categories.map(cat => (
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
                </aside>

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

    const where: Prisma.ProductWhereInput = {
        isDeleted: false,
        name: { contains: query, mode: 'insensitive' },
        ...(category ? { categoryId: category } : {})
    };

    const getProducts = unstable_cache(
        async (q: string, c: string, p: number) => {
            return await prisma.$transaction([
                prisma.product.count({ where }),
                prisma.product.findMany({
                    where,
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
