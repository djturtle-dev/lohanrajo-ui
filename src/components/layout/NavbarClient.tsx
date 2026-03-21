'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    isActive?: boolean;
}

function NavLink({ href, children, onClick, className, isActive }: NavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "group relative py-1 hover:text-brand-accent transition-colors text font-bold uppercase tracking-widest font-oswald flex items-center gap-1",
                isActive ? "text-brand-accent" : "text-brand-text/80",
                className
            )}
        >
            {children}
            <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"
                initial={false}
                animate={{ width: isActive ? '100%' : '0%' }}
            />
        </Link>
    );
}

export default function NavbarClient({ children }: { children?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const isLinkActive = (href: string) => {
        if (href === '/') return pathname === '/';
        if (href.startsWith('/#')) return pathname === '/' && typeof window !== 'undefined' && window.location.hash === href.substring(1);
        return pathname.startsWith(href);
    };

    return (
        <>
            <nav className="fixed w-full z-50 bg-brand-white/95 backdrop-blur-md border-b border-brand-border flex items-center h-20 px-4 sm:px-8 top-0 transition-all duration-300 shadow-sm">
                <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 sm:gap-8">
                        {/* Logo & Stats passed as children from Server component */}
                        {children}
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                href={link.href}
                                isActive={isLinkActive(link.href)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <Link
                            href="/products"
                            className={cn(
                                "px-4 py-2 text font-bold uppercase tracking-widest font-oswald transition-all duration-500 ease-in-out",
                                pathname.startsWith('/products')
                                    ? "bg-brand-white text-brand-accent border-b-2 border-brand-accent"
                                    : "bg-brand-accent text-white hover:bg-brand-text shadow-lg hover:shadow-brand-accent/20 hover:-translate-y-0.5 "
                            )}
                        >
                            Products
                        </Link>
                    </div>

                    {/* Mobile burger button */}
                    <button
                        className="md:hidden text-brand-text hover:text-brand-accent transition-colors z-50"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col h-full pt-38 px-8 space-y-8 overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-3xl font-oswald uppercase tracking-widest transition-colors",
                                isLinkActive(link.href) ? "text-brand-accent font-black tracking-tighter" : "text-brand-text"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/products"
                        className={cn(
                            "text-3xl font-oswald uppercase tracking-widest transition-colors",
                            pathname.startsWith('/products') ? "text-brand-accent font-bold" : "text-brand-text"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        Products
                    </Link>

                    <div className="pt-8 border-t border-brand-border">
                        <Link
                            href="/contact"
                            className="inline-flex items-center text-brand-accent font-oswald font-bold tracking-widest uppercase hover:gap-2 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Get an Estimate <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
