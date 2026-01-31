'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { HeroSection } from '@/types';

export default function HeroAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<HeroSection>({
        id: '',
        title: '',
        subtitle: '',
        description: '',
        cta_text: '',
        cta_link: '',
        background_image: null,
        profile_image: null,
        updated_at: new Date().toISOString(),
        availability_status: 'Available for work'
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const { data: heroData, error } = await supabase
                .from('hero_section')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (heroData) {
                setData(heroData);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('hero_section')
                .upsert({
                    ...data,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            alert('Hero section updated successfully!');
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving changes');
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
                    <h1 className="text-3xl font-bold gradient-text">Hero Section</h1>
                    <p className="text-gray-400">Edit your landing page content</p>
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
                            placeholder="Hi, I'm Your Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            value={data.subtitle}
                            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            placeholder="Full Stack Developer"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            placeholder="Brief description about yourself..."
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                CTA Button Text
                            </label>
                            <input
                                type="text"
                                value={data.cta_text}
                                onChange={(e) => setData({ ...data, cta_text: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="View My Work"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                CTA Button Link
                            </label>
                            <input
                                type="text"
                                value={data.cta_link}
                                onChange={(e) => setData({ ...data, cta_link: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="#projects"
                            />
                        </div>
                    </div>

                    <ImageUploader
                        currentImage={data.profile_image}
                        onUploadComplete={(url) => setData({ ...data, profile_image: url })}
                        folder="hero"
                        label="Profile Image"
                    />

                    <ImageUploader
                        currentImage={data.background_image}
                        onUploadComplete={(url) => setData({ ...data, background_image: url })}
                        folder="hero"
                        label="Background Image (Optional)"
                    />
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
