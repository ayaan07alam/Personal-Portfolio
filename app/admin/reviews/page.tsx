'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Pencil, Trash2, Save, X, Star, CheckCircle, Clock, MessageSquareQuote } from 'lucide-react';
import AddButton from '@/components/admin/AddButton';

interface Review {
    id: string;
    client_name: string;
    client_role: string | null;
    client_company: string | null;
    client_avatar: string | null;
    review_text: string;
    rating: number;
    project_name: string | null;
    is_approved: boolean;
    order_index: number;
    created_at: string;
}

export default function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<Review>>({});
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleApprove(id: string) {
        try {
            await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
            fetchReviews();
        } catch (error) {
            console.error('Error approving review:', error);
        }
    }

    async function handleReject(id: string) {
        try {
            await supabase.from('reviews').update({ is_approved: false }).eq('id', id);
            fetchReviews();
        } catch (error) {
            console.error('Error rejecting review:', error);
        }
    }

    async function handleSave() {
        if (!currentItem.client_name || !currentItem.review_text) return;

        try {
            const reviewData = {
                client_name: currentItem.client_name,
                client_role: currentItem.client_role || null,
                client_company: currentItem.client_company || null,
                review_text: currentItem.review_text,
                rating: currentItem.rating || 5,
                project_name: currentItem.project_name || null,
                is_approved: currentItem.is_approved ?? false,
                order_index: currentItem.order_index ?? reviews.length,
            };

            if (currentItem.id) {
                await supabase.from('reviews').update(reviewData).eq('id', currentItem.id);
            } else {
                await supabase.from('reviews').insert([reviewData]);
            }

            setIsEditing(false);
            setCurrentItem({});
            fetchReviews();
        } catch (error) {
            console.error('Error saving review:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await supabase.from('reviews').delete().eq('id', id);
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    }

    const filteredReviews = reviews.filter(r => {
        if (filter === 'pending') return !r.is_approved;
        if (filter === 'approved') return r.is_approved;
        return true;
    });

    const pendingCount = reviews.filter(r => !r.is_approved).length;
    const approvedCount = reviews.filter(r => r.is_approved).length;

    if (isLoading) return <div className="p-8 text-white">Loading reviews...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Client Reviews</h1>
                    <p className="text-zinc-400">Manage and moderate client testimonials.</p>
                </div>
                <div className="flex gap-3">
                    <AddButton onClick={() => { setCurrentItem({ is_approved: true }); setIsEditing(true); }} label="Add Review" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">{reviews.length}</p>
                    <p className="text-xs text-zinc-500 mt-1">Total</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-amber-400">{pendingCount}</p>
                    <p className="text-xs text-zinc-500 mt-1">Pending</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-400">{approvedCount}</p>
                    <p className="text-xs text-zinc-500 mt-1">Approved</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'pending', 'approved'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                            }`}
                    >
                        {f} {f === 'pending' && pendingCount > 0 && `(${pendingCount})`}
                    </button>
                ))}
            </div>

            {/* Edit Form */}
            {isEditing && (
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">{currentItem.id ? 'Edit Review' : 'New Review'}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Client Name *</label>
                            <input
                                type="text"
                                value={currentItem.client_name || ''}
                                onChange={e => setCurrentItem({ ...currentItem, client_name: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Role</label>
                            <input
                                type="text"
                                value={currentItem.client_role || ''}
                                onChange={e => setCurrentItem({ ...currentItem, client_role: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="CEO"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Company</label>
                            <input
                                type="text"
                                value={currentItem.client_company || ''}
                                onChange={e => setCurrentItem({ ...currentItem, client_company: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Acme Inc."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Project Name</label>
                            <input
                                type="text"
                                value={currentItem.project_name || ''}
                                onChange={e => setCurrentItem({ ...currentItem, project_name: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Website Redesign"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Rating</label>
                            <div className="flex gap-1 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setCurrentItem({ ...currentItem, rating: star })}
                                        className="p-1 hover:scale-125 transition-transform"
                                    >
                                        <Star className={`w-6 h-6 ${star <= (currentItem.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Review Text *</label>
                        <textarea
                            value={currentItem.review_text || ''}
                            onChange={e => setCurrentItem({ ...currentItem, review_text: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-24"
                            placeholder="The review content..."
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={currentItem.is_approved ?? false}
                                onChange={e => setCurrentItem({ ...currentItem, is_approved: e.target.checked })}
                                className="rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-zinc-400">Approved (visible on site)</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Review
                        </button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        <MessageSquareQuote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No {filter !== 'all' ? filter : ''} reviews yet.</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className={`bg-zinc-900 border rounded-xl p-5 group transition-colors ${review.is_approved ? 'border-green-500/20' : 'border-amber-500/20'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {/* Status Badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${review.is_approved
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {review.is_approved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {review.is_approved ? 'Approved' : 'Pending'}
                                        </span>

                                        {/* Stars */}
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                                            ))}
                                        </div>

                                        {review.project_name && (
                                            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                                {review.project_name}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-white text-sm mb-2 leading-relaxed">"{review.review_text}"</p>

                                    <p className="text-zinc-500 text-sm">
                                        — <span className="text-zinc-300 font-medium">{review.client_name}</span>
                                        {review.client_role && <span>, {review.client_role}</span>}
                                        {review.client_company && <span> at {review.client_company}</span>}
                                    </p>

                                    <p className="text-zinc-700 text-xs mt-2">
                                        {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                                    {!review.is_approved && (
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors"
                                            title="Approve"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                    {review.is_approved && (
                                        <button
                                            onClick={() => handleReject(review.id)}
                                            className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                                            title="Unapprove"
                                        >
                                            <Clock className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setCurrentItem(review); setIsEditing(true); }}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
