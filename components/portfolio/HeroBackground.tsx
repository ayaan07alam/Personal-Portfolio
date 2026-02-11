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
        const rows = 25; // Reduced from 50 (Total 625 particles instead of 2500)
        const cols = 25;
        const spacing = 80; // Increased spacing to cover same area
        const waveHeight = 60; // Slightly reduced for subtler effect
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
            const scale = fov / (fov + p.z + 1000);
            const x2d = p.x * scale + width / 2;
            const y2d = p.y * scale + height / 2 + 50;
            return { x: x2d, y: y2d, scale };
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(5, 5, 5, 1)';
            ctx.fillRect(0, 0, width, height);

            time += 0.02; // Slower time for less CPU churn

            // Update particle positions
            // Optimization: Use simple loops and pre-calc constants
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const distance = Math.sqrt(p.origX * p.origX + p.origZ * p.origZ);
                const wave1 = Math.sin(distance * 0.01 - time) * waveHeight;
                const wave2 = Math.sin(p.origX * 0.02 + time) * (waveHeight * 0.5);
                p.y = wave1 + wave2 + 100;
            }

            // Batch Drawing
            // Optimization: Draw all points in one go (or fewer batches) if possible, but they have different alphas.
            // Compromise: Small batching or simplified drawing.

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const projected = project(p);
                // Skip if off-screen or too small
                if (projected.scale <= 0) continue;

                const alpha = projected.scale;

                // Draw Point
                // Only draw points if they are large enough to be seen
                if (projected.scale > 0.1) {
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
                    ctx.rect(projected.x, projected.y, 2 * projected.scale, 2 * projected.scale); // rect is faster than arc
                    ctx.fill();
                }

                // Connect to right neighbor
                if ((i + 1) % cols !== 0) {
                    const nextP = particles[i + 1];
                    const nextProjected = project(nextP);

                    if (nextProjected.scale > 0) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(projected.x, projected.y);
                        ctx.lineTo(nextProjected.x, nextProjected.y);
                        ctx.stroke();
                    }
                }

                // Connect to bottom neighbor (Added for better grid look with fewer points)
                if (i + cols < particles.length) {
                    const bottomP = particles[i + cols];
                    const bottomProjected = project(bottomP);

                    if (bottomProjected.scale > 0) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(projected.x, projected.y);
                        ctx.lineTo(bottomProjected.x, bottomProjected.y);
                        ctx.stroke();
                    }
                }
            }

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
