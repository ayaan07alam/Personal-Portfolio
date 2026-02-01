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
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string | null>(currentVideo || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setUploading(true);
            setProgress(0);

            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Get Auth Session for various RLS policies
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;

            if (!accessToken) throw new Error("No active session");

            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;

            // Upload using XHR for progress tracking
            const xhr = new XMLHttpRequest();
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/portfolio-images/${fileName}`;

            xhr.open('POST', url);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            // Supabase storage needs these
            xhr.setRequestHeader('x-client-info', 'supabase-js-web/2.x');

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setProgress(percentComplete);
                }
            };

            xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Success
                    const { data: { publicUrl } } = supabase.storage
                        .from('portfolio-images')
                        .getPublicUrl(fileName);

                    onUploadComplete(publicUrl);
                    setUploading(false);
                } else {
                    // Failure
                    console.error('Upload failed:', xhr.responseText);
                    alert(`Error uploading video: ${xhr.status} ${xhr.statusText} - ${xhr.responseText}`);
                    setUploading(false);
                }
            };

            xhr.onerror = () => {
                console.error('XHR Error');
                alert('Network error occurred during upload.');
                setUploading(false);
            };

            const formData = new FormData();
            formData.append('', file);
            // NOTE: Supabase storage raw upload expects the body to be the file, 
            // BUT standard POST to /object/ requires FormData OR Verify headers using Supabase API docs.
            // Actually, Supabase Storage API allows raw body if 'Content-Type' is set?
            // The safest is using the Supabase client logic but reproduced.
            // Documentation says: POST /object/:bucket/:wildcard -> Body is the file content.
            // We should Set Content-Type to file type.

            // Re-opening XHR to be safe with Binary
            // Let's retry strictly as binary body without FormData if that's what endpoint expects.
            // Re-implementing correctly below:

        } catch (error: any) {
            console.error('Error setup:', error);
            alert(`Error: ${error.message}`);
            setUploading(false);
        }
    }

    // Correct XHR Implementation wrapper
    const xhrUpload = async (file: File, fileName: string, accessToken: string) => {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/portfolio-images/${fileName}`;

            xhr.open('POST', url);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
            xhr.setRequestHeader('x-upsert', 'false');

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Server returned ${xhr.status}: ${xhr.responseText}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error'));

            xhr.send(file);
        });
    };

    // Re-binded handler
    async function handleUploadCorrect(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setProgress(0);

            // Preview
            setPreview(URL.createObjectURL(file));

            // Auth
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error("Please log in again.");

            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;

            await xhrUpload(file, fileName, session.access_token);

            // Get URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(fileName);

            onUploadComplete(publicUrl);

        } catch (error: any) {
            console.error(error);
            alert(`Upload Failed: ${error.message}`);
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
                    {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg z-20">
                            <div className="w-3/4 bg-gray-700 rounded-full h-2.5 mb-2">
                                <div className="bg-brand-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-white text-sm font-medium">{progress}% Uploading...</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary-500/50 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleUploadCorrect}
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
                            {uploading ? `Uploading ${progress}%` : 'Click to upload video'}
                        </span>
                        {uploading && (
                            <div className="w-full max-w-[200px] mt-2 bg-gray-700 rounded-full h-1.5">
                                <div className="bg-brand-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </label>
                </div>
            )}
        </div>
    );
}
