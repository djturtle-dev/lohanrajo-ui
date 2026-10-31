export function getAssetUrl(path: string | null | undefined): string {
    if (!path) return '';
    
    // If it's a localhost URL from older database entries, strip host to use relative path
    if (path.startsWith('http://localhost') || path.startsWith('http://127.0.0.1')) {
        try {
            const url = new URL(path);
            return url.pathname + url.search;
        } catch {}
    }

    // If it's already an external absolute URL, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a Netlify Blobs path, return it directly (ensuring leading slash)
    if (path.startsWith('api/blobs/') || path.startsWith('/api/blobs/')) {
        return path.startsWith('/') ? path : `/${path}`;
    }

    // If it already has the /uploads/ prefix, just return it (ensuring it starts with /)
    if (path.startsWith('uploads/') || path.startsWith('/uploads/')) {
        return path.startsWith('/') ? path : `/${path}`;
    }

    // Otherwise, assume it's a bare filename and prefix it with /uploads/products/
    // This handles the inconsistent state found in the database
    const filename = path.startsWith('/') ? path.slice(1) : path;
    return `/uploads/products/${filename}`;
}

export function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
