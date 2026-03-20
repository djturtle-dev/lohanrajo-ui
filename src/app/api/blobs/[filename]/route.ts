import { getStore } from '@netlify/blobs';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const { searchParams } = new URL(request.url);
  const storeName = searchParams.get('store') || 'testimonials';
  
  try {
    const isNetlify = !!process.env.NETLIFY;
    if (!isNetlify && !(process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN)) {
      throw new Error('Missing Netlify environment');
    }
    const store = getStore(storeName);
    const blob = await store.get(filename, { type: 'blob' });
    
    if (!blob) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Determine content type from extension or metadata (simplified here)
    const contentType = filename.endsWith('.png') ? 'image/png' 
                      : filename.endsWith('.pdf') ? 'application/pdf'
                      : 'image/jpeg';

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Error fetching blob:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
