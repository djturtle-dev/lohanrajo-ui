import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

// Cache the knowledge base for 24 hours (86400 seconds) to refresh on a daily basis
const getCachedKB = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        include: { category: true }
      });
      const aboutContent = await prisma.aboutContent.findFirst();
      return { products, aboutContent };
    } catch (e) {
      console.error('Failed to fetch DB data for KB fallback:', e);
      return { products: [], aboutContent: null };
    }
  },
  ['daily-knowledge-base'],
  { revalidate: 86400 } // Daily revalidation (24 hours)
);

export async function GET() {
  const data = await getCachedKB();
  return NextResponse.json(data);
}
