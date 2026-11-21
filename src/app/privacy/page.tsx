import type { Metadata } from 'next';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | LIAT Enclosures & Control Panels',
    description: 'Privacy Policy and data protection standards of Lohanrajo Industries and Technologies Private Limited (LIAT).',
    alternates: {
        canonical: '/privacy',
    },
    openGraph: {
        title: 'Privacy Policy | LIAT',
        description: 'Privacy Policy and data protection standards of Lohanrajo Industries and Technologies Private Limited (LIAT).',
        url: 'https://lohanrajo.netlify.app/privacy',
        images: ['/Footer-logo.png'],
    },
    twitter: {
        card: 'summary',
        title: 'Privacy Policy | LIAT',
        description: 'Privacy Policy and data protection standards of Lohanrajo Industries and Technologies Private Limited (LIAT).',
        images: ['/Footer-logo.png'],
    },
};

export default function PrivacyPage() {
    return (
        <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 sm:px-8 pt-24 md:pt-32 pb-24 max-w-4xl">
            <ScrollReveal direction="down" className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-sans text-brand-muted hover:text-brand-accent transition-colors uppercase tracking-wider"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Home</span>
                </Link>
            </ScrollReveal>

            <ScrollReveal direction="up" className="space-y-8">
                <div className="border-b border-brand-border/60 pb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-panel border border-brand-border text-xs text-brand-accent font-mono mb-4">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ISO 9001:2015 Certified Compliance</span>
                    </div>
                    <h1 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl text-brand-text">
                        Privacy Policy
                    </h1>
                    <p className="text-xs font-mono text-brand-muted mt-2">
                        Last Updated: November 2026 • Lohanrajo Industries & Technologies Private Limited
                    </p>
                </div>

                <div className="space-y-6 text-sm text-brand-text/90 font-sans leading-relaxed">
                    <section className="space-y-3 card-glass p-6 border border-brand-border/60 rounded-xl">
                        <h2 className="font-sans font-bold text-base text-brand-text uppercase tracking-wider">
                            1. Commitment to Privacy
                        </h2>
                        <p>
                            LOHANRAJO INDUSTRIES AND TECHNOLOGIES PRIVATE LIMITED ("LIAT", "we", "us", or "our") respects your privacy and is dedicated to protecting the information you share with us through our website (lohanrajo.netlify.app) and quotation workflows.
                        </p>
                    </section>

                    <section className="space-y-3 card-glass p-6 border border-brand-border/60 rounded-xl">
                        <h2 className="font-sans font-bold text-base text-brand-text uppercase tracking-wider">
                            2. Information We Collect
                        </h2>
                        <p>
                            When you submit an engineering quotation or contact request, we collect contact information you explicitly provide:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-brand-muted font-mono text-xs pl-2">
                            <li>Name, email address, phone number, and organization.</li>
                            <li>Product specifications, dimensions, tagged catalog items, and technical requirements.</li>
                            <li>Optional engineering drawings or CAD files attached for fabrication review.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 card-glass p-6 border border-brand-border/60 rounded-xl">
                        <h2 className="font-sans font-bold text-base text-brand-text uppercase tracking-wider">
                            3. Use of Information
                        </h2>
                        <p>
                            Information submitted is used exclusively for:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-brand-muted font-mono text-xs pl-2">
                            <li>Generating accurate industrial quotations and technical cost estimates.</li>
                            <li>Direct sales communication, order tracking, and delivery fulfillment.</li>
                            <li>Ensuring quality compliance adhering to ISO 9001:2015 manufacturing traceability.</li>
                        </ul>
                        <p className="text-xs text-brand-muted">
                            We do not sell, rent, or monetize your contact or commercial information to third-party advertisers.
                        </p>
                    </section>

                    <section className="space-y-3 card-glass p-6 border border-brand-border/60 rounded-xl">
                        <h2 className="font-sans font-bold text-base text-brand-text uppercase tracking-wider">
                            4. Cookies & Security
                        </h2>
                        <p>
                            Our website utilizes minimal local storage solely to preserve user preferences (such as Light/Dark theme mode). We implement standard SSL/TLS encryption across all communications and maintain strict security protocols on our cloud and database infrastructure.
                        </p>
                    </section>

                    <section className="space-y-3 card-glass p-6 border border-brand-border/60 rounded-xl">
                        <h2 className="font-sans font-bold text-base text-brand-text uppercase tracking-wider">
                            5. Contact Governance
                        </h2>
                        <p>
                            For inquiries concerning data privacy or to request removal of your quotation records, please reach out directly:
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-xs font-mono text-brand-accent">
                            <Mail className="w-4 h-4 shrink-0" />
                            <span>lohanrajoliat@gmail.com</span>
                        </div>
                    </section>
                </div>
            </ScrollReveal>
        </div>
    );
}
