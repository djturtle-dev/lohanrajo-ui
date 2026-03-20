'use client'

import { useState, useEffect } from 'react';
import { submitFeedback } from '@/app/actions';
import { MapPin, Phone, Mail, AlertTriangle } from 'lucide-react';

// Simple math captcha - no external dependencies needed
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { question: `${a} + ${b}`, answer: (a + b).toString() };
}

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [captcha, setCaptcha] = useState<{ question: string; answer: string } | null>(null);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState(false);

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    function refreshCaptcha() {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
        setCaptchaError(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setCaptchaError(false);

        // Validate captcha
        if (!captcha || captchaInput.trim() !== captcha.answer) {
            setCaptchaError(true);
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
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left Column: Form */}
                <div className="lg:col-span-7 space-y-12">
                    <div>
                        <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tighter text-brand-text mb-6 text-balance">Get in <span className="text-brand-accent">touch</span></h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-oswald text-xs tracking-widest uppercase text-brand-muted/60 block px-1">First Name</label>
                                <input required type="text" name="firstName" className="w-full bg-brand-panel border border-brand-border px-4 py-2 text-brand-text focus:outline-none focus:border-brand-accent transition-all ring-offset-2 focus:ring-1 ring-brand-accent/20" placeholder="John" />
                            </div>
                            <div className="space-y-3">
                                <label className="font-oswald text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Last Name</label>
                                <input required type="text" name="lastName" className="w-full bg-brand-panel border border-brand-border px-4 py-2 text-brand-text focus:outline-none focus:border-brand-accent transition-all ring-offset-2 focus:ring-1 ring-brand-accent/20" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-oswald text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Phone</label>
                                <input required type="text" name="phone" className="w-full bg-brand-panel border border-brand-border px-4 py-2 text-brand-text focus:outline-none focus:border-brand-accent transition-all ring-offset-2 focus:ring-1 ring-brand-accent/20" placeholder="+91 1234567890" />
                            </div>
                            <div className="space-y-3">
                                <label className="font-oswald text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Email address</label>
                                <input required type="email" name="email" className="w-full bg-brand-panel border border-brand-border px-4 py-2 text-brand-text focus:outline-none focus:border-brand-accent transition-all ring-offset-2 focus:ring-1 ring-brand-accent/20" placeholder="john.doe@example.com" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="font-oswald text-xs tracking-widest uppercase text-brand-muted/60 block px-1">What area interests you?</label>
                            <div className="relative">
                                <select name="type" className="w-full bg-brand-panel border border-brand-border px-4 py-2 text-brand-text focus:outline-none focus:border-brand-accent transition-all appearance-none cursor-pointer" defaultValue="ENQUIRY">
                                    <option value="ENQUIRY">Manufacturing Enquiry</option>
                                    <option value="CONTACT">General Collaboration</option>
                                    <option value="CAREER">Career Opportunities</option>
                                    <option value="SUPPORT">Technical Support</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-accent">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="font-oswald text-xs tracking-widest uppercase text-brand-muted/60 block px-1">Tell us more</label>
                            <textarea required name="content" rows={4} className="w-full bg-brand-panel border border-brand-border px-4 py-2 text-brand-text focus:outline-none focus:border-brand-accent transition-all resize-none ring-offset-2 focus:ring-1 ring-brand-accent/20" placeholder="Share details about your requirement..."></textarea>
                        </div>

                        <div className="space-y-6">
                            {/* Simple Math Captcha */}
                            <div className="flex items-center gap-4">
                                <div className="bg-brand-panel border border-brand-border px-5 py-3 flex items-center gap-3">
                                    <span className="font-oswald text-sm tracking-widest text-brand-muted/60 uppercase">Verify:</span>
                                    <span className="font-oswald text-lg font-bold text-brand-text tracking-wider">{captcha?.question ?? '...'}</span>
                                    <span className="font-oswald text-sm text-brand-muted/60">=</span>
                                    <input
                                        type="text"
                                        value={captchaInput}
                                        onChange={(e) => { setCaptchaInput(e.target.value); setCaptchaError(false); }}
                                        className={`w-16 bg-brand-dark border ${captchaError ? 'border-red-500' : 'border-brand-border'} px-3 py-1.5 text-center font-oswald text-lg font-bold text-brand-text focus:outline-none focus:border-brand-accent transition-all`}
                                        placeholder="?"
                                        required
                                    />
                                </div>
                                <button type="button" onClick={refreshCaptcha} className="text-brand-muted/40 hover:text-brand-accent transition-colors text-xs font-oswald uppercase tracking-widest">
                                    Refresh
                                </button>
                            </div>
                            {captchaError && (
                                <p className="text-red-500 text-xs font-oswald tracking-widest uppercase">Incorrect answer. Please try again.</p>
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
                                disabled={formStatus === 'submitting'}
                                className="w-full bg-brand-accent text-white px-8 py-5 font-oswald font-black tracking-[0.2em] uppercase hover:bg-brand-accent/85 transition-all duration-500 disabled:opacity-50 group flex items-center justify-center gap-3"
                            >
                                {formStatus === 'submitting' ? 'Transmitting...' : (
                                    <>
                                        Send Message
                                        <div className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-white transition-colors" />
                                    </>
                                )}
                            </button>

                            {formStatus === 'success' && (
                                <div className="p-4 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent font-oswald tracking-widest uppercase text-xs text-center animate-in fade-in slide-in-from-bottom-2">
                                    Message received. We&apos;ll get back to you soon.
                                </div>
                            )}
                            {formStatus === 'error' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 font-oswald tracking-widest uppercase text-xs text-center animate-in fade-in slide-in-from-bottom-2">
                                    Communication error. Please try again.
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Column: Information & Map */}
                <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32 group">
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
                    <div className="bg-brand-panel border border-brand-border p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative min-h-[400px]">
                        <div>
                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <p className="font-oswald text-brand-muted/40 uppercase tracking-widest text-[10px] font-medium">Primary Facility Address</p>
                                    <p className="text-brand-text text-lg leading-relaxed font-light">
                                        Plot No. 213, 214 &amp; 215, 3rd Main Road,<br />
                                        Burma Colony, Perungudi, OMR,<br />
                                        Chennai - 600096, Tamil Nadu, India
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-3">
                                        <p className="font-oswald text-brand-muted/40 uppercase tracking-widest text-[10px] font-medium">Connect</p>
                                        <p className="text-brand-text text-lg">+91 44 2496 2590</p>
                                        <p className="text-brand-text text-lg">+91 44 2496 2591</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="font-oswald text-brand-muted/40 uppercase tracking-widest text-[10px] font-medium">Mail</p>
                                        <p className="text-brand-text text-lg">info@lohanrajo.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 -mr-16 -mt-16 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
