import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="border-t border-brand-border bg-white py-12 px-4 sm:px-8 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <Image src="/logo.png" alt="LOHANRAJO Metal Arts" width={140} height={50} className="h-12 w-auto mb-4" />
                    <p className="text-brand-muted text-sm leading-relaxed">
                        Passionate about manufacturing high quality engineering products since 1992. Chennai, India.
                    </p>
                </div>
                <div>
                    <h4 className="font-oswald font-bold text-sm tracking-widest uppercase text-brand-text mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-brand-muted">
                        <li><Link href="/about" className="hover:text-brand-accent transition-colors block">Profile</Link></li>
                        <li><Link href="/about#infrastructure" className="hover:text-brand-accent transition-colors block">Infrastructure</Link></li>
                        <li><Link href="/about#accreditation" className="hover:text-brand-accent transition-colors block">Accreditation</Link></li>
                        <li><Link href="/about#vision" className="hover:text-brand-accent transition-colors block">Vision</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-oswald font-bold text-sm tracking-widest uppercase text-brand-text mb-4">Contact</h4>
                    <ul className="space-y-2 text-sm text-brand-muted">
                        <li><a href="mailto:info@lohanrajo.com" className="hover:text-brand-accent transition-colors block">info@lohanrajo.com</a></li>
                        <li><Link href="/contact" className="hover:text-brand-accent transition-colors block">Send a Message</Link></li>
                        <li><Link href="/contact?type=CAREER" className="hover:text-brand-accent transition-colors block">Careers</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-brand-border text-xs text-brand-muted flex justify-between items-center font-oswald tracking-widest uppercase basis-1 sm:basis-1/2">
                <div className=''>&copy; {new Date().getFullYear()} LOHANRAJO Metal Arts. All rights reserved.</div>
                <div className=''>AN ISO 9001:2015 Certified Company</div>
            </div>
        </footer>
    );
}
