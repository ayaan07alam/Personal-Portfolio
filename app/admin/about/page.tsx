'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, ArrowLeft } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import type { AboutSection } from '@/types';

export default function AboutAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<AboutSection>({
        id: '',
        title: '',
        content: '',
        image: null,
        resume_url: '',
        updated_at: new Date().toISOString()
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const { data: aboutData, error } = await supabase
                .from('about_section')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (aboutData) {
                setData(aboutData);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    const { showToast } = useToast();

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('about_section')
                .upsert({
                    ...data,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            showToast('success', 'About section updated successfully!');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving:', error);
            showToast('error', `Error saving: ${error.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin"
                    className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold gradient-text">About Section</h1>
                    <p className="text-gray-400">Manage your bio and resume</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="glass rounded-xl p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            placeholder="About Me"
                            required
                        />
                    </div>

                    <RichTextEditor
                        label="Bio Content"
                        value={data.content}
                        onChange={(html) => setData({ ...data, content: html })}
                        placeholder="Write your bio here... (Supports bullet points)"
                        minHeight="200px"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <ImageUploader
                            currentImage={data.image}
                            onUploadComplete={(url) => setData({ ...data, image: url })}
                            folder="about"
                            label="Profile Image (Optional)"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Resume URL
                            </label>
                            <input
                                type="text"
                                value={data.resume_url || ''}
                                onChange={(e) => setData({ ...data, resume_url: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="/resume.pdf or Google Drive Link"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Use '/resume' to link to the built-in printable resume page.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin"
                        className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
