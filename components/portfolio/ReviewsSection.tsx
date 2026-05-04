'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquareQuote, X, Send, Loader2, Check, Quote } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface Review {
    id: string;
    client_name: string;
    client_role: string | null;
    client_company: string | null;
    client_avatar: string | null;
    review_text: string;
    rating: number;
    project_name: string | null;
    created_at: string;
}

function StarRating({ rating, interactive, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" disabled={!interactive}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}>
                    <Star className={`w-4 h-4 transition-colors duration-200 ${star <= (hovered || rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                </button>
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const initials = review.client_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const gradients = ['from-violet-500 to-purple-600', 'from-blue-500 to-cyan-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-pink-500 to-rose-600'];
    const gradient = gradients[review.client_name.length % gradients.length];

    return (
        <div className="flex-shrink-0 w-[340px] md:w-[380px]">
            <SpotlightCard className="h-full p-6">
                <div className="relative">
                    <div className="absolute top-0 right-0 opacity-[0.04]"><Quote className="w-8 h-8 text-white" /></div>
                    <div className="mb-4"><StarRating rating={review.rating} /></div>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-4">&ldquo;{review.review_text}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                        {review.client_avatar ? (
                            <img src={review.client_avatar} alt={review.client_name} className="w-9 h-9 rounded-full object-cover ring-1 ring-white/[0.06]" />
                        ) : (
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-[10px] font-bold`}>{initials}</div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{review.client_name}</p>
                            <p className="text-zinc-600 text-xs truncate">
                                {review.client_role}{review.client_role && review.client_company && ' · '}{review.client_company}
                            </p>
                        </div>
                    </div>
                </div>
            </SpotlightCard>
        </div>
    );
}

function ReviewSubmitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState({ client_name: '', client_role: '', client_company: '', review_text: '', rating: 5, project_name: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading'); setErrorMsg('');
        try {
            const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const data = await res.json();
            if (res.ok) { setStatus('success'); setFormData({ client_name: '', client_role: '', client_company: '', review_text: '', rating: 5, project_name: '' }); setTimeout(() => { onClose(); setStatus('idle'); }, 3000); }
            else { setStatus('error'); setErrorMsg(data.error || 'Something went wrong'); }
        } catch { setStatus('error'); setErrorMsg('Failed to submit. Please try again.'); }
    };

    const inputClass = "w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/40 focus:shadow-[0_0_12px_rgba(139,92,246,0.15)] transition-all";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
                    <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.97 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 max-h-[80vh] overflow-y-auto">
                        <div className="bg-[#0c0c12] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
                                    <p className="text-zinc-600 text-sm mt-1">Your review will appear after approval.</p>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.04] text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            {status === 'success' ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-4"><Check className="w-8 h-8 text-green-400" /></div>
                                    <h4 className="text-lg font-bold text-white mb-2">Thank You!</h4>
                                    <p className="text-zinc-500 text-sm">Your review has been submitted.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm text-zinc-500 mb-2 block">Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="p-1 transition-transform hover:scale-125">
                                                    <Star className={`w-6 h-6 transition-colors ${star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="text-sm text-zinc-500 mb-1.5 block">Your Name *</label><input type="text" required value={formData.client_name} onChange={e => setFormData({ ...formData, client_name: e.target.value })} className={inputClass} placeholder="John Doe" /></div>
                                        <div><label className="text-sm text-zinc-500 mb-1.5 block">Role</label><input type="text" value={formData.client_role} onChange={e => setFormData({ ...formData, client_role: e.target.value })} className={inputClass} placeholder="CEO" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="text-sm text-zinc-500 mb-1.5 block">Company</label><input type="text" value={formData.client_company} onChange={e => setFormData({ ...formData, client_company: e.target.value })} className={inputClass} placeholder="Acme Inc." /></div>
                                        <div><label className="text-sm text-zinc-500 mb-1.5 block">Project</label><input type="text" value={formData.project_name} onChange={e => setFormData({ ...formData, project_name: e.target.value })} className={inputClass} placeholder="Website Redesign" /></div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-zinc-500 mb-1.5 block">Your Review *</label>
                                        <textarea required value={formData.review_text} onChange={e => setFormData({ ...formData, review_text: e.target.value })} maxLength={1000} rows={4} className={`${inputClass} resize-none`} placeholder="Share your experience..." />
                                        <span className="text-[10px] text-zinc-700 mt-1 block text-right">{formData.review_text.length}/1000</span>
                                    </div>
                                    {errorMsg && <p className="text-red-400 text-sm">⚠ {errorMsg}</p>}
                                    <button type="submit" disabled={status === 'loading'}
                                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {status === 'loading' ? (<><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>) : (<><Send className="w-4 h-4" /> Submit Review</>)}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            try { const res = await fetch('/api/reviews'); const data = await res.json(); if (Array.isArray(data)) setReviews(data); }
            catch (error) { console.error('Error fetching reviews:', error); }
            finally { setIsLoading(false); }
        }
        fetchReviews();
    }, []);

    const marqueeReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

    return (
        <SectionWrapper id="reviews" label="Testimonials" title="What clients" titleAccent="say.">
            {isLoading ? (
                <div className="flex gap-5 justify-center">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-[340px] h-[200px] rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
                    ))}
                </div>
            ) : reviews.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#000000] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#000000] to-transparent z-10 pointer-events-none" />
                        <div className="overflow-hidden">
                            <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
                                {marqueeReviews.map((review, index) => (
                                    <ReviewCard key={`${review.id}-${index}`} review={review} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center justify-center py-12">
                    <div className="w-14 h-14 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5">
                        <MessageSquareQuote className="w-7 h-7 text-brand-400" />
                    </div>
                    <p className="text-zinc-500 text-center mb-1">No reviews yet.</p>
                    <p className="text-zinc-600 text-sm text-center">Be the first to share your experience!</p>
                </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex justify-center mt-12">
                <button onClick={() => setModalOpen(true)} className="btn-ghost flex items-center gap-2.5 group">
                    <MessageSquareQuote className="w-4 h-4 text-brand-400" />
                    <span>Share Your Experience</span>
                </button>
            </motion.div>

            <ReviewSubmitModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </SectionWrapper>
    );
}
