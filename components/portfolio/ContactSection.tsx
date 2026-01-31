'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { ContactInfo } from '@/types';

export default function ContactSection() {
    const [contact, setContact] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContact();
    }, []);

    async function fetchContact() {
        try {
            const { data, error } = await supabase
                .from('contact_info')
                .select('*')
                .single();

            if (error) throw error;
            setContact(data);
        } catch (error) {
            console.error('Error fetching contact:', error);
            // Default contact
            setContact({
                id: '1',
                email: 'your.email@example.com',
                phone: '+1 (123) 456-7890',
                location: 'San Francisco, CA',
                linkedin: 'https://linkedin.com/in/yourprofile',
                github: 'https://github.com/yourprofile',
                twitter: 'https://twitter.com/yourprofile',
                portfolio_url: null,
                updated_at: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    }

    if (loading) return null;

    const socialLinks = [
        { icon: Linkedin, url: contact?.linkedin, label: 'LinkedIn', color: 'text-blue-400' },
        { icon: Github, url: contact?.github, label: 'GitHub', color: 'text-gray-400' },
        { icon: Twitter, url: contact?.twitter, label: 'Twitter', color: 'text-sky-400' },
    ].filter(link => link.url);

    return (
        <section id="contact" className="section-padding">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Let's build something amazing together
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-8 md:p-12"
                >
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {contact?.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                                    <Mail className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="text-white font-semibold">{contact.email}</p>
                                </div>
                            </a>
                        )}

                        {contact?.phone && (
                            <a
                                href={`tel:${contact.phone}`}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
                                    <Phone className="w-6 h-6 text-accent-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Phone</p>
                                    <p className="text-white font-semibold">{contact.phone}</p>
                                </div>
                            </a>
                        )}

                        {contact?.location && (
                            <div className="flex items-center gap-4 p-4 rounded-lg">
                                <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-secondary-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Location</p>
                                    <p className="text-white font-semibold">{contact.location}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    {socialLinks.length > 0 && (
                        <div>
                            <p className="text-gray-400 text-sm mb-4 text-center">Connect with me</p>
                            <div className="flex justify-center gap-4">
                                {socialLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <a
                                            key={link.label}
                                            href={link.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-12 h-12 glass rounded-lg flex items-center justify-center hover:scale-110 transition-transform ${link.color} hover:bg-white/10`}
                                            aria-label={link.label}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 text-gray-500 text-sm"
                >
                    <p>© {new Date().getFullYear()} All rights reserved.</p>
                </motion.div>
            </div>
        </section>
    );
}
