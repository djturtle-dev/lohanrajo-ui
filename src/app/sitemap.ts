import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lohanrajo.netlify.app';

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];

    try {
        const products = await prisma.product.findMany({
            where: { isDeleted: false },
            select: { id: true, createdAt: true },
        });

        const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
            url: `${baseUrl}/products/${product.id}`,
            lastModified: product.createdAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        const categories = await prisma.category.findMany({
            where: { isDeleted: false },
            select: { id: true, createdAt: true },
        });

        const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
            url: `${baseUrl}/products?category=${cat.id}`,
            lastModified: cat.createdAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        return [...staticRoutes, ...productRoutes, ...categoryRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticRoutes;
    }
}
