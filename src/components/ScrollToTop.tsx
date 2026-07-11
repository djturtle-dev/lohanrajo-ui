'use client';

import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const lenis = useLenis();

    const scrollToTop = () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center btn-glass-primary z-50 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0 cursor-pointer' : 'opacity-0 pointer-events-none translate-y-8'
            }`}
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} strokeWidth={2.5} />
        </button>
    );
}
