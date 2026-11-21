import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lohanrajo.netlify.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/admin/', '/admin/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'ClaudeBot',
                    'anthropic-ai',
                    'PerplexityBot',
                    'Google-Extended',
                    'Applebot-Extended',
                    'cohere-ai',
                    'Bytespider',
                ],
                allow: ['/', '/products', '/about', '/contact', '/llms.txt', '/llms-full.txt'],
                disallow: ['/api/admin/', '/admin/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
