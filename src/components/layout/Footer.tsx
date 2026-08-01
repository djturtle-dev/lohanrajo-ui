import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-brand-border bg-brand-panel py-12 px-4 sm:px-8 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left 1/2: Logo & Info */}
                <div className="pr-0 lg:pr-12 lg:border-r lg:border-brand-border/50">
                    <div className="flex items-center gap-4 mb-4">
                        <Image src="/logo.svg" alt="Lohanrajo Logo" width={50} height={50} className="h-12 w-auto" />
                        <Image src="/Footer-logo.png" alt="LIAT" width={140} height={50} className="h-12 w-auto" />
                    </div>
                    <p className="text-brand-muted text-sm leading-relaxed font-mono">
                        Passionate about manufacturing high quality engineering products since 1992. Chennai, India.
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
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-brand-text mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-brand-muted font-mono">
                            <li><a href="mailto:lohanrajoliat@gmail.com" className="hover:text-brand-accent transition-colors block break-words">lohanrajoliat@gmail.com</a></li>
                            <li><Link href="/contact" className="hover:text-brand-accent transition-colors block">Send a Message</Link></li>
                            <li><Link href="/contact?type=CAREER" className="hover:text-brand-accent transition-colors block">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-brand-text mb-4">Products</h4>
                        <ul className="space-y-2 text-sm text-brand-muted font-mono">
                            <li><Link href="/products" className="hover:text-brand-accent transition-colors block">BMS Panels</Link></li>
                            <li><Link href="/products" className="hover:text-brand-accent transition-colors block">IP Enclosures</Link></li>
                            <li><Link href="/products" className="hover:text-brand-accent transition-colors block">Reflectors</Link></li>
                            <li><Link href="/products" className="hover:text-brand-accent transition-colors block">Industrial Poles</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-brand-border text-xs text-brand-muted flex flex-col md:flex-row justify-start items-center md:items-start text-center md:text-left font-mono tracking-widest uppercase">
                <div>&copy; {new Date().getFullYear()} LOHANRAJO INDUSTRIES AND TECHNOLOGIES PRIVATE LIMITED. All rights reserved.</div>
            </div>
        </footer>
    );
}
