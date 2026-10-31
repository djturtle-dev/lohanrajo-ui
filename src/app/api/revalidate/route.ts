import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const path = searchParams.get('path');

    if (tag) {
        revalidateTag(tag, 'default');
    }
    if (path) {
        revalidatePath(path);
    }

    if (!tag && !path) {
        revalidateTag('products', 'default');
        revalidateTag('categories', 'default');
        revalidatePath('/products');
        revalidatePath('/');
    }

    return NextResponse.json({
        revalidated: true,
        tag: tag || 'products,categories',
        path: path || '/products,/',
        now: Date.now()
    });
}
