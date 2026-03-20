export function getAssetUrl(path: string | null | undefined): string {
    if (!path) return '';
    
    // If it's already an absolute URL, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
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
