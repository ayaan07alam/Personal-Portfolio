'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let time = 0;

        // Configuration
        const particles: Point[] = [];
        const rows = 50;
        const cols = 50;
        const spacing = 40; // Space between particles
        const waveHeight = 100;
        const baseColor = { r: 139, g: 92, b: 246 }; // Violet
        const accentColor = { r: 45, g: 212, b: 191 }; // Teal

        interface Point {
            x: number;
            y: number;
            z: number;
            origX: number;
            origZ: number;
        }

        // Initialize grid
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = (j - cols / 2) * spacing;
                const z = (i - rows / 2) * spacing;
                particles.push({ x, y: 0, z, origX: x, origZ: z });
            }
        }

        const project = (p: Point) => {
            const fov = 300;
            const scale = fov / (fov + p.z + 1000); // 1000 is camera distance
            const x2d = p.x * scale + width / 2;
            const y2d = p.y * scale + height / 2 + 50; // +50 to lower the floor slightly
            return { x: x2d, y: y2d, scale };
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(5, 5, 5, 1)'; // Solid dark background to prevent trails (cleaner look)
            ctx.fillRect(0, 0, width, height);

            time += 0.05;

            // Update particle positions (Wave Math)
            particles.forEach(p => {
                // Combine sine waves for organic movement
                const distance = Math.sqrt(p.origX * p.origX + p.origZ * p.origZ);
                const wave1 = Math.sin(distance * 0.02 - time) * waveHeight;
                const wave2 = Math.sin(p.origX * 0.03 + time) * (waveHeight * 0.5);
                p.y = wave1 + wave2 + 100; // +100 to push it down
            });

            // Draw particles and connections
            particles.forEach((p, i) => {
                const projected = project(p);
                const alpha = projected.scale; // Depth fade

                // Draw Point
                ctx.beginPath();
                ctx.arc(projected.x, projected.y, 1.5 * projected.scale, 0, Math.PI * 2);

                // Color gradient based on height
                const colorMix = (p.y + waveHeight) / (waveHeight * 2);
                const r = baseColor.r + (accentColor.r - baseColor.r) * colorMix;
                const g = baseColor.g + (accentColor.g - baseColor.g) * colorMix;
                const b = baseColor.b + (accentColor.b - baseColor.b) * colorMix;

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fill();

                // Connect to right neighbor
                if ((i + 1) % cols !== 0) {
                    const nextP = particles[i + 1];
                    const nextProjected = project(nextP);
                    if (nextProjected.scale > 0) { // Only draw if visible
                        ctx.beginPath();
                        ctx.moveTo(projected.x, projected.y);
                        ctx.lineTo(nextProjected.x, nextProjected.y);
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`; // Fainter lines
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-80"
        />
    );
}
