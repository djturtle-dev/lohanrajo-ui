import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Poppins, Forum } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClarityScript from "@/components/ClarityScript";
import SmoothScroller from "@/components/SmoothScroller";
import AnimatedBackground from "@/components/AnimatedBackground";
import ChatBot from "@/components/ChatBot";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ['normal', 'italic'], variable: "--font-cormorant" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });
const forum = Forum({ subsets: ["latin"], weight: ["400"], variable: "--font-forum" });

export const metadata: Metadata = {
    title: "LIAT - LOHANRAJO INDUSTRIES AND TECHNOLOGIES | Industrial Enclosures & Panels",
    description: "Professional manufacturer of BMS Panels, IP Standard Enclosures, Reflectors, and more.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${cormorant.variable} ${poppins.variable} ${forum.variable}`}>
            <body suppressHydrationWarning className={`font-serif bg-brand-bg text-brand-text selection:bg-brand-accent selection:text-brand-bg flex flex-col min-h-screen antialiased`}>
                <AnimatedBackground />
                <SmoothScroller>
                    <ClarityScript />
                    <Navbar />
                    <main className="flex-grow pb-16 w-full">
                        {children}
                    </main>
                    <Footer />
                    {/* Chatbot replaces the ScrollToTop button */}
                    <ChatBot />
                </SmoothScroller>
            </body>
        </html>
    );
}
