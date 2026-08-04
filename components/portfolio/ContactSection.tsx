'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowUpRight, Copy, Check, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { ContactInfo } from '@/types';
import ContactGlobe from './ContactGlobe';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MouseGlow from '@/components/ui/MouseGlow';

export default function ContactSection() {
    const [contact, setContact] = useState<ContactInfo | null>(null);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');

    const defaultContact = {
        id: '1', email: 'ayaanalam78670@gmail.com', github: 'https://github.com/ayaan07alam', linkedin: 'https://linkedin.com/in/ayaan07alam', twitter: '', phone: '+91-9711225837', location: 'Bengaluru, India', portfolio_url: '', updated_at: new Date().toISOString()
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('contact_info').select('*').single();
                if (data) {
                    setContact({ ...defaultContact, ...data, email: data.email || defaultContact.email, github: data.github || defaultContact.github, linkedin: data.linkedin || defaultContact.linkedin, twitter: data.twitter || defaultContact.twitter, phone: data.phone || defaultContact.phone, location: data.location || defaultContact.location });
                } else setContact(defaultContact);
            } catch { setContact(defaultContact); }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCopyEmail = () => { if (contact?.email) { navigator.clipboard.writeText(contact.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); setFormError(''); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setFormStatus('loading'); setFormError('');
        try {
            const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const data = await response.json();
            if (response.ok) { setFormStatus('success'); setFormData({ name: '', email: '', subject: '', message: '' }); setTimeout(() => setFormStatus('idle'), 5000); }
            else { setFormStatus('error'); setFormError(data.error || 'Failed to send message'); }
        } catch { setFormStatus('error'); setFormError('Failed to send message. Please try again.'); }
    };

    const currentYear = new Date().getFullYear();
    const inputClass = "w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-5 py-3.5 text-[var(--text-main)] text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-indigo-500/50 transition-all";

    return (
        <footer id="contact" className="relative bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 pt-28 md:pt-36 pb-12 overflow-hidden">
            <MouseGlow glowColor="rgba(139, 92, 246, 0.05)" glowSize={800}>
                    <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
                    {/* Section Header */}
                    <div className="mb-16 md:mb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block text-[11px] font-mono tracking-[0.25em] text-brand-400/70 uppercase mb-4"
                        >
                            Get in Touch
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--text-main)] tracking-[-0.035em] text-balance leading-[1.05]"
                        >
                            Let&apos;s work<br />
                            <span className="gradient-text">together.</span>
                        </motion.h2>
                    </div>

                    {/* Email copy */}
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="mb-14">
                        <SpotlightCard className="inline-flex px-6 py-4 items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform" spotlightColor="rgba(99, 102, 241, 0.12)">
                            <div onClick={handleCopyEmail} className="flex items-center gap-3">
                                <span className={`p-2 rounded-lg ${copied ? 'bg-green-500/10 text-green-400' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
                                    {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                </span>
                                <div className="text-left">
                                    <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-[0.15em] uppercase block">Email</span>
                                    <span className="text-[var(--text-main)] text-sm font-medium">{contact?.email}</span>
                                </div>
                                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)] ml-3 hover:text-[var(--text-main)] transition-colors" />
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    {/* Form + Globe */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
                        <SpotlightCard className="p-5 md:p-8 hover:-translate-y-1 transition-all duration-300 border-[var(--border-subtle)]">
                            <h3 className="text-lg font-bold text-[var(--text-main)] mb-1.5">Send a message</h3>
                            <p className="text-[var(--text-muted)] text-sm mb-7">Have a project in mind? Let&apos;s discuss.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className={inputClass} placeholder="Your Name" />
                                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className={inputClass} placeholder="Email" />
                                </div>
                                <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} className={inputClass} placeholder="Subject (Optional)" />
                                <div className="relative">
                                    <textarea name="message" value={formData.message} onChange={handleFormChange} required rows={4} maxLength={1000} className={`${inputClass} resize-none`} placeholder="Your message..." />
                                    <span className="absolute bottom-3 right-4 text-[10px] text-zinc-700 font-mono">{formData.message.length}/1000</span>
                                </div>
                                {formError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">⚠ {formError}</motion.p>}
                                <button type="submit" disabled={formStatus === 'loading'}
                                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all duration-500">
                                    {formStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {formStatus === 'success' && <Check className="w-4 h-4" />}
                                    {(formStatus === 'idle' || formStatus === 'error') && <Send className="w-4 h-4" />}
                                    {formStatus === 'loading' ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                                </button>
                                {formStatus === 'success' && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm text-center">
                                        ✓ Thanks! I&apos;ll get back to you soon.
                                    </motion.p>
                                )}
                            </form>
                        </SpotlightCard>

                        {/* Globe */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                            className="hidden lg:flex flex-col items-center justify-center relative h-[500px]">
                            <ContactGlobe />
                        </motion.div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/[0.04] mb-10" />

                    {/* Footer */}
                    <div className="grid md:grid-cols-3 gap-10 mb-12">
                        <div>
                            <h3 className="font-display text-lg font-bold text-white mb-3 tracking-tight">Ayaan Alam</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-4 max-w-xs">Software engineer focused on scalable systems, crisp UX, and craftsmanship in the details.</p>
                            <p className="text-zinc-700 text-[11px] font-mono tracking-wide">© {currentYear} Ayaan Alam. All rights reserved.</p>
                            <p className="mt-5 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                                Next.js · React · Tailwind · Framer Motion · Supabase
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-4">Socials</h4>
                            <ul className="space-y-2.5">
                                {contact?.github && <SocialItem href={contact.github} label="Github" icon={<Github className="w-4 h-4" />} />}
                                {contact?.linkedin && <SocialItem href={contact.linkedin} label="LinkedIn" icon={<Linkedin className="w-4 h-4" />} />}
                                {contact?.twitter && <SocialItem href={contact.twitter} label="Twitter / X" icon={<Twitter className="w-4 h-4" />} />}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-4">Navigate</h4>
                            <ul className="space-y-2.5">
                                {[
                                    ['About', '#about'],
                                    ['Skills', '#skills'],
                                    ['Projects', '#projects'],
                                    ['Values', '#philosophy'],
                                    ['Experience', '#experience'],
                                    ['Achievements', '#achievements'],
                                    ['Reviews', '#reviews'],
                                    ['Education', '#education'],
                                    ['Contact', '#contact'],
                                ].map(([label, href]) => (
                                    <li key={href}><a href={href} className="text-zinc-600 hover:text-white transition-colors text-sm">{label}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </MouseGlow>
        </footer>
    );
}

function SocialItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
    return (
        <li>
            <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-sm">
                {icon}<span>{label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
            </a>
        </li>
    );
}
