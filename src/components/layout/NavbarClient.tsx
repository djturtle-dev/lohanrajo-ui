'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
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
                "group relative py-1 hover:text-brand-accent transition-colors text font-bold font-playfair italic flex items-center gap-1 flex-shrink-0",
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

    const [isScrolled, setIsScrolled] = useState(false);
    const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
    const lastScrollY = useRef(0);
    const expandedAtScrollY = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const scrolled = latest > 30;
        setIsScrolled(scrolled);

        // Auto-collapse only if they scroll significantly after manually expanding
        if (isManuallyExpanded && Math.abs(latest - expandedAtScrollY.current) > 80) {
            setIsManuallyExpanded(false);
        }
        lastScrollY.current = latest;
    });

    const isCollapsed = isScrolled && !isOpen && !isManuallyExpanded;

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
        setIsManuallyExpanded(false);
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

    const NAV_SPRING = {
        type: "spring" as const,
        stiffness: 260,
        damping: 28,
        mass: 0.7
    };

    return (
        <>
            <motion.nav
                initial={false}
                animate={{
                    top: isScrolled ? 16 : 0,
                    width: isScrolled 
                        ? (isManuallyExpanded ? "min(96%, 1060px)" : "min(92%, 520px)") 
                        : "100%",
                    borderRadius: isScrolled ? 9999 : 0,
                    height: isScrolled ? 64 : 76,
                    boxShadow: isScrolled
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15)"
                        : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                }}
                transition={NAV_SPRING}
                className={cn(
                    "fixed left-1/2 -translate-x-1/2 z-50 flex items-center px-4 md:px-8 overflow-hidden",
                    isScrolled
                        ? "nav-glass"
                        : "backdrop-blur-xl bg-brand-bg/90 border-b border-brand-border/40"
                )}
            >
                <div className="flex items-center justify-between w-full gap-4 md:gap-8 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto">
                    <div className="flex items-center flex-shrink-0">
                        {/* Logo & Stats passed as children from Server component */}
                        {children}
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center overflow-visible">
                        <AnimatePresence initial={false}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={NAV_SPRING}
                                    className="overflow-hidden flex items-center"
                                >
                                    <div className="flex items-center gap-6 pr-5 whitespace-nowrap flex-shrink-0">
                                        {navLinks.map((link) => (
                                            <NavLink
                                                key={link.name}
                                                href={link.href}
                                                isActive={isLinkActive(link.href)}
                                            >
                                                {link.name}
                                            </NavLink>
                                        ))}
                                        <div className="flex items-center flex-shrink-0">
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link
                                href="/products"
                                className="px-6 py-2.5 text-sm font-bold font-playfair italic flex-shrink-0 whitespace-nowrap btn-glass-primary cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
                            >
                                Products
                            </Link>

                            {/* Mini toggle button when scrolled */}
                            <AnimatePresence initial={false}>
                                {isScrolled && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, width: "auto", scale: 1 }}
                                        exit={{ opacity: 0, width: 0, scale: 0.8 }}
                                        transition={NAV_SPRING}
                                        className="overflow-visible flex-shrink-0 flex items-center ml-1"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!isManuallyExpanded) {
                                                    expandedAtScrollY.current = scrollY.get();
                                                }
                                                setIsManuallyExpanded(!isManuallyExpanded);
                                            }}
                                            className="w-10 h-10 rounded-full btn-glass-secondary flex-shrink-0 hover:scale-105 active:scale-95 transition-transform duration-200 flex items-center justify-center cursor-pointer"
                                            aria-label="Toggle Navigation"
                                        >
                                            <AnimatePresence mode="wait" initial={false}>
                                                <motion.div
                                                    key={isManuallyExpanded ? 'close' : 'menu'}
                                                    initial={{ rotate: isManuallyExpanded ? -90 : 90, opacity: 0, scale: 0.7 }}
                                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                                    exit={{ rotate: isManuallyExpanded ? 90 : -90, opacity: 0, scale: 0.7 }}
                                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                                    className="flex items-center justify-center w-5 h-5 flex-shrink-0"
                                                >
                                                    {isManuallyExpanded ? (
                                                        <X className="w-5 h-5" style={{ color: 'var(--th-text)' }} />
                                                    ) : (
                                                        <Menu className="w-5 h-5" style={{ color: 'var(--th-text)' }} />
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile controls: theme toggle (hidden on smallest screen / when minimized) + burger */}
                    <div className="md:hidden flex items-center gap-2 ml-2">
                        <AnimatePresence initial={false}>
                            {!isScrolled && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                                    transition={NAV_SPRING}
                                    className="hidden sm:flex overflow-visible flex-shrink-0 items-center"
                                >
                                    <ThemeToggle />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full btn-glass-secondary flex-shrink-0 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer z-50"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle Menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isOpen ? 'close' : 'menu'}
                                    initial={{ rotate: isOpen ? -90 : 90, opacity: 0, scale: 0.7 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: isOpen ? 90 : -90, opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="flex items-center justify-center w-5 h-5 flex-shrink-0"
                                >
                                    {isOpen ? (
                                        <X className="w-5 h-5" style={{ color: 'var(--th-text)' }} />
                                    ) : (
                                        <Menu className="w-5 h-5" style={{ color: 'var(--th-text)' }} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
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
                                "text-4xl font-playfair italic transition-colors",
                                isLinkActive(link.href) ? "text-brand-accent font-bold" : "text-brand-text hover:text-brand-accent"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/products"
                        className={cn(
                            "text-4xl font-playfair italic transition-colors",
                            pathname.startsWith('/products') ? "text-brand-accent font-bold shadow-[0_0_15px_rgba(184,36,29,0.4)] px-6 py-2 border border-brand-accent rounded-full" : "text-brand-text hover:text-brand-accent"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        Products
                    </Link>

                    <div className="pt-8 border-t border-brand-border w-full flex flex-col items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-playfair italic text-brand-muted">Theme</span>
                            <ThemeToggle />
                        </div>
                        <Link
                            href="/contact"
                            className="inline-flex items-center text-brand-accent font-playfair italic font-bold hover:gap-4 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Get an estimate <ArrowRight className="ml-2 w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
