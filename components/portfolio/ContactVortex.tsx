'use client';

import { useEffect, useRef } from 'react';

export default function ContactVortex() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = 600;
        let height = canvas.height = 600;

        // Configuration
        const particleCount = 400;
        const baseSpeed = 0.02;
        const colorBase = '139, 92, 246'; // Violet
        const colorAccent = '45, 212, 191'; // Teal
        const mouseInfluenceRadius = 200;

        let mouseX = width / 2;
        let mouseY = height / 2;

        interface Particle {
            x: number;
            y: number;
            bgAngle: number; // Angle from center
            orbitRadius: number;
            speed: number;
            size: number;
            color: string;
            wobble: number;
        }

        const particles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: 0,
                y: 0,
                bgAngle: Math.random() * Math.PI * 2,
                orbitRadius: Math.random() * (width / 2) + 20, // Avoid dead center
                speed: (Math.random() * 0.5 + 0.2) * baseSpeed,
                size: Math.random() * 2 + 0.5,
                color: Math.random() > 0.7
                    ? `rgba(${colorAccent}, ${Math.random() * 0.6 + 0.4})`
                    : `rgba(${colorBase}, ${Math.random() * 0.5 + 0.3})`,
                wobble: Math.random() * 10
            });
        }

        const draw = () => {
            // Trail effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Clear with slight opacity for trails
            ctx.fillRect(0, 0, width, height);

            particles.forEach((p, i) => {
                // Update Angle (Spiral movement)
                p.bgAngle += p.speed;

                // Add some wobble to radius
                const currentRadius = p.orbitRadius + Math.sin(Date.now() * 0.001 + p.wobble) * 10;

                // Calculate intended position
                const centerX = width / 2;
                const centerY = height / 2;

                // Spiral formula
                let targetX = centerX + Math.cos(p.bgAngle) * currentRadius;
                let targetY = centerY + Math.sin(p.bgAngle) * currentRadius * 0.6; // Flattened for perspective

                // Mouse Interaction (Gravity Well)
                const dx = mouseX - targetX;
                const dy = mouseY - targetY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseInfluenceRadius) {
                    const force = (mouseInfluenceRadius - dist) / mouseInfluenceRadius;
                    targetX += dx * force * 0.2;
                    targetY += dy * force * 0.2;
                }

                // Draw
                ctx.beginPath();
                ctx.arc(targetX, targetY, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;

                // Add glow to some particles
                if (i % 10 === 0) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = p.color;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            });

            requestAnimationFrame(draw);
        };

        draw();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        // Resize handler (keep canvas fixed size but scale via CSS if needed, 
        // but here we are in a container so fixed render size is fine for performance)

        canvas.addEventListener('mousemove', handleMouseMove);
        return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Decorative Center Glow */}
            <div className="absolute inset-0 bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />

            <canvas
                ref={canvasRef}
                className="w-full h-full relative z-10"
                style={{ filter: 'contrast(1.2)' }}
            />

            {/* Overlay Overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-mono text-zinc-400 tracking-widest">QUANTUM LINK</span>
            </div>
        </div>
    );
}
