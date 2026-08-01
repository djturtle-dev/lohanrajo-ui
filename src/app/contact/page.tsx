'use client'

import { useState, useEffect } from 'react';
import { submitFeedback } from '@/app/actions';
import { MapPin, Phone, Mail, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';

// Simple math captcha - no external dependencies needed
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { question: `${a} + ${b}`, answer: (a + b).toString() };
}

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [selectedType, setSelectedType] = useState('ENQUIRY');
    const [cvFileName, setCvFileName] = useState('');
    const [captcha, setCaptcha] = useState<{ question: string; answer: string } | null>(null);
    const [captchaInput, setCaptchaInput] = useState('');
    
    const isCaptchaValid = captcha !== null && captchaInput.trim() === captcha.answer;
    const isCaptchaWrong = captchaInput.trim() !== '' && captcha !== null && captchaInput.trim() !== captcha.answer;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const type = params.get('type');
            if (type && ['ENQUIRY', 'CONTACT', 'CAREER', 'SUPPORT'].includes(type)) {
                setSelectedType(type);
            }
        }
    }, []);

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    function refreshCaptcha() {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validate captcha (fallback in case they somehow submit)
        if (!captcha || captchaInput.trim() !== captcha.answer) {
            refreshCaptcha();
            return;
        }

        setFormStatus('submitting');

        const formData = new FormData(e.currentTarget);
        const result = await submitFeedback(formData);

        if (result.success) {
            setFormStatus('success');
            (e.target as HTMLFormElement).reset();
            refreshCaptcha();
            setCaptchaInput('');
        } else {
            setFormStatus('error');
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left Column: Form */}
                <ScrollReveal direction="left" className="lg:col-span-7 space-y-12">
                    <div>
                        <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter text-brand-text mb-6 text-balance">Get in <span className="text-brand-accent">Touch</span></h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">First Name<span className="text-brand-accent ml-1">*</span></label>
                                <input required type="text" name="firstName" className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm" placeholder="John" />
                            </div>
                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Last Name<span className="text-brand-accent ml-1">*</span></label>
                                <input required type="text" name="lastName" className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Phone<span className="text-brand-accent ml-1">*</span></label>
                                <input required type="text" name="phone" className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm" placeholder="+91 1234567890" />
                            </div>
                            <div className="space-y-3">
                                <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Email address<span className="text-brand-accent ml-1">*</span></label>
                                <input required type="email" name="email" className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors rounded-full text-sm" placeholder="john.doe@example.com" />
                            </div>
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

                        <div className="space-y-3">
                            <label className="font-sans text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Tell us more<span className="text-brand-accent ml-1">*</span></label>
                            <textarea required name="content" rows={4} className="w-full bg-th-input border border-brand-border px-4 py-3 text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-accent transition-colors resize-none rounded-2xl text-sm" placeholder="Share details about your requirement..."></textarea>
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
                                    <button type="button" onClick={refreshCaptcha} className="btn-glass-secondary px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest shrink-0">
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
                                disabled={formStatus === 'submitting' || !isCaptchaValid}
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
        </div>
    );
}
