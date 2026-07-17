import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ products: [], categories: [], subCategories: [] });
    }

    try {
        const [products, categories, subCategories] = await Promise.all([
            prisma.product.findMany({
                where: {
                    isDeleted: false,
                    name: { contains: query, mode: 'insensitive' }
                },
                select: { id: true, name: true, categoryId: true },
                take: 5
            }),
            prisma.category.findMany({
                where: {
                    isDeleted: false,
                    name: { contains: query, mode: 'insensitive' }
                },
                select: { id: true, name: true },
                take: 3
            }),
            prisma.subCategory.findMany({
                where: {
                    isDeleted: false,
                    name: { contains: query, mode: 'insensitive' }
                },
                select: { id: true, name: true, categoryId: true },
                take: 3
            })
        ]);
        const response = NextResponse.json({ products, categories, subCategories });
        response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
        return response;
    } catch (error) {
        console.error('Autocomplete Error:', error);
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
