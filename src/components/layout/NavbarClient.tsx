'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, useScroll, useTransform, useMotionValueEvent, animate, useMotionValue, AnimatePresence } from 'framer-motion';
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
                "group relative py-1 hover:text-brand-accent transition-colors text font-bold uppercase tracking-widest font-oswald flex items-center gap-1 flex-shrink-0",
                isActive ? "text-brand-accent" : "text-brand-text/80",
                className
            )}
        >
            {children}
            <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full rounded-full"
                initial={false}
                animate={{ width: isActive ? '100%' : '0%' }}
            />
        </Link>
    );
}

export default function NavbarClient({ children }: { children?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { scrollY } = useScroll();
    
    // Create a progress value that goes from 0 (expanded) to 1 (collapsed)
    const progress = useMotionValue(0);

    const [isScrolled, setIsScrolled] = useState(false);
    const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
    const lastScrollY = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
        
        // Auto-collapse if they scroll down further
        if (latest > lastScrollY.current + 10 && isManuallyExpanded) {
            setIsManuallyExpanded(false);
        }
        lastScrollY.current = latest;
    });

    const isCollapsed = isScrolled && !isOpen && !isManuallyExpanded;

    useEffect(() => {
        if (isCollapsed) {
            // Collapse smoothly when scrolled down
            animate(progress, 1, { duration: 0.1, ease: "easeOut" });
        } else {
            // Expand smoothly when reaching the top or opening menu
            animate(progress, 0, { duration: 0.1, ease: "easeOut" });
        }
    }, [isCollapsed, progress]);

    // Map the progress to exact CSS values
    const navMaxWidth = useTransform(progress, [0, 1], ["100vw", "38rem"]); // 100vw down to ~608px
    const linksOpacity = useTransform(progress, [0, 0.5], [1, 0]);
    const linksBlur = useTransform(progress, [0, 0.5], ["blur(0px)", "blur(10px)"]);
    const gridColumns = useTransform(progress, [0.2, 1], ["1fr", "0fr"]);
    const linksPadding = useTransform(progress, [0.2, 1], ["24px", "0px"]);

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
            <motion.nav 
                style={{ "--desk-max-w": navMaxWidth } as any}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center h-16 md:h-18 px-4 md:px-6 shadow-xl w-[75%] md:w-[95%] max-w-full md:max-w-[var(--desk-max-w)] nav-glass"
            >
                <div className="flex items-center justify-between w-full gap-4 md:gap-8">
                    <div className="flex items-center flex-shrink-0">
                        {/* Logo & Stats passed as children from Server component */}
                        {children}
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center overflow-visible">
                        <motion.div 
                            style={{ 
                                display: "grid", 
                                gridTemplateColumns: gridColumns,
                                opacity: linksOpacity,
                                filter: linksBlur,
                                paddingRight: linksPadding
                            }}
                        >
                            <div className="overflow-hidden flex items-center gap-6 whitespace-nowrap">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        href={link.href}
                                        isActive={isLinkActive(link.href)}
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                            </div>
                        </motion.div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link
                                href="/products"
                                className={cn(
                                    "px-6 py-2.5 text-sm font-bold uppercase tracking-widest font-oswald transition-colors duration-300 ease-in-out flex-shrink-0 whitespace-nowrap btn-glass-primary cursor-pointer"
                                )}
                            >
                                Products
                            </Link>

                            {/* Theme toggle — always visible on desktop */}
                            <ThemeToggle />
                            
                            <AnimatePresence>
                                {isScrolled && (
                                    <motion.button
                                        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                        animate={{ opacity: 1, width: 40, marginLeft: 0 }}
                                        exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => setIsManuallyExpanded(!isManuallyExpanded)}
                                        className="h-10 rounded-full btn-glass-secondary flex-shrink-0 hover:scale-105 flex items-center justify-center cursor-pointer"
                                        aria-label="Toggle Navigation"
                                    >
                                        <motion.div
                                            animate={{ rotate: isManuallyExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-center justify-center min-w-[20px]"
                                        >
                                            {isManuallyExpanded ? <X className="w-5 h-5" style={{ color: 'var(--th-text)' }} /> : <Menu className="w-5 h-5" style={{ color: 'var(--th-text)' }} />}
                                        </motion.div>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile controls: theme toggle + burger */}
                    <div className="md:hidden flex items-center gap-2 ml-2">
                        <ThemeToggle />
                        <button
                            className="p-2 rounded-full btn-glass-secondary flex-shrink-0 transition-transform hover:scale-105 flex items-center justify-center cursor-pointer z-50"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X className="w-5 h-5" style={{ color: 'var(--th-text)' }} /> : <Menu className="w-5 h-5" style={{ color: 'var(--th-text)' }} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 backdrop-blur-lg transform transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                style={{ backgroundColor: 'var(--th-overlay-bg)' }}
            >
                <div className="flex flex-col items-center justify-center space-y-10 w-full px-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-4xl font-oswald uppercase tracking-widest transition-colors",
                                isLinkActive(link.href) ? "text-brand-accent font-black tracking-tighter" : "text-brand-text hover:text-brand-accent"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/products"
                        className={cn(
                            "text-4xl font-oswald uppercase tracking-widest transition-colors",
                            pathname.startsWith('/products') ? "text-brand-accent font-bold shadow-[0_0_15px_rgba(184,36,29,0.4)] px-6 py-2 border border-brand-accent rounded-full" : "text-brand-text hover:text-brand-accent"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        Products
                    </Link>

                    <div className="pt-8 border-t border-brand-border w-full flex justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center text-brand-accent font-oswald font-bold tracking-widest uppercase hover:gap-4 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Get an Estimate <ArrowRight className="ml-2 w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
