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

    // Sync internal query state with prop when URL changes
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

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
        if (query.trim()) {
            searchParams.set('query', query.trim());
        }
        router.push(`/products?${searchParams.toString()}`);
    };

    const hasResults = results && (results.products.length > 0 || results.categories.length > 0 || results.subCategories.length > 0);

    return (
        <div className="relative w-full">
            <form onSubmit={handleSubmit} className="relative z-20 flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (hasResults) setIsOpen(true);
                    }}
                    placeholder="products ..."
                    className="w-full bg-th-input border border-brand-border px-4 py-2.5 pl-10 pr-24 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm font-sans shadow-xs"
                    autoComplete="off"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
                <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-glass-secondary px-3.5 py-1 text-xs font-playfair italic font-bold rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                >
                    Search
                </button>
                {isLoading && (
                    <div className="absolute right-20 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-brand-muted border-t-brand-accent rounded-full animate-spin pointer-events-none" />
                )}
            </form>

            {/* Dropdown Menu */}
            {isOpen && hasResults && (
                <div 
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0c0c0c] border border-brand-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                >
                    <div className="max-h-96 overflow-y-auto py-2 divide-y divide-brand-border/20">
                        {results.categories.length > 0 && (
                            <div className="pb-2">
                                <h4 className="px-4 py-1 text-xs font-sans font-semibold tracking-wider uppercase text-brand-muted/70 bg-brand-panel/40">Categories</h4>
                                {results.categories.map(cat => (
                                    <Link 
                                        key={`cat-${cat.id}`} 
                                        href={`/products?category=${cat.id}`}
                                        className="px-4 py-2 hover:bg-brand-panel flex items-center justify-between group transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-brand-text font-sans text-sm tracking-wide group-hover:text-brand-accent transition-colors">{cat.name}</span>
                                        <ChevronRight className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {results.subCategories.length > 0 && (
                            <div className="py-2">
                                <h4 className="px-4 py-1 text-xs font-sans font-semibold tracking-wider uppercase text-brand-muted/70 bg-brand-panel/40">Sub-Categories</h4>
                                {results.subCategories.map(sub => (
                                    <Link 
                                        key={`sub-${sub.id}`} 
                                        href={`/products?category=${sub.categoryId}&subCategory=${sub.id}`}
                                        className="px-4 py-2 hover:bg-brand-panel flex items-center justify-between group transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-brand-text font-sans text-sm tracking-wide group-hover:text-brand-accent transition-colors">{sub.name}</span>
                                        <ChevronRight className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {results.products.length > 0 && (
                            <div className="pt-2">
                                <h4 className="px-4 py-1 text-xs font-sans font-semibold tracking-wider uppercase text-brand-muted/70 bg-brand-panel/40">Products</h4>
                                {results.products.map(prod => (
                                    <Link 
                                        key={`prod-${prod.id}`} 
                                        href={`/products/${prod.id}`}
                                        className="px-4 py-2 hover:bg-brand-panel flex items-center justify-between group transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-brand-text font-sans text-sm tracking-wide group-hover:text-brand-accent transition-colors">{prod.name}</span>
                                        <ChevronRight className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-t border-brand-border/40 p-2.5 bg-brand-panel/30">
                        <button 
                            onClick={handleSubmit}
                            className="w-full text-center text-xs font-sans font-semibold tracking-wider uppercase text-brand-accent hover:underline transition-colors"
                        >
                            See all results for "{query}"
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
