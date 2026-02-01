'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowUpRight, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { ContactInfo } from '@/types';

export default function ContactSection() {
    const [contact, setContact] = useState<ContactInfo | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('contact_info').select('*').single();
                if (data) setContact(data);
                else setContact(defaultContact);
            } catch { setContact(defaultContact); }
        }
        fetchData();
    }, []);

    const defaultContact = {
        id: '1',
        email: 'hello@ayaan.dev',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        phone: '',
        location: '',
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
                    </div>

                    {/* Socials Link List */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Socials</h4>
                        <ul className="space-y-4">
                            {contact?.github && <SocialListItem href={contact.github} label="Github" />}
                            {contact?.linkedin && <SocialListItem href={contact.linkedin} label="LinkedIn" />}
                            {contact?.twitter && <SocialListItem href={contact.twitter} label="Twitter / X" />}
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

function SocialListItem({ href, label }: { href: string, label: string }) {
    return (
        <li>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
                <span>{label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </a>
        </li>
    );
}
