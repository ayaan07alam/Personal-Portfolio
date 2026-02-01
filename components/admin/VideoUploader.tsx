'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader, Film } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

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
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentVideo || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            const file = event.target.files?.[0];
            if (!file) return;

            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Upload to Supabase  
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError, data } = await supabase.storage
                .from('portfolio-images') // Re-using the same bucket if it allows videos, otherwise might fail if strict
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(fileName);

            onUploadComplete(publicUrl);
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Error uploading video');
        } finally {
            setUploading(false);
        }
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>

            {preview ? (
                <div className="relative">
                    <video
                        src={preview}
                        controls
                        className="w-full h-48 object-cover rounded-lg bg-black"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary-500/50 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleUpload}
                        className="hidden"
                        id="video-upload"
                    />
                    <label
                        htmlFor="video-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        {uploading ? (
                            <Loader className="w-12 h-12 text-primary-400 animate-spin" />
                        ) : (
                            <Film className="w-12 h-12 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-400">
                            {uploading ? 'Uploading...' : 'Click to upload video'}
                        </span>
                    </label>
                </div>
            )}
        </div>
    );
}
