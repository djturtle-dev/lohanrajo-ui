import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us & Request a Quote | LIAT Enclosures',
    description: 'Connect with LIAT for custom IP rated enclosure inquiries, BMS panel quotes, and engineering consultations. Located in Perungudi, Chennai.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Contact Us & Request a Quote | LIAT Enclosures',
        description: 'Connect with LIAT for custom IP rated enclosure inquiries, BMS panel quotes, and engineering consultations.',
        url: 'https://lohanrajo.netlify.app/contact',
        images: ['/Footer-logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us & Request a Quote | LIAT Enclosures',
        description: 'Connect with LIAT for custom IP rated enclosure inquiries, BMS panel quotes, and engineering consultations.',
        images: ['/Footer-logo.png'],
    },
};

const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact LIAT - Lohanrajo Industries and Technologies',
    url: 'https://lohanrajo.netlify.app/contact',
    description: 'Get quotes and technical assistance for industrial enclosures and BMS panels from LIAT.',
    mainEntity: {
        '@type': 'Organization',
        name: 'Lohanrajo Industries and Technologies Private Limited',
        telephone: '+91-44-24962590',
        email: 'lohanrajoliat@gmail.com',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Plot No. 213, 214 & 215, 3rd Main Road, Burma Colony, Perungudi',
            addressLocality: 'Chennai',
            addressRegion: 'Tamil Nadu',
            postalCode: '600096',
            addressCountry: 'IN',
        },
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
            />
            {children}
        </>
    );
}
