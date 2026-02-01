'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, Save, X, Trophy, Award, Star, Medal, Crown } from 'lucide-react';
import AddButton from '@/components/admin/AddButton';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    bg: string;
    border: string;
    order_index: number;
}

export default function AchievementsManager() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<Achievement>>({});

    useEffect(() => {
        fetchAchievements();
    }, []);

    async function fetchAchievements() {
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setAchievements(data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave() {
        if (!currentItem.title || !currentItem.description) return;

        try {
            const achievementData = {
                title: currentItem.title,
                description: currentItem.description,
                icon: currentItem.icon || 'Trophy',
                color: currentItem.color || 'text-amber-400',
                bg: currentItem.bg || 'bg-amber-400/10',
                border: currentItem.border || 'border-amber-400/20',
                order_index: currentItem.order_index || achievements.length
            };

            if (currentItem.id) {
                await supabase.from('achievements').update(achievementData).eq('id', currentItem.id);
            } else {
                await supabase.from('achievements').insert([achievementData]);
            }

            setIsEditing(false);
            setCurrentItem({});
            fetchAchievements();
        } catch (error) {
            console.error('Error saving achievement:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this achievement?')) return;

        try {
            await supabase.from('achievements').delete().eq('id', id);
            fetchAchievements();
        } catch (error) {
            console.error('Error deleting achievement:', error);
        }
    }

    if (isLoading) return <div className="p-8 text-white">Loading achievements...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
                    <p className="text-zinc-400">Manage your awards and honors.</p>
                </div>
                <AddButton onClick={() => { setCurrentItem({}); setIsEditing(true); }} label="Add Achievement" />
            </div>

            {isEditing && (
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold text-white mb-4">{currentItem.id ? 'Edit Achievement' : 'New Achievement'}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Title</label>
                            <input
                                type="text"
                                value={currentItem.title || ''}
                                onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Hackathon Winner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Icon (Lucide Name)</label>
                            <select
                                value={currentItem.icon || 'Trophy'}
                                onChange={e => setCurrentItem({ ...currentItem, icon: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="Trophy">Trophy</option>
                                <option value="Award">Award</option>
                                <option value="Star">Star</option>
                                <option value="Medal">Medal</option>
                                <option value="Crown">Crown</option>
                            </select>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm text-zinc-400">Description</label>
                            <textarea
                                value={currentItem.description || ''}
                                onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-24"
                                placeholder="Describe the achievement..."
                            />
                        </div>
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
                            Save Achievement
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((item) => (
                    <div key={item.id} className="bg-zinc-900 border border-white/10 rounded-xl p-6 group hover:border-indigo-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-white/5">
                                {item.icon === 'Star' ? <Star className="w-6 h-6 text-yellow-500" /> :
                                    item.icon === 'Award' ? <Award className="w-6 h-6 text-orange-500" /> :
                                        item.icon === 'Medal' ? <Medal className="w-6 h-6 text-blue-500" /> :
                                            item.icon === 'Crown' ? <Crown className="w-6 h-6 text-purple-500" /> :
                                                <Trophy className="w-6 h-6 text-amber-500" />}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setCurrentItem(item); setIsEditing(true); }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-3">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
