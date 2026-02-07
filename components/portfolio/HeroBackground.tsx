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

        const particles: Particle[] = [];
        const particleCount = 100; // Optimal for smooth lines
        const flowFieldScale = 0.005; // Scale of the noise
        const speed = 2;

        // Configuration
        const config = {
            baseColor: '139, 92, 246', // Violet
            accentColor: '45, 212, 191', // Teal
            trailLength: 0.15, // Trail fade factor (lower = longer trails)
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: { x: number, y: number }[];
            color: string;
            age: number;
            lifeSpan: number;
            speedModifier: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = 0;
                this.vy = 0;
                this.history = [];
                // Randomly choose between base and accent color
                this.color = Math.random() > 0.8
                    ? `rgba(${config.accentColor}, ${Math.random() * 0.5 + 0.2})`
                    : `rgba(${config.baseColor}, ${Math.random() * 0.3 + 0.1})`;
                this.age = 0;
                this.lifeSpan = Math.random() * 200 + 100;
                this.speedModifier = Math.random() * 0.5 + 0.5;
            }

            update() {
                this.age++;

                // Simple pseudo-noise flow field
                const angle = (Math.cos(this.x * flowFieldScale) + Math.sin(this.y * flowFieldScale)) * Math.PI;

                this.vx += Math.cos(angle) * 0.1;
                this.vy += Math.sin(angle) * 0.1;

                // Limit speed
                const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (velocity > speed * this.speedModifier) {
                    this.vx = (this.vx / velocity) * speed * this.speedModifier;
                    this.vy = (this.vy / velocity) * speed * this.speedModifier;
                }

                this.x += this.vx;
                this.y += this.vy;

                // Trail history
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 20) {
                    this.history.shift();
                }

                // Reset if out of bounds or too old
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.age > this.lifeSpan) {
                    this.reset();
                }
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = 0;
                this.vy = 0;
                this.history = [];
                this.age = 0;
                this.color = Math.random() > 0.8
                    ? `rgba(${config.accentColor}, ${Math.random() * 0.5 + 0.2})`
                    : `rgba(${config.baseColor}, ${Math.random() * 0.3 + 0.1})`;
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.history.length < 2) return;

                ctx.beginPath();
                ctx.moveTo(this.history[0].x, this.history[0].y);
                for (let i = 1; i < this.history.length; i++) {
                    ctx.lineTo(this.history[i].x, this.history[i].y);
                }

                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            // Fade out trail
            ctx.fillStyle = `rgba(5, 5, 5, ${config.trailLength})`;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Re-distribute particles? No need, they will reset naturally
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-60"
        />
    );
}
