import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim();
    const query = searchParams.get('q')?.trim() || '';

    try {
        const where: any = { isDeleted: false };
        if (id) {
            where.id = id;
        } else if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { category: { name: { contains: query, mode: 'insensitive' } } },
                { subCategory: { name: { contains: query, mode: 'insensitive' } } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            select: {
                id: true,
                name: true,
                images: true,
                category: {
                    select: { name: true }
                },
                subCategory: {
                    select: { name: true }
                }
            },
            take: 8,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Product search error:', error);
        return NextResponse.json({ success: false, products: [] }, { status: 500 });
    }
}
