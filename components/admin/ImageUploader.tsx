'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploaderProps {
    currentImage?: string | null;
    onUploadComplete: (url: string) => void;
    folder?: string;
    label?: string;
}

export default function ImageUploader({
    currentImage,
    onUploadComplete,
    folder = 'images',
    label = 'Upload Image'
}: ImageUploaderProps) {
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
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
        if (!file.type.startsWith('image/')) {
            showToast('error', 'Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showToast('error', 'Image size should be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Simulate progress since Supabase client doesn't support it natively yet
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 100);

            // Upload to Supabase  
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio-images')
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
                showToast('success', 'Image uploaded successfully');
            }, 500);

        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('error', 'Failed to upload image');
            setPreview(currentImage || null);
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
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 glass rounded-full hover:bg-white/20 transition-colors text-white"
                                title="Change Image"
                            >
                                <Upload className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-3 glass rounded-full hover:bg-red-500/80 transition-colors text-white"
                                title="Remove Image"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
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
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id={`image-upload-${label}`}
                        />
                        <label
                            htmlFor={`image-upload-${label}`}
                            className="cursor-pointer flex flex-col items-center gap-4"
                        >
                            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-zinc-400'
                                }`}>
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <div className="relative">
                                        <ImageIcon className="w-8 h-8" />
                                        <Upload className="w-4 h-4 absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-0.5" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-white">
                                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    SVG, PNG, JPG or GIF (max. 5MB)
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
