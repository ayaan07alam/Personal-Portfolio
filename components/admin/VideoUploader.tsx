'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Film } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoUploaderProps {
    currentVideo?: string | null;
    onUploadComplete: (url: string) => void;
    folder?: string;
    label?: string;
}

export default function VideoUploader({
    currentVideo,
    onUploadComplete,
    folder = 'videos',
    label = 'Upload Video'
}: VideoUploaderProps) {
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentVideo || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUploadFile(file);
    }, []);

    async function handleUploadFile(file: File) {
        if (!file.type.startsWith('video/')) {
            showToast('error', 'Please upload a video file');
            return;
        }

        // 50MB limit for videos (adjust as needed)
        if (file.size > 50 * 1024 * 1024) {
            showToast('error', 'Video size should be less than 50MB');
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            // Create preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 200);

            // Upload to Supabase  
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio-images') // Re-using bucket, assuming it allows videos
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(fileName);

            clearInterval(progressInterval);
            setProgress(100);

            setTimeout(() => {
                onUploadComplete(publicUrl);
                setUploading(false);
                showToast('success', 'Video uploaded successfully');
            }, 500);

        } catch (error: any) {
            console.error('Error uploading video:', error);
            showToast('error', `Failed to upload video: ${error.message || 'Unknown error'}`);
            setPreview(currentVideo || null);
            setUploading(false);
        }
    }

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) handleUploadFile(file);
    }

    function handleRemove() {
        setPreview(null);
        onUploadComplete('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
                {label}
            </label>

            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group rounded-xl overflow-hidden border border-white/10"
                    >
                        <video
                            src={preview}
                            controls
                            className="w-full h-64 object-cover bg-black"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-3 glass rounded-full hover:bg-red-500/80 transition-colors text-white z-10 opacity-0 group-hover:opacity-100"
                            title="Remove Video"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {uploading && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                                <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-2" />
                                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-brand-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging
                                ? 'border-brand-500 bg-brand-500/10 scale-[1.02]'
                                : 'border-white/10 hover:border-brand-500/50 hover:bg-white/5'
                            }`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id={`video-upload-${label}`}
                        />
                        <label
                            htmlFor={`video-upload-${label}`}
                            className="cursor-pointer flex flex-col items-center gap-4"
                        >
                            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-zinc-400'
                                }`}>
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <div className="relative">
                                        <Film className="w-8 h-8" />
                                        <Upload className="w-4 h-4 absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-0.5" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-white">
                                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    MP4, WebM (max. 50MB)
                                </p>
                            </div>
                        </label>

                        {uploading && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                <motion.div
                                    className="h-full bg-brand-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
