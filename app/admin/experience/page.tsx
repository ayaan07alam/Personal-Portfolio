'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Save, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import type { Experience } from '@/types';

export default function ExperienceAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const emptyExp: Partial<Experience> = {
        company: '',
        position: '',
        description: '',
        start_date: '',
        is_current: false,
        location: '',
        order_index: 0,
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    async function fetchExperiences() {
        try {
            const { data, error } = await supabase
                .from('experiences') // Note the table name in migration is 'experiences'
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setExperiences(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(exp: Partial<Experience>) {
        setSaving(true);

        try {
            if (exp.id) {
                // Update
                const { error } = await supabase
                    .from('experiences')
                    .update(exp)
                    .eq('id', exp.id);

                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('experiences')
                    .insert([{ ...exp, order_index: experiences.length }]);

                if (error) throw error;
            }

            alert('Experience saved successfully!');
            setEditingExp(null);
            setIsCreating(false);
            fetchExperiences();
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving experience');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            const { error } = await supabase
                .from('experiences')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Experience deleted successfully!');
            fetchExperiences();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting experience');
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (isCreating || editingExp) {
        const exp = editingExp || emptyExp;

        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            setEditingExp(null);
                            setIsCreating(false);
                        }}
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">
                            {editingExp ? 'Edit Experience' : 'New Experience'}
                        </h1>
                        <p className="text-gray-400">Work history details</p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(exp as Experience);
                    }}
                    className="space-y-6"
                >
                    <div className="glass rounded-xl p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={exp.company || ''}
                                    onChange={(e) => setEditingExp({ ...exp as Experience, company: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Position / Role *
                                </label>
                                <input
                                    type="text"
                                    value={exp.position || ''}
                                    onChange={(e) => setEditingExp({ ...exp as Experience, position: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={exp.start_date || ''}
                                    onChange={(e) => setEditingExp({ ...exp as Experience, start_date: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={exp.end_date || ''}
                                    onChange={(e) => setEditingExp({ ...exp as Experience, end_date: e.target.value })}
                                    disabled={exp.is_current}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white disabled:opacity-50"
                                />
                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={exp.is_current || false}
                                        onChange={(e) => setEditingExp({ ...exp as Experience, is_current: e.target.checked, end_date: null })}
                                    />
                                    <span className="text-sm text-gray-400">I currently work here</span>
                                </div>
                            </div>
                        </div>

                        <RichTextEditor
                            value={exp.description || ''}
                            onChange={(html) => setEditingExp({ ...exp as Experience, description: html })}
                            label="Description"
                            minHeight="200px"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Location (Optional)
                            </label>
                            <input
                                type="text"
                                value={exp.location || ''}
                                onChange={(e) => setEditingExp({ ...exp as Experience, location: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingExp(null);
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
                            {saving ? 'Saving...' : 'Save Experience'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Experience</h1>
                        <p className="text-gray-400">Manage your work history</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingExp(emptyExp as Experience);
                        setIsCreating(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Experience
                </button>
            </div>

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="glass rounded-xl p-6 glow-card flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white max-w-lg">{exp.company}</h3>
                            <p className="text-accent-400 font-medium mb-1">{exp.position}</p>
                            <p className="text-sm text-gray-500 font-mono mb-2">
                                {new Date(exp.start_date).getFullYear()} &mdash; {exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).getFullYear() : '')}
                            </p>
                            <p className="text-gray-400 text-sm line-clamp-2 max-w-2xl">{exp.description}</p>
                        </div>

                        <div className="flex items-start gap-2">
                            <button
                                onClick={() => setEditingExp(exp)}
                                className="p-2 glass rounded-lg hover:bg-primary-500/20 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(exp.id)}
                                className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    </div>
                ))}

                {experiences.length === 0 && !loading && (
                    <div className="text-center py-12 glass rounded-xl text-gray-500">
                        No work experience added yet.
                    </div>
                )}
            </div>
        </div>
    );
}
