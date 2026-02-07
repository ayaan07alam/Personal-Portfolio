'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';
import VideoUploader from '@/components/admin/VideoUploader';
import { Save, ArrowLeft, Plus, Trash2, Edit2, Loader2, Link as LinkIcon, Github } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsAdminPage() {
    const router = useRouter();
    const { showToast } = useToast();
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
            showToast('error', 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(project: Partial<Project>) {
        if (!project.title) {
            showToast('error', 'Title is required');
            return;
        }
        setSaving(true);

        try {
            if (project.id) {
                // Update existing
                const { error } = await supabase
                    .from('projects')
                    .update(project)
                    .eq('id', project.id);

                if (error) throw error;
                showToast('success', 'Project updated successfully');
            } else {
                // Create new
                const { error } = await supabase
                    .from('projects')
                    .insert([{ ...project, order_index: projects.length }]);

                if (error) throw error;
                showToast('success', 'Project created successfully');
            }

            setEditingProject(null);
            setIsCreating(false);
            fetchProjects();
            router.refresh();
        } catch (error) {
            console.error('Error saving:', error);
            showToast('error', 'Failed to save project');
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

            showToast('success', 'Project deleted successfully');
            fetchProjects();
        } catch (error) {
            console.error('Error deleting:', error);
            showToast('error', 'Failed to delete project');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
        );
    }

    if (isCreating || editingProject) {
        const project = editingProject || emptyProject;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            setEditingProject(null);
                            setIsCreating(false);
                        }}
                        className="p-3 glass rounded-xl hover:bg-white/10 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            {editingProject ? 'Edit Project' : 'New Project'}
                        </h1>
                        <p className="text-zinc-400">Manage project details and content</p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(project as Project);
                    }}
                    className="space-y-8"
                >
                    <div className="glass-card p-8 rounded-3xl space-y-8">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={project.title || ''}
                                        onChange={(e) => setEditingProject({ ...project as Project, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-white placeholder-zinc-600"
                                        placeholder="e.g. E-Commerce Platform"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Technologies
                                    </label>
                                    <input
                                        type="text"
                                        value={(project.technologies || []).join(', ')}
                                        onChange={(e) => setEditingProject({
                                            ...project as Project,
                                            technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                        })}
                                        className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-white placeholder-zinc-600"
                                        placeholder="React, Next.js, TypeScript (comma separated)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Demo URL
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="url"
                                            value={project.demo_url || ''}
                                            onChange={(e) => setEditingProject({ ...project as Project, demo_url: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-white placeholder-zinc-600"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        GitHub URL
                                    </label>
                                    <div className="relative">
                                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="url"
                                            value={project.github_url || ''}
                                            onChange={(e) => setEditingProject({ ...project as Project, github_url: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-white placeholder-zinc-600"
                                            placeholder="https://github.com/user/repo"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editors */}
                        <div className="space-y-8 border-t border-white/5 pt-8">
                            <RichTextEditor
                                value={project.description || ''}
                                onChange={(html) => setEditingProject({ ...project as Project, description: html })}
                                label="Short Description (Card View)"
                                minHeight="120px"
                            />

                            <RichTextEditor
                                value={project.long_description || ''}
                                onChange={(html) => setEditingProject({ ...project as Project, long_description: html })}
                                label="Long Description (Modal Details)"
                                minHeight="300px"
                            />
                        </div>

                        {/* Media */}
                        <div className="grid md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                            <ImageUploader
                                currentImage={project.image}
                                onUploadComplete={(url) => setEditingProject({ ...project as Project, image: url })}
                                folder="projects"
                                label="Project Thumbnail"
                            />

                            <VideoUploader
                                currentVideo={project.video}
                                onUploadComplete={(url) => setEditingProject({ ...project as Project, video: url })}
                                folder="projects-videos"
                                label="Project Video (Optional)"
                            />
                        </div>

                        <div className="flex items-center gap-3 border-t border-white/5 pt-8">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={project.featured || false}
                                onChange={(e) => setEditingProject({ ...project as Project, featured: e.target.checked })}
                                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-brand-500 focus:ring-brand-500/50"
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-white select-none cursor-pointer">
                                Mark as Featured Project
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 sticky bottom-8 p-4 glass rounded-2xl border border-white/10 backdrop-blur-xl z-20">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingProject(null);
                                setIsCreating(false);
                            }}
                            className="px-6 py-3 glass rounded-xl hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-gradient-to-r from-brand-600 to-violet-600 rounded-xl font-semibold hover:from-brand-500 hover:to-violet-500 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-500/20"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="p-3 glass rounded-xl hover:bg-white/10 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Projects</h1>
                        <p className="text-zinc-400">Manage your portfolio projects</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingProject(emptyProject as Project);
                        setIsCreating(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-brand-600 to-violet-600 rounded-xl font-semibold hover:from-brand-500 hover:to-violet-500 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-24 glass-card rounded-3xl border border-dashed border-white/10">
                    <FolderKanban className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                    <p className="text-zinc-400 mb-6">Create your first project to get started</p>
                    <button
                        onClick={() => {
                            setEditingProject(emptyProject as Project);
                            setIsCreating(true);
                        }}
                        className="px-6 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-card rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-brand-500/10 transition-all border border-white/5"
                            >
                                <div className="relative h-48 bg-zinc-900 group-hover:scale-105 transition-transform duration-500">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                                            <FolderKanban className="w-12 h-12 text-zinc-700" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />

                                    {project.featured && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-brand-500/90 backdrop-blur-md text-white rounded-lg text-xs font-bold shadow-lg">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 relative">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{project.title}</h3>

                                    <div className="line-clamp-2 text-zinc-400 text-sm mb-4 min-h-[40px]" dangerouslySetInnerHTML={{ __html: project.description }} />

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {(project.technologies || []).slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 bg-white/5 text-zinc-300 rounded-md text-xs border border-white/5"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {(project.technologies || []).length > 3 && (
                                            <span className="px-2 py-1 bg-white/5 text-zinc-500 rounded-md text-xs">
                                                +{project.technologies.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => setEditingProject(project)}
                                            className="flex-1 px-4 py-2 glass rounded-lg hover:bg-brand-500/20 hover:text-brand-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="px-4 py-2 glass rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors text-zinc-400"
                                            title="Delete Project"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
