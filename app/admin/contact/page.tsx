'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ContactInfo } from '@/types';

export default function ContactAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<ContactInfo>({
        id: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        twitter: '',
        portfolio_url: '',
        updated_at: new Date().toISOString()
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const { data: contactData, error } = await supabase
                .from('contact_info')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (contactData) {
                setData(contactData);
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
                .from('contact_info')
                .upsert({
                    ...data,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            alert('Contact info updated successfully!');
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
                    <h1 className="text-3xl font-bold gradient-text">Contact Information</h1>
                    <p className="text-gray-400">Manage your contact details and social links</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="glass rounded-xl p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={data.phone || ''}
                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="+1 (123) 456-7890"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={data.location || ''}
                                onChange={(e) => setData({ ...data, location: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/10 my-6"></div>
                    <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={data.linkedin || ''}
                                onChange={(e) => setData({ ...data, linkedin: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                GitHub
                            </label>
                            <input
                                type="url"
                                value={data.github || ''}
                                onChange={(e) => setData({ ...data, github: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Twitter / X (Optional)
                            </label>
                            <input
                                type="url"
                                value={data.twitter || ''}
                                onChange={(e) => setData({ ...data, twitter: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Portfolio / Website (Optional)
                            </label>
                            <input
                                type="url"
                                value={data.portfolio_url || ''}
                                onChange={(e) => setData({ ...data, portfolio_url: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            />
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
