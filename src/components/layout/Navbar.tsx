import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ReviewSourceAnimation from '../ReviewSourceAnimation';
import NavbarClient from './NavbarClient';
import { Star } from 'lucide-react';

export default async function Navbar() {
    let sourceStats = [
        { name: 'Google', rating: 5.0, count: 20 },
        { name: 'Justdial', rating: 5.0, count: 12 },
        { name: 'WhatsApp', rating: 5.0, count: 8 },
        { name: 'Mail', rating: 5.0, count: 2 } // mail + direct
    ];

    try {
        const testimonials = await prisma.testimonial.findMany({
            select: {
                rating: true,
                source: true
            }
        });

        if (testimonials.length > 0) {
            const grouped = testimonials.reduce((acc: any, curr) => {
                let source = curr.source?.toLowerCase() || 'direct';
                if (source === 'e-mail' || source === 'email' || source === 'direct') {
                    source = 'mail';
                }
                if (!acc[source]) acc[source] = { sum: 0, count: 0 };
                acc[source].sum += curr.rating || 5;
                acc[source].count += 1;
                return acc;
            }, {});

            sourceStats = [
                {
                    name: 'Google',
                    rating: grouped.google ? grouped.google.sum / grouped.google.count : 5.0,
                    count: grouped.google ? grouped.google.count : 0
                },
                {
                    name: 'Justdial',
                    rating: grouped.justdial ? grouped.justdial.sum / grouped.justdial.count : 5.0,
                    count: grouped.justdial ? grouped.justdial.count : 0
                },
                {
                    name: 'WhatsApp',
                    rating: grouped.whatsapp ? grouped.whatsapp.sum / grouped.whatsapp.count : 5.0,
                    count: grouped.whatsapp ? grouped.whatsapp.count : 0
                },
                {
                    name: 'Mail',
                    rating: grouped.mail ? grouped.mail.sum / grouped.mail.count : 5.0,
                    count: grouped.mail ? grouped.mail.count : 0
                }
            ];
        }
    } catch (error) {
        console.error("Error fetching testimonial stats:", error);
    }

    return (
        <NavbarClient>
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center transition-opacity hover:opacity-80 cursor-pointer">
                    <Image
                        src="/new logo.jpeg"
                        alt="LOHANRAJO Metal Arts"
                        width={200}
                        height={80}
                        className="h-10 sm:h-12 w-auto object-contain rounded-full"
                        priority
                    />
                </Link>
                {/* Testimonial Stats Pill (Hidden on extreme mobile to save pill space) */}
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-brand-panel/50 rounded-full text-white group h-8 min-w-24 transition-all border border-brand-border/50">
                    <ReviewSourceAnimation stats={sourceStats} />
                </div>
            </div>
        </NavbarClient>
    );
}
