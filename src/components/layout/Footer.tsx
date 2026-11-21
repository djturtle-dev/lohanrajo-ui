import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export default async function Footer() {
    let footerData: any = null;
    try {
        footerData = await (prisma as any).footerContent.findUnique({
            where: { id: 'singleton' }
        });
    } catch {
        // Fallback to static defaults if DB or connection is unavailable
    }

    const defaultContactLinks = [
        { label: 'lohanrajoliat@gmail.com', href: 'mailto:lohanrajoliat@gmail.com' },
        { label: 'Send a Message', href: '/contact' },
        { label: 'Careers', href: '/contact?type=CAREER' },
    ];

    const defaultProductLinks = [
        { label: 'BMS Panels', href: '/products' },
        { label: 'IP Enclosures', href: '/products' },
        { label: 'Reflectors', href: '/products' },
        { label: 'Industrial Poles', href: '/products' },
    ];

    const contactLinks: Array<{ label: string; href: string }> = 
        (footerData?.contactLinks && Array.isArray(footerData.contactLinks) && footerData.contactLinks.length > 0)
            ? footerData.contactLinks
            : defaultContactLinks;

    const productLinks: Array<{ label: string; href: string }> = 
        (footerData?.productLinks && Array.isArray(footerData.productLinks) && footerData.productLinks.length > 0)
            ? footerData.productLinks
            : defaultProductLinks;

    const companyDesc = footerData?.companyDesc || "Passionate about manufacturing high quality engineering products since 1992. Chennai, India.";

    return (
        <footer className="relative z-10 border-t border-brand-border bg-brand-panel py-12 px-4 sm:px-8 mt-auto">
            <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left 1/2: Logo & Info */}
                <div className="pr-0 lg:pr-12 lg:border-r lg:border-brand-border/50">
                    <div className="mb-6 block">
                        <Image 
                            src="/Footer-logo.png" 
                            alt="Lohanrajo Logo" 
                            width={400} 
                            height={120} 
                            className="w-[200px] sm:w-[260px] md:w-[320px] h-auto object-contain" 
                            priority
                        />
                    </div>
                    <p className="text-brand-muted text-sm leading-relaxed font-mono">
                        {companyDesc}
                    </p>
                </div>
                
                {/* Right 1/2: Nested 1/3 Grid for Links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-brand-text mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-brand-muted font-mono">
                            <li><Link href="/about" className="hover:text-brand-accent transition-colors block">Profile</Link></li>
                            <li><Link href="/about#infrastructure" className="hover:text-brand-accent transition-colors block">Infrastructure</Link></li>
                            <li><Link href="/about#mission" className="hover:text-brand-accent transition-colors block">Mission</Link></li>
                            <li><Link href="/about#vision" className="hover:text-brand-accent transition-colors block">Vision</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-accent transition-colors block">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-brand-text mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-brand-muted font-mono">
                            {contactLinks.map((link, idx) => {
                                const isExternal = link.href.startsWith('mailto:') || link.href.startsWith('http');
                                return (
                                    <li key={idx}>
                                        {isExternal ? (
                                            <a href={link.href} className="hover:text-brand-accent transition-colors block break-words">
                                                {link.label}
                                            </a>
                                        ) : (
                                            <Link href={link.href} className="hover:text-brand-accent transition-colors block break-words">
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-brand-text mb-4">Products</h4>
                        <ul className="space-y-2 text-sm text-brand-muted font-mono">
                            {productLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-brand-accent transition-colors block break-words">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto mt-12 pt-8 border-t border-brand-border text-xs text-brand-muted flex flex-col sm:flex-row justify-between items-center text-center sm:text-left font-mono tracking-widest uppercase gap-4">
                <div>&copy; {new Date().getFullYear()} LOHANRAJO INDUSTRIES AND TECHNOLOGIES PRIVATE LIMITED. All rights reserved.</div>
                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link>
                    <a href="/llms.txt" className="hover:text-brand-accent transition-colors">AI Context (llms.txt)</a>
                </div>
            </div>
        </footer>
    );
}
