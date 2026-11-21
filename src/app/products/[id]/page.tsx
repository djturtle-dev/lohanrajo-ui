import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailView from './ProductDetailView';
import type { Metadata } from 'next';
import { getAssetUrl } from '@/lib/utils';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findFirst({
        where: { id, isDeleted: false },
        include: { category: true, subCategory: true }
    });

    if (!product) {
        return {
            title: 'Product Not Found | LIAT',
            description: 'The requested industrial enclosure product could not be found.',
        };
    }

    const title = `${product.name} | LIAT Industrial Enclosures`;
    const cleanDesc = (product.description || '').replace(/\s+/g, ' ').trim();
    const description = cleanDesc.length > 30 
        ? (cleanDesc.length > 155 ? `${cleanDesc.slice(0, 152)}...` : cleanDesc)
        : `Industrial-grade ${product.name} manufactured by LIAT to international IP standards. Request specifications and custom quotes.`;
    
    const imageUrl = product.images?.[0] ? getAssetUrl(product.images[0]) : '/Footer-logo.png';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lohanrajo.netlify.app';
    const canonical = `/products/${product.id}`;
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}${canonical}`,
            siteName: 'LIAT - Lohanrajo Industries and Technologies',
            type: 'website',
            images: [
                {
                    url: fullImageUrl,
                    alt: product.name,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [fullImageUrl],
        }
    };
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lohanrajo.netlify.app';

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `Industrial-grade ${product.name} manufactured by LIAT.`,
        image: product.images?.length ? product.images.map(img => {
            const url = getAssetUrl(img);
            return url.startsWith('http') ? url : `${baseUrl}${url}`;
        }) : [`${baseUrl}/Footer-logo.png`],
        category: product.category?.name || 'Industrial Enclosures',
        manufacturer: {
            '@type': 'Organization',
            name: 'Lohanrajo Industries and Technologies Private Limited',
            url: baseUrl,
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: '0.00',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/products/${product.id}`,
            seller: {
                '@type': 'Organization',
                name: 'LIAT',
            },
        },
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: `${baseUrl}/products`,
            },
            ...(product.category ? [{
                '@type': 'ListItem',
                position: 3,
                name: product.category.name,
                item: `${baseUrl}/products?category=${product.category.id}`,
            }] : []),
            {
                '@type': 'ListItem',
                position: product.category ? 4 : 3,
                name: product.name,
                item: `${baseUrl}/products/${product.id}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ProductDetailView product={product} />
        </>
    );
}
