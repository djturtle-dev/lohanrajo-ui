import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClarityScript from "@/components/ClarityScript";
import ChatBot from "@/components/ChatBot";
import AnimatedBackground from "@/components/AnimatedBackground";
import ImageProtection from "@/components/ImageProtection";
import { ThemeProvider } from "@/components/ThemeProvider";

const poppins = Poppins({ 
    subsets: ["latin"], 
    weight: ["300", "400", "500", "600"], 
    variable: "--font-poppins" 
});

const playfair = Playfair_Display({ 
    subsets: ["latin"], 
    weight: ["400", "500", "600", "700", "800", "900"], 
    style: ['normal', 'italic'], 
    variable: "--font-playfair" 
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lohanrajo.netlify.app'),
    title: {
        default: 'LIAT | Industrial Enclosures, BMS & Control Panels',
        template: '%s | LIAT',
    },
    description: 'ISO 9001:2015 certified manufacturer of IP rated industrial enclosures, BMS panels, junction boxes, and precision metal engineering solutions.',
    keywords: [
        'BMS panels',
        'IP rated enclosures',
        'stainless steel enclosures',
        'SS316 panels',
        'SS304 enclosures',
        'industrial control panels',
        'LIAT',
        'Lohanrajo Industries',
        'junction boxes',
        'electrical panels',
        'DDC panels',
        'Chennai sheet metal manufacturing'
    ],
    authors: [{ name: 'Lohanrajo Industries and Technologies Private Limited', url: 'https://lohanrajo.netlify.app' }],
    creator: 'Lohanrajo Industries and Technologies Private Limited',
    publisher: 'Lohanrajo Industries and Technologies Private Limited',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'LIAT | Industrial Enclosures, BMS & Control Panels',
        description: 'ISO 9001:2015 certified manufacturer of IP rated industrial enclosures, BMS panels, junction boxes, and precision metal engineering solutions.',
        url: 'https://lohanrajo.netlify.app',
        siteName: 'LIAT - Lohanrajo Industries and Technologies',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: '/Footer-logo.png',
                width: 1200,
                height: 630,
                alt: 'LIAT - Lohanrajo Industries and Technologies',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LIAT | Industrial Enclosures, BMS & Control Panels',
        description: 'ISO 9001:2015 certified manufacturer of IP rated industrial enclosures, BMS panels, junction boxes, and precision metal engineering solutions.',
        images: ['/Footer-logo.png'],
    },
    icons: {
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon.ico' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/site.webmanifest',
};

// Inline script injected before React hydrates to avoid flash-of-wrong-theme
const themeScript = `
(function() {
    try {
        var saved = localStorage.getItem('theme');
        var resolved = (saved === 'dark') ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', resolved);
    } catch(e) {}
})();
`;

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Manufacturer'],
    '@id': 'https://lohanrajo.netlify.app/#organization',
    name: 'Lohanrajo Industries and Technologies Private Limited',
    alternateName: ['LIAT', 'Lohanrajo Industries', 'Lohanrajo Metal Arts'],
    url: 'https://lohanrajo.netlify.app',
    logo: 'https://lohanrajo.netlify.app/Footer-logo.png',
    foundingDate: '1992',
    founders: [
        { '@type': 'Person', name: 'L.L. Baskar' },
        { '@type': 'Person', name: 'L.L. Sekar' }
    ],
    description: 'ISO 9001:2015 certified manufacturer of IP rated industrial enclosures, BMS panels, junction boxes, and precision sheet metal fabrications.',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot No. 213, 214 & 215, 3rd Main Road, Burma Colony, Perungudi',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        postalCode: '600096',
        addressCountry: 'IN'
    },
    contactPoint: [
        {
            '@type': 'ContactPoint',
            telephone: '+91-44-24962590',
            contactType: 'customer service',
            email: 'lohanrajoliat@gmail.com',
            availableLanguage: ['English', 'Tamil', 'Hindi']
        }
    ],
    knowsAbout: [
        'BMS Panels',
        'IP55 Enclosures',
        'IP65 Enclosures',
        'IP66 Enclosures',
        'Stainless Steel SS316 Enclosures',
        'Industrial Junction Boxes',
        'Polyurethane Foam Gasketing',
        'CNC Laser Cutting & Bending'
    ]
};

const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://lohanrajo.netlify.app/#website',
    name: 'LIAT - Lohanrajo Industries and Technologies',
    url: 'https://lohanrajo.netlify.app',
    publisher: {
        '@id': 'https://lohanrajo.netlify.app/#organization'
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://lohanrajo.netlify.app/products?q={search_term_string}',
        'query-input': 'required name=search_term_string'
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${playfair.variable}`}>
            <head>
                {/* Anti-flash script: must run synchronously before paint */}
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
                {/* Global Schema.org Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
                />
            </head>
            <body suppressHydrationWarning className={`font-sans bg-brand-bg text-brand-text selection:bg-brand-accent selection:text-brand-bg flex flex-col min-h-screen antialiased overflow-x-hidden max-w-full`}>
                <ThemeProvider>
                    <ImageProtection />
                    <AnimatedBackground />
                    <ClarityScript />
                    <Navbar />
                    <main className="flex-grow pb-16 w-full max-w-full overflow-x-hidden">
                        {children}
                    </main>
                    <Footer />
                    {/* Chatbot replaces the ScrollToTop button */}
                    <ChatBot />
                </ThemeProvider>
            </body>
        </html>
    );
}
