'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AutocompleteResults {
    products: { id: string; name: string; categoryId: string }[];
    categories: { id: string; name: string }[];
    subCategories: { id: string; name: string; categoryId: string }[];
}

export default function SearchAutocomplete({ initialQuery = '', initialCategory = '' }: { initialQuery?: string, initialCategory?: string }) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<AutocompleteResults | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults(null);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setIsOpen(true);
                }
            } catch (err) {
                console.error("Autocomplete fetch failed:", err);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);
        const searchParams = new URLSearchParams();
        if (query) searchParams.set('query', query);
        if (initialCategory) searchParams.set('category', initialCategory);
        router.push(`/products?${searchParams.toString()}`);
    };

    const hasResults = results && (results.products.length > 0 || results.categories.length > 0 || results.subCategories.length > 0);

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="relative z-20">
                <input
                    ref={inputRef}
                    type="text"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (hasResults) setIsOpen(true);
                    }}
                    placeholder="Search products, categories..."
                    className="w-full bg-brand-panel border border-brand-border px-4 py-3 pl-10 text-brand-text focus:outline-none focus:border-brand-accent transition-colors block"
                    autoComplete="off"
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-brand-muted" />
                {isLoading && (
                    <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-brand-muted border-t-brand-accent rounded-full animate-spin" />
                )}
            </form>

            {/* Dropdown Menu */}
            {isOpen && hasResults && (
                <div 
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-brand-border/50 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                    <div className="max-h-96 overflow-y-auto py-2">
                        {results.categories.length > 0 && (
                            <div className="mb-2">
                                <h4 className="px-4 py-1 text-xs font-oswald tracking-widest uppercase text-brand-muted/60 bg-brand-dark/50">Categories</h4>
                                {results.categories.map(cat => (
                                    <Link 
                                        key={`cat-${cat.id}`} 
                                        href={`/products?category=${cat.id}`}
                                        className="px-4 py-2 hover:bg-brand-panel flex items-center justify-between group transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-white/90 font-sans text-sm tracking-wide">{cat.name}</span>
                                        <ChevronRight className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {results.subCategories.length > 0 && (
                            <div className="mb-2">
                                <h4 className="px-4 py-1 text-xs font-oswald tracking-widest uppercase text-brand-muted/60 bg-brand-dark/50">Sub-Categories</h4>
                                {results.subCategories.map(sub => (
                                    <Link 
                                        key={`sub-${sub.id}`} 
                                        href={`/products?category=${sub.categoryId}&query=${encodeURIComponent(sub.name)}`}
                                        className="px-4 py-2 hover:bg-brand-panel flex items-center justify-between group transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-white/90 font-sans text-sm tracking-wide">{sub.name}</span>
                                        <ChevronRight className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {results.products.length > 0 && (
                            <div>
                                <h4 className="px-4 py-1 text-xs font-oswald tracking-widest uppercase text-brand-muted/60 bg-brand-dark/50">Products</h4>
                                {results.products.map(prod => (
                                    <Link 
                                        key={`prod-${prod.id}`} 
                                        href={`/products/${prod.id}`}
                                        className="px-4 py-2 hover:bg-brand-panel flex items-center justify-between group transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-white/90 font-sans text-sm tracking-wide">{prod.name}</span>
                                        <ChevronRight className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-t border-brand-border/50 p-2 bg-brand-dark/30">
                        <button 
                            onClick={handleSubmit}
                            className="w-full text-center text-xs font-sans tracking-widest uppercase text-brand-accent hover:text-white transition-colors"
                        >
                            See all results for "{query}"
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
