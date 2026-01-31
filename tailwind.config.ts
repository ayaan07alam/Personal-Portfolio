import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Editorial Palette
                background: '#0a0a0a',
                surface: '#121212',
                surfaceHighlight: '#1e1e1e',

                // Accents - Replaced Lime with Lavender/Violet
                lavender: {
                    300: '#d8b4fe', // Light Lavender
                    400: '#c084fc', // Primary Lavender
                    500: '#a855f7', // Stronger Lavender
                },
                zinc: {
                    850: '#1f1f22', // Custom dark gray
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'subtle-glow': 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15), transparent 60%)', // Violet glow
            },
        },
    },
    plugins: [],
} satisfies Config;
