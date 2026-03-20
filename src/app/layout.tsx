import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "LOHANRAJO Metal Arts | Industrial Enclosures & Panels",
    description: "Professional manufacturer of BMS Panels, IP Standard Enclosures, Reflectors, and more.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
            <body className={`font-sans bg-brand-white text-brand-text selection:bg-brand-accent selection:text-brand-dark flex flex-col min-h-screen`}>
                <Navbar />
                <main className="flex-grow pt-24 pb-16 w-full">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
