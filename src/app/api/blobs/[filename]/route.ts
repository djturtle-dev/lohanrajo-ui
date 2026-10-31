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
      const prodUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://lohanrajo-admin.netlify.app';
      const remoteRes = await fetch(`${prodUrl}/api/blobs/${filename}?${searchParams.toString()}`);
      if (remoteRes.ok) {
        const arrayBuf = await remoteRes.arrayBuffer();
        const contentType = remoteRes.headers.get('Content-Type') || (
          filename.endsWith('.png') ? 'image/png' 
          : filename.endsWith('.pdf') ? 'application/pdf'
          : filename.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : filename.endsWith('.doc') ? 'application/msword'
          : 'image/jpeg'
        );
        return new NextResponse(arrayBuf, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
      return new NextResponse('Not Found', { status: 404 });
    }
    const store = getStore(storeName);
    const blob = await store.get(filename, { type: 'blob' });
    
    if (!blob) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Determine content type from extension or metadata
    const contentType = filename.endsWith('.png') ? 'image/png' 
                      : filename.endsWith('.pdf') ? 'application/pdf'
                      : filename.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                      : filename.endsWith('.doc') ? 'application/msword'
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
