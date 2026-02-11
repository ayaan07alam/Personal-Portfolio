'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowUpRight, Copy, Check, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { ContactInfo } from '@/types';
import ContactGlobe from './ContactGlobe';

export default function ContactSection() {
    const [contact, setContact] = useState<ContactInfo | null>(null);
    const [copied, setCopied] = useState(false);

    // Contact Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('contact_info').select('*').single();
                if (data) {
                    // Merge DB data with defaults, preferring DB data unless it's empty
                    setContact({
                        ...defaultContact,
                        ...data,
                        email: data.email || defaultContact.email,
                        github: data.github || defaultContact.github,
                        linkedin: data.linkedin || defaultContact.linkedin,
                        twitter: data.twitter || defaultContact.twitter,
                        phone: data.phone || defaultContact.phone,
                        location: data.location || defaultContact.location,
                    });
                } else {
                    setContact(defaultContact);
                }
            } catch { setContact(defaultContact); }
        }
        fetchData();
    }, []);

    const defaultContact = {
        id: '1',
        email: 'ayaanalam78670@gmail.com',
        github: 'https://github.com/ayaan07alam',
        linkedin: 'https://linkedin.com/in/ayaan07alam',
        twitter: '',
        phone: '+91-9711225837',
        location: 'Bengaluru, India',
        portfolio_url: '',
        updated_at: new Date().toISOString()
    };

    const handleCopyEmail = () => {
        if (contact?.email) {
            navigator.clipboard.writeText(contact.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('loading');
        setFormError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setFormStatus('idle'), 5000);
            } else {
                setFormStatus('error');
                setFormError(data.error || 'Failed to send message');
            }
        } catch (error) {
            setFormStatus('error');
            setFormError('Failed to send message. Please try again.');
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="relative bg-background pt-32 pb-12 overflow-hidden">
            {/* Ambient Bottom Glow */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-900/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-900/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* 1. Main CTA Block */}
                <div className="mb-24 md:mb-32">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-brand-400 font-mono text-sm tracking-widest uppercase mb-6"
                    >
                        What's Next?
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-none mb-10"
                    >
                        Let's work <br /> <span className="text-zinc-700">together.</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row gap-6"
                    >
                        {/* Magnetic Email Copy Button */}
                        <button
                            onClick={handleCopyEmail}
                            className="group relative px-8 py-5 bg-zinc-900 border border-white/10 rounded-full flex items-center gap-3 overflow-hidden hover:bg-zinc-800 transition-all active:scale-95 text-left"
                        >
                            <div className="relative z-10 flex items-center gap-3">
                                <span className={`p-2 rounded-full ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-zinc-400'}`}>
                                    {copied ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Drop me a line</span>
                                    <span className="text-white font-medium text-lg">{contact?.email}</span>
                                </div>
                                <Copy className="w-4 h-4 text-zinc-600 ml-4 group-hover:text-white transition-colors" />
                            </div>
                        </button>
                    </motion.div>


                    <div className="mt-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left: Contact Form */}
                        <div
                            className="bg-zinc-900/20 backdrop-blur-sm p-8 rounded-3xl border border-white/5"
                        >
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Send me a message</h3>
                            <p className="text-zinc-500 mb-8">Have a project in mind? Let's discuss how I can help.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                        className="peer w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-transparent focus:outline-none focus:border-brand-500/50 transition-all"
                                        placeholder="Your Name"
                                    />
                                    <label className="absolute left-6 -top-3 bg-background px-2 text-sm text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-brand-400">
                                        Your Name
                                    </label>
                                </div>

                                {/* Email Input */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        required
                                        className="peer w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-transparent focus:outline-none focus:border-brand-500/50 transition-all"
                                        placeholder="your@email.com"
                                    />
                                    <label className="absolute left-6 -top-3 bg-background px-2 text-sm text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-brand-400">
                                        Your Email
                                    </label>
                                </div>

                                {/* Subject Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleFormChange}
                                        className="peer w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-transparent focus:outline-none focus:border-brand-500/50 transition-all"
                                        placeholder="Subject"
                                    />
                                    <label className="absolute left-6 -top-3 bg-background px-2 text-sm text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-brand-400">
                                        Subject (Optional)
                                    </label>
                                </div>

                                {/* Message Textarea */}
                                <div className="relative">
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleFormChange}
                                        required
                                        rows={6}
                                        maxLength={1000}
                                        className="peer w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-transparent focus:outline-none focus:border-brand-500/50 transition-all resize-none"
                                        placeholder="Your message..."
                                    />
                                    <label className="absolute left-6 -top-3 bg-background px-2 text-sm text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-600 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-brand-400">
                                        Your Message
                                    </label>
                                    <span className="absolute bottom-4 right-6 text-xs text-zinc-600">
                                        {formData.message.length}/1000
                                    </span>
                                </div>

                                {/* Error Message */}
                                {formError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-sm"
                                    >
                                        ⚠ {formError}
                                    </motion.p>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={formStatus === 'loading'}
                                    className="group relative px-8 py-4 bg-brand-500 text-white font-bold rounded-full overflow-hidden hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 w-full justify-center"
                                    whileHover={{ scale: formStatus === 'loading' ? 1 : 1.02 }}
                                    whileTap={{ scale: formStatus === 'loading' ? 1 : 0.98 }}
                                >
                                    {formStatus === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {formStatus === 'success' && <Check className="w-5 h-5" />}
                                    {(formStatus === 'idle' || formStatus === 'error') && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}

                                    {formStatus === 'loading' && 'Sending...'}
                                    {formStatus === 'success' && 'Message Sent!'}
                                    {(formStatus === 'idle' || formStatus === 'error') && 'Send Message'}
                                </motion.button>

                                {formStatus === 'success' && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-green-400 text-sm text-center"
                                    >
                                        ✓ Thanks for reaching out! I'll get back to you soon.
                                    </motion.p>
                                )}
                            </form>
                        </div>

                        {/* Right: Fibonacci Sphere Globe */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="hidden lg:flex flex-col items-center justify-center relative h-[600px]"
                        >
                            <ContactGlobe />

                            {/* Floating Label */}
                            <div className="absolute bottom-12 px-5 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-3">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                                </span>
                                <span className="text-xs font-mono text-zinc-300 tracking-[0.2em] uppercase">Global Node Active</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 2. Divider */}
                <div className="w-full h-px bg-white/10 mb-12" />

                {/* 3. Footer Grid */}
                <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-20">

                    {/* Brand / Copyright */}
                    <div className="col-span-2">
                        <h3 className="text-2xl font-bold text-white mb-6">Ayaan Alam</h3>
                        <p className="text-zinc-500 max-w-sm mb-6">
                            Building digital experiences with focus on performance, aesthetics, and user interaction.
                        </p>
                        <p className="text-zinc-600 text-sm">
                            © {currentYear} All rights reserved.
                        </p>
                        {/* Subtle Freelancing Badge */}
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tech-500/10 border border-tech-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-tech-500"></span>
                            </span>
                            <span className="text-xs text-tech-400 font-medium">Open for freelance projects</span>
                        </div>
                    </div>

                    {/* Socials Link List */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Socials</h4>
                        <ul className="space-y-4">
                            {contact?.github && (
                                <SocialListItem
                                    href={contact.github}
                                    label="Github"
                                    icon={<Github className="w-4 h-4" />}
                                />
                            )}
                            {contact?.linkedin && (
                                <SocialListItem
                                    href={contact.linkedin}
                                    label="LinkedIn"
                                    icon={<Linkedin className="w-4 h-4" />}
                                />
                            )}
                            {contact?.twitter && (
                                <SocialListItem
                                    href={contact.twitter}
                                    label="Twitter / X"
                                    icon={<Twitter className="w-4 h-4" />}
                                />
                            )}
                        </ul>
                    </div>

                    {/* Navigation / Other */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Menu</h4>
                        <ul className="space-y-4">
                            <li><a href="#about" className="text-zinc-500 hover:text-white transition-colors">About</a></li>
                            <li><a href="#projects" className="text-zinc-500 hover:text-white transition-colors">Projects</a></li>
                            <li><a href="#skills" className="text-zinc-500 hover:text-white transition-colors">Skills</a></li>
                        </ul>
                    </div>
                </div>

                {/* Big Text Background (Visual Filler) */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none select-none opacity-[0.03]">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 20
                        }}
                    >
                        <span className="text-[15vw] font-bold text-white whitespace-nowrap mr-20">AYAAN ALAM</span>
                        <span className="text-[15vw] font-bold text-white whitespace-nowrap mr-20">AYAAN ALAM</span>
                        <span className="text-[15vw] font-bold text-white whitespace-nowrap mr-20">AYAAN ALAM</span>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}

function SocialListItem({ href, label, icon }: { href: string, label: string, icon: React.ReactNode }) {
    return (
        <li>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
                {icon}
                <span>{label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </a>
        </li>
    );
}
