'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import {
    Menu,
    X,
    FolderKanban,
    GraduationCap,
    Mail,
    LogOut,
    Home,
    User,
    Award,
    Briefcase,
    Trophy
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Hero Section', href: '/admin/hero', icon: Home },
        { name: 'About', href: '/admin/about', icon: User },
        { name: 'Skills', href: '/admin/skills', icon: Award },
        { name: 'Experience', href: '/admin/experience', icon: Briefcase },
        { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
        { name: 'Achievements', href: '/admin/achievements', icon: Trophy },
        { name: 'Education', href: '/admin/education', icon: GraduationCap },
        { name: 'Contact', href: '/admin/contact', icon: Mail },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-primary-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Sidebar - Desktop */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col glass border-r border-white/10">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex items-center flex-shrink-0 px-4 mb-8">
                            <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
                        </div>
                        <nav className="flex-1 space-y-1 px-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${isActive
                                                ? 'bg-primary-500/20 text-white border border-primary-500/30'
                                                : 'text-gray-300 hover:bg-primary-500/10 hover:text-white'
                                            }`}
                                    >
                                        <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                                        {item.name}
                                        {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-white/10 p-4">
                        <button
                            onClick={handleLogout}
                            className="group flex w-full items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-red-500/20 text-gray-300 hover:text-white transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold gradient-text">Admin</h1>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-white/10"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-30 glass">
                    <nav className="pt-20 px-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg hover:bg-primary-500/20 text-gray-300 hover:text-white transition-colors"
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="group flex w-full items-center px-3 py-3 text-sm font-medium rounded-lg hover:bg-red-500/20 text-gray-300 hover:text-white transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </nav>
                </div>
            )}

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                <main className="flex-1 pt-20 md:pt-0">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
