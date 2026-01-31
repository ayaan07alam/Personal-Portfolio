'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Save, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import type { Education } from '@/types'; // You'll need to define this type or use 'any' temporarily

export default function EducationAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [educationList, setEducationList] = useState<Education[]>([]);
    const [editingEdu, setEditingEdu] = useState<Education | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const emptyEdu: Partial<Education> = {
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        is_current: false,
        description: '',
        order_index: 0,
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    async function fetchEducation() {
        try {
            const { data, error } = await supabase
                .from('education')
                .select('*')
                .order('start_date', { ascending: false });

            if (error) throw error;
            setEducationList(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(edu: Partial<Education>) {
        setSaving(true);

        try {
            if (edu.id) {
                // Update
                const { error } = await supabase
                    .from('education')
                    .update(edu)
                    .eq('id', edu.id);

                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('education')
                    .insert([{ ...edu, order_index: educationList.length }]);

                if (error) throw error;
            }

            alert('Education saved successfully!');
            setEditingEdu(null);
            setIsCreating(false);
            fetchEducation();
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving education');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this?')) return;

        try {
            const { error } = await supabase
                .from('education')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Deleted successfully!');
            fetchEducation();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting');
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (isCreating || editingEdu) {
        const edu = editingEdu || emptyEdu;

        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            setEditingEdu(null);
                            setIsCreating(false);
                        }}
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">
                            {editingEdu ? 'Edit Edu' : 'New Edu'}
                        </h1>
                        <p className="text-gray-400">Education details</p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(edu as Education);
                    }}
                    className="space-y-6"
                >
                    <div className="glass rounded-xl p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Institution Name *
                            </label>
                            <input
                                type="text"
                                value={edu.institution || ''}
                                onChange={(e) => setEditingEdu({ ...edu as Education, institution: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Degree *
                                </label>
                                <input
                                    type="text"
                                    value={edu.degree || ''}
                                    onChange={(e) => setEditingEdu({ ...edu as Education, degree: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                    placeholder="B.Tech, MS, etc."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Field of Study
                                </label>
                                <input
                                    type="text"
                                    value={edu.field_of_study || ''}
                                    onChange={(e) => setEditingEdu({ ...edu as Education, field_of_study: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                    placeholder="Computer Science"
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
                                    value={edu.start_date || ''}
                                    onChange={(e) => setEditingEdu({ ...edu as Education, start_date: e.target.value })}
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
                                    value={edu.end_date || ''}
                                    onChange={(e) => setEditingEdu({ ...edu as Education, end_date: e.target.value })}
                                    disabled={edu.is_current}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white disabled:opacity-50"
                                />
                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={edu.is_current || false}
                                        onChange={(e) => setEditingEdu({ ...edu as Education, is_current: e.target.checked, end_date: null })}
                                    />
                                    <span className="text-sm text-gray-400">I am currently studying here</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description / Grade
                            </label>
                            <textarea
                                value={edu.description || ''}
                                onChange={(e) => setEditingEdu({ ...edu as Education, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="CGPA, Activities, etc."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingEdu(null);
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
                            {saving ? 'Saving...' : 'Save Education'}
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
                        <h1 className="text-3xl font-bold gradient-text">Education</h1>
                        <p className="text-gray-400">Manage academic background</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingEdu(emptyEdu as Education);
                        setIsCreating(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Education
                </button>
            </div>

            <div className="space-y-4">
                {educationList.map((edu) => (
                    <div key={edu.id} className="glass rounded-xl p-6 glow-card flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{edu.institution}</h3>
                            <p className="text-accent-400 font-medium mb-1">{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}</p>
                            <p className="text-sm text-gray-500 font-mono mb-2">
                                {new Date(edu.start_date).getFullYear()} &mdash; {edu.is_current ? 'Present' : (edu.end_date ? new Date(edu.end_date).getFullYear() : '')}
                            </p>
                            {edu.description && <p className="text-gray-400 text-sm line-clamp-2">{edu.description}</p>}
                        </div>

                        <div className="flex items-start gap-2">
                            <button
                                onClick={() => setEditingEdu(edu)}
                                className="p-2 glass rounded-lg hover:bg-primary-500/20 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(edu.id)}
                                className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    </div>
                ))}

                {educationList.length === 0 && !loading && (
                    <div className="text-center py-12 glass rounded-xl text-gray-500">
                        No education records found.
                    </div>
                )}
            </div>
        </div>
    );
}
