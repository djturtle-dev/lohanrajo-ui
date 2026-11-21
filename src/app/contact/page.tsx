'use client'

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { submitFeedback } from '@/app/actions';
import { 
    MapPin, 
    Phone, 
    Mail, 
    AlertTriangle, 
    CheckCircle2, 
    XCircle, 
    ChevronDown, 
    Search, 
    X, 
    Package, 
    Loader2 
} from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { getAssetUrl } from '@/lib/utils';

interface TaggedProduct {
    id: string;
    name: string;
    images?: string[];
    category?: { name: string } | null;
    subCategory?: { name: string } | null;
}

/* --- 2D Vector Flag Components --- */
function IndiaFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="India flag">
            <rect width="30" height="20" fill="#FFFFFF" />
            <rect width="30" height="6.67" fill="#FF9933" />
            <rect y="13.33" width="30" height="6.67" fill="#138808" />
            <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.55" />
            <circle cx="15" cy="10" r="0.65" fill="#000080" />
            {[...Array(12)].map((_, i) => (
                <line
                    key={i}
                    x1={15 + 0.65 * Math.cos((i * Math.PI) / 6)}
                    y1={10 + 0.65 * Math.sin((i * Math.PI) / 6)}
                    x2={15 + 2.5 * Math.cos((i * Math.PI) / 6)}
                    y2={10 + 2.5 * Math.sin((i * Math.PI) / 6)}
                    stroke="#000080"
                    strokeWidth="0.32"
                />
            ))}
        </svg>
    );
}

function USFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="United States flag">
            <rect width="30" height="20" fill="#B22234" />
            <path d="M0 2.31h30M0 5.38h30M0 8.46h30M0 11.54h30M0 14.62h30M0 17.69h30" stroke="#FFFFFF" strokeWidth="1.54" />
            <rect width="12" height="10.77" fill="#3C3B6E" />
            <circle cx="2.5" cy="2.2" r="0.5" fill="#FFFFFF" />
            <circle cx="6" cy="2.2" r="0.5" fill="#FFFFFF" />
            <circle cx="9.5" cy="2.2" r="0.5" fill="#FFFFFF" />
            <circle cx="4.25" cy="4.3" r="0.5" fill="#FFFFFF" />
            <circle cx="7.75" cy="4.3" r="0.5" fill="#FFFFFF" />
            <circle cx="2.5" cy="6.4" r="0.5" fill="#FFFFFF" />
            <circle cx="6" cy="6.4" r="0.5" fill="#FFFFFF" />
            <circle cx="9.5" cy="6.4" r="0.5" fill="#FFFFFF" />
            <circle cx="4.25" cy="8.5" r="0.5" fill="#FFFFFF" />
            <circle cx="7.75" cy="8.5" r="0.5" fill="#FFFFFF" />
        </svg>
    );
}

function UKFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="United Kingdom flag">
            <rect width="30" height="20" fill="#012169" />
            <path d="M0 0L30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth="3.2" />
            <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.6" />
            <path d="M15 0v20M0 10h30" stroke="#FFFFFF" strokeWidth="5.6" />
            <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.2" />
        </svg>
    );
}

function UAEFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="United Arab Emirates flag">
            <rect width="30" height="6.67" fill="#00732F" />
            <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
            <rect y="13.34" width="30" height="6.67" fill="#000000" />
            <rect width="8" height="20" fill="#FF0000" />
        </svg>
    );
}

function SGFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="Singapore flag">
            <rect width="30" height="10" fill="#ED2939" />
            <rect y="10" width="30" height="10" fill="#FFFFFF" />
            <circle cx="5" cy="5" r="3.2" fill="#FFFFFF" />
            <circle cx="6.1" cy="5" r="2.8" fill="#ED2939" />
            <circle cx="8" cy="3.5" r="0.45" fill="#FFFFFF" />
            <circle cx="9.2" cy="4.5" r="0.45" fill="#FFFFFF" />
            <circle cx="8.8" cy="5.9" r="0.45" fill="#FFFFFF" />
            <circle cx="7.2" cy="5.9" r="0.45" fill="#FFFFFF" />
            <circle cx="6.8" cy="4.5" r="0.45" fill="#FFFFFF" />
        </svg>
    );
}

function GermanyFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="Germany flag">
            <rect width="30" height="6.67" fill="#000000" />
            <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
            <rect y="13.34" width="30" height="6.67" fill="#FFCE00" />
        </svg>
    );
}

function AUFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="Australia flag">
            <rect width="30" height="20" fill="#00008B" />
            <g transform="scale(0.5)">
                <path d="M0 0L30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth="3.2" />
                <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.6" />
                <path d="M15 0v20M0 10h30" stroke="#FFFFFF" strokeWidth="5.6" />
                <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.2" />
            </g>
            <circle cx="7.5" cy="15" r="1.3" fill="#FFFFFF" />
            <circle cx="22" cy="4" r="0.5" fill="#FFFFFF" />
            <circle cx="25.5" cy="7" r="0.5" fill="#FFFFFF" />
            <circle cx="23.5" cy="11" r="0.5" fill="#FFFFFF" />
            <circle cx="19" cy="10" r="0.5" fill="#FFFFFF" />
            <circle cx="22" cy="15.5" r="0.7" fill="#FFFFFF" />
        </svg>
    );
}

function SAFlag({ className = "w-5 h-3.5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" className={`${className} rounded-[2px] shrink-0 overflow-hidden shadow-xs border border-white/10`} aria-label="Saudi Arabia flag">
            <rect width="30" height="20" fill="#006C35" />
            <path d="M8 9.5h14M8 12.5h14M10 14h10" stroke="#FFFFFF" strokeWidth="0.7" strokeLinecap="round" />
            <path d="M7 16l16 0M21 15l2 1-2 1" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
    );
}

