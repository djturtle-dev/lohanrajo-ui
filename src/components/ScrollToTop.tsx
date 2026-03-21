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
            className={`fixed bottom-4 right-4 bg-brand-white text-brand-text border-brand-text hover:text-brand-accent border-2 hover:border-brand-accent p-2 shadow-lg transition-all ease-in-out duration-400 z-50 ${
                isVisible ? 'opacity-100 translate-y-0 cursor-pointer' : 'opacity-0 pointer-events-none translate-y-2'
            }`}
            aria-label="Scroll to top"
        >
            <ArrowUp size={20} />
        </button>
    );
}
