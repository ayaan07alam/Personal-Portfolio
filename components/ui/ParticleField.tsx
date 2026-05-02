'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
}

interface ParticleFieldProps {
    className?: string;
    particleCount?: number;
    color?: string;
    lineColor?: string;
    maxDistance?: number;
    mouseRadius?: number;
    speed?: number;
}

export default function ParticleField({
    className = '',
    particleCount = 60,
    color = '139, 92, 246',
    lineColor = '139, 92, 246',
    maxDistance = 120,
    mouseRadius = 150,
    speed = 0.3,
}: ParticleFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const particlesRef = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);

    const initParticles = useCallback((w: number, h: number) => {
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
        particlesRef.current = particles;
    }, [particleCount, speed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            initParticles(rect.width, rect.height);
        };

        const handleMouse = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const handleLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        resize();
        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', handleMouse);
        canvas.addEventListener('mouseleave', handleLeave);

        const animate = () => {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            ctx.clearRect(0, 0, w, h);

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            // Update & draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius && dist > 0) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    p.vx += (dx / dist) * force * 0.5;
                    p.vy += (dy / dist) * force * 0.5;
                }

                // Damping
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();
            }

            // Draw lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDistance) {
                        const opacity = (1 - dist / maxDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Lines to mouse
            for (const p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius) {
                    const opacity = (1 - dist / mouseRadius) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouse);
            canvas.removeEventListener('mouseleave', handleLeave);
        };
    }, [initParticles, color, lineColor, maxDistance, mouseRadius]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full ${className}`}
            style={{ pointerEvents: 'auto' }}
        />
    );
}