const COUNTRIES = [
    { code: 'IN', dialCode: '+91', name: 'India', Flag: IndiaFlag },
    { code: 'US', dialCode: '+1', name: 'United States', Flag: USFlag },
    { code: 'GB', dialCode: '+44', name: 'United Kingdom', Flag: UKFlag },
    { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', Flag: UAEFlag },
    { code: 'SG', dialCode: '+65', name: 'Singapore', Flag: SGFlag },
    { code: 'DE', dialCode: '+49', name: 'Germany', Flag: GermanyFlag },
    { code: 'AU', dialCode: '+61', name: 'Australia', Flag: AUFlag },
    { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', Flag: SAFlag },
];

// Simple math captcha - no external dependencies needed
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { question: `${a} + ${b}`, answer: (a + b).toString() };
}

function ContactFormContent() {
    const searchParams = useSearchParams();
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [selectedType, setSelectedType] = useState('ENQUIRY');
    const [cvFileName, setCvFileName] = useState('');
    const [captcha, setCaptcha] = useState<{ question: string; answer: string } | null>(null);
    const [captchaInput, setCaptchaInput] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const countryDropdownRef = useRef<HTMLDivElement>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // Product Slash Command State
    const [message, setMessage] = useState('');
    const [taggedProducts, setTaggedProducts] = useState<TaggedProduct[]>([]);
    const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
    const [slashQuery, setSlashQuery] = useState('');
    const [slashMatchIndex, setSlashMatchIndex] = useState(0);
    const [searchResults, setSearchResults] = useState<TaggedProduct[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const slashMenuRef = useRef<HTMLDivElement>(null);

    // Leave / Navigation Warning State
    const router = useRouter();
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);
    const bypassWarningRef = useRef(false);

    // Warn before closing browser / tab or reloading
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (taggedProducts.length > 0 && !bypassWarningRef.current) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [taggedProducts.length]);

    // Intercept in-app navigation link clicks when product tags exist
    useEffect(() => {
        if (taggedProducts.length === 0) return;

        const handleLinkClick = (e: MouseEvent) => {
            if (bypassWarningRef.current) return;

            const anchor = (e.target as HTMLElement)?.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.target === '_blank') {
                return;
            }

            try {
                const currentUrl = new URL(window.location.href);
                const targetUrl = new URL(anchor.href, window.location.href);

                // If navigating to a different page
                if (targetUrl.pathname !== currentUrl.pathname) {
                    e.preventDefault();
                    e.stopPropagation();
                    setPendingNavigationUrl(anchor.href);
                    setShowLeaveModal(true);
                }
            } catch {
                // Ignore parse errors
            }
        };

        document.addEventListener('click', handleLinkClick, true);
        return () => {
            document.removeEventListener('click', handleLinkClick, true);
        };
    }, [taggedProducts]);

    const handleConfirmLeave = () => {
        bypassWarningRef.current = true;
        const target = pendingNavigationUrl;
        setTaggedProducts([]);
        setShowLeaveModal(false);

        if (target) {
            router.push(target);
        }
    };

    const handleCancelLeave = () => {
        setShowLeaveModal(false);
        setPendingNavigationUrl(null);
    };
    
    const isCaptchaValid = captcha !== null && captchaInput.trim() === captcha.answer;
    const isCaptchaWrong = captchaInput.trim() !== '' && captcha !== null && captchaInput.trim() !== captcha.answer;
    const isPhoneValid = phoneNumber.length === 10;

    // Reactively detect URL search params (?product=... or ?productId=... or ?type=...)
    useEffect(() => {
        const type = searchParams.get('type');
        if (type && ['ENQUIRY', 'CONTACT', 'CAREER', 'SUPPORT'].includes(type)) {
            setSelectedType(type);
        }

        const prodId = searchParams.get('productId');
        const prodName = searchParams.get('product');

        if (prodId || prodName) {
            const queryUrl = prodId 
                ? `/api/products/search?id=${encodeURIComponent(prodId)}` 
                : `/api/products/search?q=${encodeURIComponent(prodName!)}`;

            fetch(queryUrl)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.products && data.products.length > 0) {
                        const matched = data.products[0];
                        setTaggedProducts(prev => {
                            if (prev.some(p => p.id === matched.id)) return prev;
                            return [...prev, matched];
                        });
                    } else if (prodName) {
                        setTaggedProducts(prev => {
                            if (prev.some(p => p.name.toLowerCase() === prodName.toLowerCase())) return prev;
                            return [...prev, { id: prodId || `param-${Date.now()}`, name: prodName }];
                        });
                    }
                })
                .catch(() => {
                    if (prodName) {
                        setTaggedProducts(prev => {
                            if (prev.some(p => p.name.toLowerCase() === prodName.toLowerCase())) return prev;
                            return [...prev, { id: prodId || `param-${Date.now()}`, name: prodName }];
                        });
                    }
                });
        }
    }, [searchParams]);

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setIsCountryOpen(false);
            }
            if (
                slashMenuRef.current && 
                !slashMenuRef.current.contains(event.target as Node) &&
                textareaRef.current && 
                !textareaRef.current.contains(event.target as Node)
            ) {
                setIsSlashMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Search products when slash menu is open or query changes
    useEffect(() => {
        if (!isSlashMenuOpen) return;
        let isCurrent = true;
        setIsSearching(true);
        
        const timer = setTimeout(() => {
            fetch(`/api/products/search?q=${encodeURIComponent(slashQuery)}`)
                .then(res => res.json())
                .then(data => {
                    if (isCurrent && data.success) {
                        setSearchResults(data.products || []);
                        setHighlightedIndex(0);
                    }
                })
                .catch(err => {
                    console.error("Search fetch error:", err);
                })
                .finally(() => {
                    if (isCurrent) setIsSearching(false);
                });
        }, 120);

        return () => {
            isCurrent = false;
            clearTimeout(timer);
        };
    }, [slashQuery, isSlashMenuOpen]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        const cursorPos = e.target.selectionStart ?? val.length;
        setMessage(val);

        // Check text up to cursor for a slash command
        const textBeforeCursor = val.slice(0, cursorPos);
        const slashMatch = textBeforeCursor.match(/(?:^|\s)\/([^\s\/]*)$/);

        if (slashMatch) {
            const query = slashMatch[1];
            const matchIndex = textBeforeCursor.lastIndexOf('/' + query);
            setSlashMatchIndex(matchIndex);
            setSlashQuery(query);
            setIsSlashMenuOpen(true);
            setHighlightedIndex(0);
        } else {
            setIsSlashMenuOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isSlashMenuOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev + 1) % Math.max(1, searchResults.length));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (searchResults.length > 0 && searchResults[highlightedIndex]) {
                e.preventDefault();
                selectProduct(searchResults[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsSlashMenuOpen(false);
        }
    };

    const selectProduct = (product: TaggedProduct) => {
        setTaggedProducts(prev => {
            if (prev.some(p => p.id === product.id)) return prev;
            return [...prev, product];
        });

        // Clean up the "/query" trigger from the textarea text
        if (textareaRef.current) {
            const cursorPos = textareaRef.current.selectionStart ?? message.length;
            const textBefore = message.slice(0, slashMatchIndex);
            const textAfter = message.slice(cursorPos);
            const newText = (textBefore + (textAfter.startsWith(' ') || textBefore.endsWith(' ') ? '' : ' ') + textAfter).trimStart();
            setMessage(newText);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    const newPos = textBefore.length;
                    textareaRef.current.setSelectionRange(newPos, newPos);
                }
            }, 50);
        }

        setIsSlashMenuOpen(false);
        setSlashQuery('');
    };

    const removeProductTag = (id: string) => {
        setTaggedProducts(prev => prev.filter(p => p.id !== id));
    };

    const activeCountry = COUNTRIES.find((c) => c.dialCode === countryCode) || COUNTRIES[0];
    const ActiveFlag = activeCountry.Flag;

    function refreshCaptcha() {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validate phone number (must be 10 digits)
        if (phoneNumber.length !== 10) {
            return;
        }

        // Validate captcha (fallback in case they somehow submit)
        if (!captcha || captchaInput.trim() !== captcha.answer) {
            refreshCaptcha();
            return;
        }

        setFormStatus('submitting');

        const formData = new FormData(e.currentTarget);

        // Append tagged products info to content with JSON metadata for Admin Mailbox
        const currentContent = (formData.get('content') as string)?.trim() || message.trim();
        if (taggedProducts.length > 0) {
            const productMetadata = JSON.stringify(
                taggedProducts.map((p) => ({
                    id: p.id,
                    name: p.name,
                    image: p.images?.[0] || '',
                    category: p.category?.name || '',
                    subCategory: p.subCategory?.name || ''
                }))
            );
            const productList = taggedProducts
                .map((p) => `• ${p.name}${p.category?.name ? ` [${p.category.name}]` : ''}`)
                .join('\n');
            const enhancedContent = `${currentContent}\n\n<!-- TAGGED_PRODUCTS_JSON: ${productMetadata} -->\n\n---\nReferenced Products:\n${productList}`;
            formData.set('content', enhancedContent);
            formData.set('taggedProductIds', JSON.stringify(taggedProducts.map(p => p.id)));
        }

        const result = await submitFeedback(formData);

        if (result.success) {
            bypassWarningRef.current = true;
            setFormStatus('success');
            (e.target as HTMLFormElement).reset();
            setMessage('');
            setTaggedProducts([]);
            setPhoneNumber('');
            setCountryCode('+91');
            refreshCaptcha();
            setCaptchaInput('');
        } else {
            setFormStatus('error');
        }
    }

    return (
        <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 sm:px-8 pt-24 md:pt-28 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left Column: Form */}
                <ScrollReveal direction="left" className="lg:col-span-7 space-y-12">
                    <div>
                        <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6 text-balance">Get in <span className="text-brand-accent">touch</span></h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">
                                    Name<span className="text-brand-accent ml-1">*</span>
                                </label>
                                <input 
                                    required 
                                    type="text" 
                                    name="name" 
                                    className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm" 
                                    placeholder="John Doe" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">
                                    Email address<span className="text-brand-accent ml-1">*</span>
                                </label>
                                <input 
                                    required 
                                    type="email" 
                                    name="email" 
                                    className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm" 
                                    placeholder="john.doe@example.com" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">
                                    Phone Number<span className="text-brand-accent ml-1">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    {/* Country Code (Separate, selected as India +91 with 2D flag) */}
                                    <div className="relative shrink-0" ref={countryDropdownRef}>
                                        <input type="hidden" name="countryCode" value={countryCode} />
                                        <button
                                            type="button"
                                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                                            className="h-[46px] flex items-center gap-2 bg-th-input border border-brand-border px-3.5 text-brand-text hover:border-brand-accent focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm cursor-pointer select-none"
                                            aria-label="Select Country Code"
                                            aria-expanded={isCountryOpen}
                                        >
                                            <ActiveFlag className="w-5 h-3.5" />
                                            <span className="font-sans font-medium text-xs tracking-tight">{activeCountry.dialCode}</span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-brand-accent transition-transform duration-200 ${isCountryOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isCountryOpen && (
                                            <div className="absolute left-0 top-full mt-2 z-50 w-64 bg-brand-panel border border-brand-border rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 backdrop-blur-xl">
                                                <div className="px-3.5 py-1.5 border-b border-brand-border/40 text-[10px] uppercase tracking-wider text-brand-muted/70 font-sans font-semibold">
                                                    Select Country Code
                                                </div>
                                                <div className="max-h-56 overflow-y-auto py-1">
                                                    {COUNTRIES.map((c) => {
                                                        const FlagComponent = c.Flag;
                                                        const isSelected = c.dialCode === countryCode;
                                                        return (
                                                            <button
                                                                key={c.code}
                                                                type="button"
                                                                onClick={() => {
                                                                    setCountryCode(c.dialCode);
                                                                    setIsCountryOpen(false);
                                                                }}
                                                                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                                                                    isSelected
                                                                        ? 'bg-brand-accent/15 text-brand-accent font-semibold'
                                                                        : 'text-brand-text hover:bg-white/5'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2.5 truncate">
                                                                    <FlagComponent className="w-5 h-3.5" />
                                                                    <span className="truncate">{c.name}</span>
                                                                </div>
                                                                <span className="font-mono text-[11px] text-brand-muted/70 shrink-0">{c.dialCode}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 10-Digit Mobile Number Input */}
                                    <div className="relative flex-1">
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setPhoneNumber(digits);
                                            }}
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            title="Please enter a valid 10-digit phone number"
                                            placeholder="10-digit number"
                                            className="w-full h-[46px] bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm font-sans tracking-wide"
                                        />
                                        {phoneNumber.length > 0 && (
                                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-mono ${
                                                phoneNumber.length === 10 ? 'text-green-500 font-semibold' : 'text-brand-muted/50'
                                            }`}>
                                                {phoneNumber.length}/10
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                                    <p className="text-[11px] font-sans text-brand-accent pl-1">
                                        Please enter full 10 digits ({10 - phoneNumber.length} remaining)
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">What area interests you?<span className="text-brand-accent ml-1">*</span></label>
                                <div className="relative">
                                    <select name="type" className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text focus:outline-none focus:border-brand-accent transition-colors appearance-none cursor-pointer rounded-full text-sm" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                        <option value="ENQUIRY" className="bg-brand-panel text-brand-text">Manufacturing Enquiry</option>
                                        <option value="CONTACT" className="bg-brand-panel text-brand-text">General Collaboration</option>
                                        <option value="CAREER" className="bg-brand-panel text-brand-text">Career Opportunities</option>
                                        <option value="SUPPORT" className="bg-brand-panel text-brand-text">Technical Support</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-accent">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedType === 'CAREER' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Upload your CV<span className="text-brand-accent ml-1">*</span></label>
                                <div className="flex items-center gap-4 bg-th-input border border-brand-border p-2 rounded-full">
                                    <label className="btn-glass-secondary px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest cursor-pointer shrink-0">
                                        Choose File
                                        <input required type="file" name="cv" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setCvFileName(e.target.files?.[0]?.name || '')} />
                                    </label>
                                    <span className="text-sm text-brand-muted/60 truncate pr-4">
                                        {cvFileName || 'No file chosen'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 relative">
                            <div className="flex items-center justify-between px-1">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block">
                                    Tell us more<span className="text-brand-accent ml-1">*</span>
                                </label>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-sans text-brand-muted/70">
                                    Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-brand-panel border border-brand-border font-semibold text-brand-accent shadow-xs">/</kbd> to tag products
                                </span>
                            </div>

                            {/* Tagged Products Chips */}
                            {taggedProducts.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1 pb-1 animate-in fade-in duration-200">
                                    {taggedProducts.map((p) => {
                                        const thumb = p.images?.[0] ? getAssetUrl(p.images[0]) : null;
                                        return (
                                            <div 
                                                key={p.id}
                                                className="inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-brand-panel border border-brand-accent/40 shadow-xs text-xs font-sans text-brand-text group transition-all hover:border-brand-accent"
                                            >
                                                <div className="w-5 h-5 rounded-full overflow-hidden bg-brand-bg shrink-0 border border-brand-border/60 flex items-center justify-center">
                                                    {thumb ? (
                                                        <Image
                                                            src={thumb}
                                                            alt={p.name}
                                                            width={20}
                                                            height={20}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-3 h-3 text-brand-muted" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-brand-text truncate max-w-[180px] sm:max-w-[240px]">
                                                    {p.name}
                                                </span>
                                                {p.category?.name && (
                                                    <span className="text-[10px] text-brand-muted hidden sm:inline">
                                                        • {p.category.name}
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeProductTag(p.id)}
                                                    aria-label={`Remove tag ${p.name}`}
                                                    className="w-4 h-4 rounded-full flex items-center justify-center text-brand-muted hover:text-brand-accent hover:bg-brand-accent/10 transition-colors ml-0.5 cursor-pointer"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="relative">
                                <textarea 
                                    ref={textareaRef}
                                    required 
                                    name="content" 
                                    rows={4} 
                                    value={message}
                                    onChange={handleMessageChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors resize-none rounded-2xl text-sm" 
                                    placeholder="Share details about your requirement... (press / to tag a product)"
                                />

                                {/* Slash Command Product Picker Dropdown */}
                                {isSlashMenuOpen && (
                                    <div 
                                        ref={slashMenuRef}
                                        className="absolute left-0 right-0 bottom-full mb-2 z-30 card-glass border border-brand-border shadow-2xl rounded-2xl overflow-hidden p-2 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150"
                                    >
                                        <div className="px-3 py-2 border-b border-brand-border/40 flex items-center justify-between text-xs font-sans text-brand-muted">
                                            <div className="flex items-center gap-2">
                                                <Search className="w-3.5 h-3.5 text-brand-accent" />
                                                <span className="font-medium text-brand-text">
                                                    {slashQuery ? `Search products: "/${slashQuery}"` : "Tag a Product"}
                                                </span>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2 text-[10px] text-brand-muted/60">
                                                <span>↑↓ navigate</span>
                                                <span>↵ select</span>
                                                <span>esc close</span>
                                            </div>
                                        </div>

                                        <div className="max-h-56 overflow-y-auto py-1 scrollbar-thin">
                                            {isSearching ? (
                                                <div className="py-6 flex items-center justify-center gap-2 text-xs font-sans text-brand-muted">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-accent" />
                                                    <span>Searching catalog...</span>
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                searchResults.map((product, idx) => {
                                                    const thumb = product.images?.[0] ? getAssetUrl(product.images[0]) : null;
                                                    const isSelected = idx === highlightedIndex;
                                                    return (
                                                        <div
                                                            key={product.id}
                                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                                            onClick={() => selectProduct(product)}
                                                            className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                                                                isSelected
                                                                    ? 'bg-brand-accent/15 border border-brand-accent/40 text-brand-text'
                                                                    : 'hover:bg-brand-panel/60 text-brand-text border border-transparent'
                                                            }`}
                                                        >
                                                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-brand-bg shrink-0 border border-brand-border/60 flex items-center justify-center">
                                                                {thumb ? (
                                                                    <Image
                                                                        src={thumb}
                                                                        alt={product.name}
                                                                        width={36}
                                                                        height={36}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package className="w-4 h-4 text-brand-muted" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-sans font-medium text-xs sm:text-sm text-brand-text truncate">
                                                                    {product.name}
                                                                </p>
                                                                <p className="font-sans text-[10px] text-brand-muted truncate">
                                                                    {product.category?.name || "Product"}
                                                                    {product.subCategory?.name && ` • ${product.subCategory.name}`}
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-brand-accent opacity-0 group-hover:opacity-100 sm:inline hidden">
                                                                Tag +
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-6 text-center text-xs font-sans text-brand-muted">
                                                    No products found matching &ldquo;{slashQuery}&rdquo;
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Simple Math Captcha */}
                            <div className="flex items-center gap-4 w-full">
                                <div className="bg-th-input border border-brand-border pl-5 pr-2 py-2 flex items-center justify-between w-full gap-4 rounded-full">
                                    <div className="flex items-center gap-3">
                                        <span className="font-sans text-sm tracking-widest text-brand-muted/60 uppercase">Verify:<span className="text-brand-accent ml-1">*</span></span>
                                        <span className="font-sans text-lg font-bold text-brand-text tracking-wider">{captcha?.question ?? '...'}</span>
                                        <span className="font-sans text-sm text-brand-muted/60">=</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={captchaInput}
                                                onChange={(e) => { setCaptchaInput(e.target.value); }}
                                                className={`w-16 bg-th-input border ${isCaptchaWrong ? 'border-red-500' : isCaptchaValid ? 'border-green-500/50' : 'border-brand-border'} px-3 py-1.5 text-center font-sans text-lg font-bold text-brand-text focus:outline-none focus:border-brand-accent transition-colors pr-2 rounded-full`}
                                                placeholder="?"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center justify-center w-6 h-6 hidden sm:flex">
                                            {isCaptchaValid && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
                                            {isCaptchaWrong && <XCircle className="w-5 h-5 text-red-500 animate-in zoom-in" />}
                                        </div>
                                    </div>
                                    <button type="button" onClick={refreshCaptcha} aria-label="Refresh Captcha" className="btn-glass-secondary px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest shrink-0">
                                        Refresh
                                    </button>
                                </div>
                            </div>
                            {isCaptchaWrong && (
                                <p className="text-red-500 text-xs font-sans tracking-widest uppercase">Incorrect answer. Please try again.</p>
                            )}

                            {/* Agreement Warning */}
                            <div className="flex items-start gap-3 px-1">
                                <AlertTriangle size={14} className="text-brand-accent mt-0.5 shrink-0" />
                                <p className="text-xs text-brand-muted/60 leading-relaxed">
                                    By submitting this form, you agree to be contacted based on the information provided.
                                </p>
                            </div>

                            <button
                                type="submit"
                                aria-label="Send Message"
                                disabled={formStatus === 'submitting' || !isCaptchaValid || !isPhoneValid}
                                className="w-full btn-glass-secondary px-8 py-5 font-sans font-bold tracking-[0.2em] uppercase transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                            >
                                {formStatus === 'submitting' ? 'Transmitting...' : (
                                    <>
                                        Send Message
                                        <div className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-green-500 transition-colors" />
                                    </>
                                )}
                            </button>

                            {formStatus === 'success' && (
                                <div className="p-4 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent font-sans tracking-widest uppercase text-xs text-center animate-in fade-in slide-in-from-bottom-2">
                                    Message received. We&apos;ll get back to you soon.
                                </div>
                            )}
                            {formStatus === 'error' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 font-sans tracking-widest uppercase text-xs text-center animate-in fade-in slide-in-from-bottom-2">
                                    Communication error. Please try again.
                                </div>
                            )}
                        </div>
                    </form>
                </ScrollReveal>

                {/* Right Column: Information & Map */}
                <ScrollReveal direction="right" staggerChildren={true} staggerAmount={0.2} className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32 group">
                    {/* Map Row */}
                    <div className="relative border border-brand-border group-hover:border-brand-accent/40 transition-all duration-700 overflow-hidden h-[300px] lg:h-[350px]">
                        <iframe
                            src="https://maps.google.com/maps?q=LOHANRAJO%20Metal%20Arts%20Perungudi%20Chennai&output=embed&iwloc=near"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-1000"
                        ></iframe>
                    </div>

                    {/* Headquarters Row */}
                    <div className="bg-th-panel border border-brand-border/50 rounded-xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative min-h-[400px]">
                        <div>
                            <div className="space-y-10 z-10 relative">
                                {/* Address Block */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                                        <MapPin className="text-brand-accent w-5 h-5 shrink-0" />
                                        <h4 className="font-sans text-sm uppercase tracking-widest text-brand-text">Primary Facility Address</h4>
                                    </div>
                                    <p className="text-brand-text font-mono text-sm leading-loose italic">
                                        Plot No. 213, 214 &amp; 215,<br />
                                        3rd Main Road, Burma Colony, <br />
                                        Perungudi, OMR,<br />
                                        Chennai - 600096,<br />
                                        Tamil Nadu, India
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    {/* Phone Block */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                                            <Phone className="text-brand-accent w-5 h-5 shrink-0" />
                                            <h4 className="font-sans text-sm uppercase tracking-widest text-brand-text">Connect</h4>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-brand-text font-mono text-sm leading-relaxed italic">+91 44 2496 2590</p>
                                            <p className="text-brand-text font-mono text-sm leading-relaxed italic">+91 44 2496 2591</p>
                                        </div>
                                    </div>

                                    {/* Mail Block */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-3">
                                            <Mail className="text-brand-accent w-5 h-5 shrink-0" />
                                            <h4 className="font-sans text-sm uppercase tracking-widest text-brand-text">Mail</h4>
                                        </div>
                                        <p className="text-brand-text font-mono text-sm leading-relaxed italic">lohanrajoliat@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    </div>
                </ScrollReveal>
            </div>

            {/* Unsaved Tagged Product Leave Warning Modal */}
            {showLeaveModal && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="leave-modal-title"
                    className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
                >
                    <div 
                        className="card-glass border border-brand-border/80 shadow-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Ambient Background Flare */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Warning Icon Badge */}
                        <div className="w-14 h-14 mx-auto rounded-2xl btn-glass-secondary border border-brand-accent/40 flex items-center justify-center text-brand-accent shadow-md">
                            <AlertTriangle className="w-7 h-7 text-brand-accent" />
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-2">
                            <h3 id="leave-modal-title" className="font-playfair italic text-2xl text-brand-text font-bold">
                                Remove tagged product?
                            </h3>
                            <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
                                You have tagged product(s) in your enquiry. Moving to a different page will remove them. Do you want to remove this product and leave?
                            </p>
                        </div>

                        {/* Preview of Tagged Products */}
                        {taggedProducts.length > 0 && (
                            <div className="bg-brand-panel/70 border border-brand-border/60 rounded-2xl p-3 max-h-36 overflow-y-auto space-y-2 scrollbar-thin text-left">
                                {taggedProducts.map((p) => {
                                    const thumb = p.images?.[0] ? getAssetUrl(p.images[0]) : null;
                                    return (
                                        <div key={p.id} className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg overflow-hidden bg-brand-bg shrink-0 border border-brand-border/60 flex items-center justify-center">
                                                {thumb ? (
                                                    <Image
                                                        src={thumb}
                                                        alt={p.name}
                                                        width={28}
                                                        height={28}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-3.5 h-3.5 text-brand-muted" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-sans font-medium text-xs text-brand-text truncate">
                                                    {p.name}
                                                </p>
                                                {p.category?.name && (
                                                    <p className="text-[10px] text-brand-muted truncate">
                                                        {p.category.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCancelLeave}
                                className="w-full btn-glass-primary py-3 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-transform hover:scale-[1.02] cursor-pointer shadow-md"
                            >
                                Stay on Page
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLeave}
                                className="w-full py-3 rounded-full text-xs font-sans font-medium uppercase tracking-wider text-brand-muted hover:text-brand-accent border border-brand-border/60 hover:border-brand-accent/50 transition-colors cursor-pointer"
                            >
                                Yes, Remove &amp; Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={
            <div className="w-full 2xl:max-w-screen-2xl 3xl:max-w-full mx-auto px-4 sm:px-8 pt-24 md:pt-28 pb-16">
                <div>
                    <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6 text-balance">
                        Get in <span className="text-brand-accent">touch</span>
                    </h1>
                    <p className="text-brand-muted text-sm max-w-xl">
                        Connect with LIAT for custom IP rated industrial enclosure inquiries, BMS control panel specifications, and engineering consultations.
                    </p>
                </div>
            </div>
        }>
            <ContactFormContent />
        </Suspense>
    );
}

