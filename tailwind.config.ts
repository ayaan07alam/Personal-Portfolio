import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-outfit)', 'sans-serif'],
                mono: ['var(--font-space)', 'monospace'], // Using Space Grotesk for mono-like feel or actual mono
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'subtle-glow': 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15), transparent 60%)',
            },
            colors: {
                background: '#050505', // Unified dark background
                surface: '#0A0A0A',
                surfaceHighlight: '#151515',

                // Primary Brand (Violet/Indigo)
                brand: {
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#8b5cf6', // Violet
                    600: '#7c3aed',
                },
                // Tech/Status (Emerald)
                tech: {
                    400: '#34d399',
                    500: '#10b981',
                },
                zinc: {
                    850: '#1f1f22',
                }
            }
        },
    },
    plugins: [],
} satisfies Config;
