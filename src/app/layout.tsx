import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClarityScript from "@/components/ClarityScript";
import ChatBot from "@/components/ChatBot";
import AnimatedBackground from "@/components/AnimatedBackground";
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
    title: "LIAT - LOHANRAJO INDUSTRIES AND TECHNOLOGIES | Industrial Enclosures & Panels",
    description: "Professional manufacturer of BMS Panels, IP Standard Enclosures, Reflectors, and more.",
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
            </head>
            <body suppressHydrationWarning className={`font-sans bg-brand-bg text-brand-text selection:bg-brand-accent selection:text-brand-bg flex flex-col min-h-screen antialiased overflow-x-hidden max-w-full`}>
                <ThemeProvider>
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
