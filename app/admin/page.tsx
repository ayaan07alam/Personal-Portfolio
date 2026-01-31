import Link from 'next/link';
import {
    Home,
    User,
    Award,
    Briefcase,
    FolderKanban,
    GraduationCap,
    Mail,
    Eye
} from 'lucide-react';

export default function AdminDashboard() {
    const sections = [
        { name: 'Hero Section', href: '/admin/hero', icon: Home, description: 'Main landing section with title and CTA' },
        { name: 'About', href: '/admin/about', icon: User, description: 'About me section with bio and image' },
        { name: 'Skills', href: '/admin/skills', icon: Award, description: 'Skills and expertise' },
        { name: 'Experience', href: '/admin/experience', icon: Briefcase, description: 'Work history and experience' },
        { name: 'Projects', href: '/admin/projects', icon: FolderKanban, description: 'Portfolio projects' },
        { name: 'Education', href: '/admin/education', icon: GraduationCap, description: 'Educational background' },
        { name: 'Contact', href: '/admin/contact', icon: Mail, description: 'Contact information and social links' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
                <p className="text-gray-400">Manage your portfolio content</p>
            </div>

            <div className="mb-6">
                <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-primary-500/20 transition-colors"
                >
                    <Eye className="w-5 h-5" />
                    View Public Portfolio
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.name}
                            href={section.href}
                            className="glass rounded-xl p-6 glow-card group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                                    <Icon className="w-6 h-6 text-primary-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">{section.name}</h2>
                            </div>
                            <p className="text-gray-400 text-sm">{section.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
