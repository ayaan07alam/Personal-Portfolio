'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquareQuote, X, Send, Loader2, Check, Quote } from 'lucide-react';

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
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
                >
                    <Star
                        className={`w-4 h-4 transition-colors duration-200 ${star <= (hovered || rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-zinc-700'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
    const initials = review.client_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    // Generate a consistent gradient based on the client name
    const gradients = [
        'from-violet-500 to-purple-600',
        'from-blue-500 to-cyan-600',
        'from-emerald-500 to-teal-600',
        'from-amber-500 to-orange-600',
        'from-pink-500 to-rose-600',
        'from-indigo-500 to-blue-600',
    ];
    const gradient = gradients[review.client_name.length % gradients.length];

    return (
        <div className="flex-shrink-0 w-[360px] md:w-[400px] group">
            <div className="relative h-full p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.06] hover:border-brand-500/30 transition-all duration-500 overflow-hidden">
                {/* Subtle hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-transparent opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl" />

                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-[0.06]">
                    <Quote className="w-12 h-12 text-white" />
                </div>

                <div className="relative z-10">
                    {/* Stars */}
                    <div className="mb-4">
                        <StarRating rating={review.rating} />
                    </div>

                    {/* Review Text */}
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6 line-clamp-4">
                        "{review.review_text}"
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                        {review.client_avatar ? (
                            <img
                                src={review.client_avatar}
                                alt={review.client_name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                            />
                        ) : (
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10`}>
                                {initials}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{review.client_name}</p>
                            <p className="text-zinc-500 text-xs truncate">
                                {review.client_role}{review.client_role && review.client_company && ' · '}{review.client_company}
                            </p>
                        </div>
                        {review.project_name && (
                            <span className="hidden sm:inline-flex px-2 py-1 text-[10px] font-mono text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-md truncate max-w-[100px]">
                                {review.project_name}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReviewSubmitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState({
        client_name: '',
        client_role: '',
        client_company: '',
        review_text: '',
        rating: 5,
        project_name: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setFormData({ client_name: '', client_role: '', client_company: '', review_text: '', rating: 5, project_name: '' });
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                }, 3000);
            } else {
                setStatus('error');
                setErrorMsg(data.error || 'Something went wrong');
            }
        } catch {
            setStatus('error');
            setErrorMsg('Failed to submit. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.97 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
                                    <p className="text-zinc-500 text-sm mt-1">Your review will appear after approval.</p>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                        <Check className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Thank You!</h4>
                                    <p className="text-zinc-400 text-sm">Your review has been submitted and will appear after approval.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Rating */}
                                    <div>
                                        <label className="text-sm text-zinc-400 mb-2 block">Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className="p-1 transition-transform hover:scale-125"
                                                >
                                                    <Star className={`w-6 h-6 transition-colors ${star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Name & Role */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-zinc-400 mb-1.5 block">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.client_name}
                                                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-zinc-400 mb-1.5 block">Role</label>
                                            <input
                                                type="text"
                                                value={formData.client_role}
                                                onChange={e => setFormData({ ...formData, client_role: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                                                placeholder="CEO"
                                            />
                                        </div>
                                    </div>

                                    {/* Company & Project */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-zinc-400 mb-1.5 block">Company</label>
                                            <input
                                                type="text"
                                                value={formData.client_company}
                                                onChange={e => setFormData({ ...formData, client_company: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                                                placeholder="Acme Inc."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-zinc-400 mb-1.5 block">Project</label>
                                            <input
                                                type="text"
                                                value={formData.project_name}
                                                onChange={e => setFormData({ ...formData, project_name: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                                                placeholder="Website Redesign"
                                            />
                                        </div>
                                    </div>

                                    {/* Review Text */}
                                    <div>
                                        <label className="text-sm text-zinc-400 mb-1.5 block">Your Review *</label>
                                        <textarea
                                            required
                                            value={formData.review_text}
                                            onChange={e => setFormData({ ...formData, review_text: e.target.value })}
                                            maxLength={1000}
                                            rows={4}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors resize-none"
                                            placeholder="Share your experience working together..."
                                        />
                                        <span className="text-xs text-zinc-600 mt-1 block text-right">
                                            {formData.review_text.length}/1000
                                        </span>
                                    </div>

                                    {/* Error */}
                                    {errorMsg && (
                                        <p className="text-red-400 text-sm">⚠ {errorMsg}</p>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Submit Review</>
                                        )}
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
            try {
                const res = await fetch('/api/reviews');
                const data = await res.json();
                if (Array.isArray(data)) setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReviews();
    }, []);

    // Duplicate reviews for seamless infinite scroll effect
    const marqueeReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

    return (
        <section id="reviews" className="py-32 bg-background relative z-10 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/[0.03] blur-[80px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Testimonials</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight text-center"
                    >
                        What Clients Say
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 mt-4 text-center max-w-md"
                    >
                        Real feedback from people I&apos;ve had the pleasure of working with.
                    </motion.p>
                </div>

                {/* Reviews Content */}
                {isLoading ? (
                    <div className="flex gap-6 justify-center">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-[360px] h-[200px] rounded-2xl bg-zinc-900/60 border border-white/[0.06] animate-pulse" />
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Marquee container */}
                        <div className="relative">
                            {/* Left fade */}
                            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                            {/* Right fade */}
                            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                            <div className="overflow-hidden">
                                <div
                                    className="flex gap-6 animate-marquee hover:[animation-play-state:paused]"
                                    style={{
                                        width: 'max-content',
                                    }}
                                >
                                    {marqueeReviews.map((review, index) => (
                                        <ReviewCard key={`${review.id}-${index}`} review={review} index={index} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Empty state — only show the CTA */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center py-12"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
                            <MessageSquareQuote className="w-8 h-8 text-brand-400" />
                        </div>
                        <p className="text-zinc-500 text-center mb-2">No reviews yet.</p>
                        <p className="text-zinc-600 text-sm text-center">Be the first to share your experience!</p>
                    </motion.div>
                )}

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center mt-12"
                >
                    <button
                        onClick={() => setModalOpen(true)}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-900 border border-white/10 hover:border-brand-500/40 text-white font-medium transition-all duration-300 overflow-hidden"
                    >
                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-brand-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                        <MessageSquareQuote className="w-5 h-5 text-brand-400 relative z-10" />
                        <span className="relative z-10">Share Your Experience</span>
                    </button>
                </motion.div>
            </div>

            {/* Submit Modal */}
            <ReviewSubmitModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </section>
    );
}
