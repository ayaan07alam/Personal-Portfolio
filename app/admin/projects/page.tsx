'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types';

export default function ProjectsAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const emptyProject: Partial<Project> = {
        title: '',
        description: '',
        long_description: '',
        image: null,
        demo_url: '',
        github_url: '',
        technologies: [],
        featured: false,
        order_index: 0,
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(project: Partial<Project>) {
        setSaving(true);

        try {
            if (project.id) {
                // Update existing
                const { error } = await supabase
                    .from('projects')
                    .update(project)
                    .eq('id', project.id);

                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('projects')
                    .insert([{ ...project, order_index: projects.length }]);

                if (error) throw error;
            }

            alert('Project saved successfully!');
            setEditingProject(null);
            setIsCreating(false);
            fetchProjects();
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving project');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Project deleted successfully!');
            fetchProjects();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting project');
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (isCreating || editingProject) {
        const project = editingProject || emptyProject;

        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            setEditingProject(null);
                            setIsCreating(false);
                        }}
                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">
                            {editingProject ? 'Edit Project' : 'New Project'}
                        </h1>
                        <p className="text-gray-400">Project details</p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(project as Project);
                    }}
                    className="space-y-6"
                >
                    <div className="glass rounded-xl p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Project Title *
                            </label>
                            <input
                                type="text"
                                value={project.title || ''}
                                onChange={(e) => setEditingProject({ ...project as Project, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Short Description *
                            </label>
                            <textarea
                                value={project.description || ''}
                                onChange={(e) => setEditingProject({ ...project as Project, description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Long Description
                            </label>
                            <textarea
                                value={project.long_description || ''}
                                onChange={(e) => setEditingProject({ ...project as Project, long_description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Demo URL
                                </label>
                                <input
                                    type="url"
                                    value={project.demo_url || ''}
                                    onChange={(e) => setEditingProject({ ...project as Project, demo_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    value={project.github_url || ''}
                                    onChange={(e) => setEditingProject({ ...project as Project, github_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                    placeholder="https://github.com/user/repo"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Technologies (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={(project.technologies || []).join(', ')}
                                onChange={(e) => setEditingProject({
                                    ...project as Project,
                                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                                placeholder="React, Next.js, TypeScript"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={project.featured || false}
                                onChange={(e) => setEditingProject({ ...project as Project, featured: e.target.checked })}
                                className="w-4 h-4 rounded"
                            />
                            <label className="text-sm text-gray-300">
                                Featured Project
                            </label>
                        </div>

                        <ImageUploader
                            currentImage={project.image}
                            onUploadComplete={(url) => setEditingProject({ ...project as Project, image: url })}
                            folder="projects"
                            label="Project Image"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingProject(null);
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
                            {saving ? 'Saving...' : 'Save Project'}
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
                        <h1 className="text-3xl font-bold gradient-text">Projects</h1>
                        <p className="text-gray-400">Manage your portfolio projects</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingProject(emptyProject as Project);
                        setIsCreating(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-semibold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 glass rounded-xl">
                    <p className="text-gray-400 mb-4">No projects yet</p>
                    <button
                        onClick={() => {
                            setEditingProject(emptyProject as Project);
                            setIsCreating(true);
                        }}
                        className="px-4 py-2 bg-primary-500/20 rounded-lg hover:bg-primary-500/30 transition-colors"
                    >
                        Create your first project
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="glass rounded-xl overflow-hidden glow-card">
                            <div className="relative h-48 bg-gradient-to-br from-primary-900/50 to-accent-900/50">
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">No image</p>
                                    </div>
                                )}
                                {project.featured && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-accent-500 text-white rounded text-xs font-bold">
                                        Featured
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.slice(0, 3).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingProject(project)}
                                        className="flex-1 px-3 py-2 glass rounded-lg hover:bg-primary-500/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="px-3 py-2 glass rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
