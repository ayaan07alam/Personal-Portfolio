'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Save, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import type { Skill } from '@/types';

export default function SkillsAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const emptySkill: Partial<Skill> = {
        name: '',
        category: 'Backend', // Default
        proficiency: 80,
        order_index: 0,
    };

    const categories = ['Backend', 'Frontend', 'Database', 'DevOps', 'Cloud', 'Tools', 'Languages'];

    useEffect(() => {
        fetchSkills();
    }, []);

    async function fetchSkills() {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setSkills(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(skill: Partial<Skill>) {
        setSaving(true);

        try {
            if (skill.id) {
                // Update existing
                const { error } = await supabase
                    .from('skills')
                    .update(skill)
                    .eq('id', skill.id);

                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('skills')
                    .insert([{ ...skill, order_index: skills.length }]);

                if (error) throw error;
            }

            alert('Skill saved successfully!');
            setEditingSkill(null);
            setIsCreating(false);
            fetchSkills();
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving skill');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Skill deleted successfully!');
            fetchSkills();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting skill');
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (isCreating || editingSkill) {
        const skill = editingSkill || emptySkill;

        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            setEditingSkill(null);
                            setIsCreating(false);
                        }}
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">
                            {editingSkill ? 'Edit Skill' : 'New Skill'}
                        </h1>
                        <p className="text-gray-400">Skill details</p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(skill as Skill);
                    }}
                    className="space-y-6"
                >
                    <div className="glass rounded-xl p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Skill Name *
                            </label>
                            <input
                                type="text"
                                value={skill.name || ''}
                                onChange={(e) => setEditingSkill({ ...skill as Skill, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                value={skill.category || 'Backend'}
                                onChange={(e) => setEditingSkill({ ...skill as Skill, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Proficiency (0-100)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={skill.proficiency || 80}
                                    onChange={(e) => setEditingSkill({ ...skill as Skill, proficiency: parseInt(e.target.value) })}
                                    className="flex-1"
                                />
                                <span className="text-white font-mono w-12 text-right">{skill.proficiency}%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={skill.order_index || 0}
                                onChange={(e) => setEditingSkill({ ...skill as Skill, order_index: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingSkill(null);
                                setIsCreating(false);
                            }}
                            className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Skill'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Skills</h1>
                        <p className="text-gray-400">Manage your technical skills</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingSkill(emptySkill as Skill);
                        setIsCreating(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Skill
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                    <div key={skill.id} className="glass rounded-xl p-6 glow-card flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{skill.name}</h3>
                            <p className="text-sm text-primary-400 font-mono mb-2">{skill.category}</p>
                            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-500" style={{ width: `${skill.proficiency}%` }}></div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingSkill(skill)}
                                className="p-2 glass rounded-lg hover:bg-primary-500/20 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(skill.id)}
                                className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {skills.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    No skills found. Add one to get started.
                </div>
            )}
        </div>
    );
}
