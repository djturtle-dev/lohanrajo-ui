import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailView from './ProductDetailView';

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

    return <ProductDetailView product={product} />;
}

