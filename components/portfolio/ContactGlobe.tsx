'use client';

import { useEffect, useRef } from 'react';

export default function ContactGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let rotation = 0;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        // Configuration
        const config = {
            particleCount: 60,
            radius: 200, // Will be responsive
            color: 'rgb(139, 92, 246)', // Brand violet
            connectionDistance: 70,
            baseSpeed: 0.002
        };

        interface Point3D {
            x: number;
            y: number;
            z: number;
            baseX: number;
            baseY: number;
            baseZ: number;
            lat: number;
            lon: number;
        }

        const points: Point3D[] = [];

        // Initialize points on a sphere (Fibonacci Sphere)
        const initPoints = () => {
            points.length = 0;
            const goldenRatio = (1 + Math.sqrt(5)) / 2;

            for (let i = 0; i < config.particleCount; i++) {
                const theta = 2 * Math.PI * i / goldenRatio;
                const phi = Math.acos(1 - 2 * (i + 0.5) / config.particleCount);

                const x = Math.cos(theta) * Math.sin(phi);
                const y = Math.sin(theta) * Math.sin(phi);
                const z = Math.cos(phi);

                points.push({
                    x: x * config.radius,
                    y: y * config.radius,
                    z: z * config.radius,
                    baseX: x,
                    baseY: y,
                    baseZ: z,
                    lat: theta,
                    lon: phi
                });
            }
        };

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                width = canvas.width = parent.clientWidth;
                height = canvas.height = parent.clientHeight || 400; // Fallback
                config.radius = Math.min(width, height) * 0.35;
                initPoints();
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - width / 2) * 0.0005;
            mouseY = (e.clientY - rect.top - height / 2) * 0.0005;

            targetRotationY = mouseX;
            targetRotationX = -mouseY;
        };

        const rotate = (p: Point3D, rotX: number, rotY: number) => {
            // Rotate around Y
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);

            let x = p.x * cosY - p.z * sinY;
            let z = p.x * sinY + p.z * cosY;
            let y = p.y;

            // Rotate around X
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);

            let yNew = y * cosX - z * sinX;
            let zNew = y * sinX + z * cosX;

            return { x, y: yNew, z: zNew };
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Auto rotation + Mouse influence
            rotation += config.baseSpeed;

            // Render points
            const projectedPoints: { x: number, y: number, z: number, alpha: number }[] = [];

            const centerX = width / 2;
            const centerY = height / 2;

            points.forEach(p => {
                // Apply rotation
                // Base rotation + Interaction
                const rotated = rotate(p, targetRotationX, rotation + targetRotationY * 5);

                // Project 3D to 2D
                // Simple orthogonal for now, or perspective
                const scale = (config.radius * 2) / (config.radius * 2 - rotated.z);
                const x2d = centerX + rotated.x; // Simplified projection
                const y2d = centerY + rotated.y;

                // Opacity based on Z (depth)
                // Front points are opaque, back are transparent
                const alpha = (rotated.z + config.radius) / (config.radius * 2);

                projectedPoints.push({ x: x2d, y: y2d, z: rotated.z, alpha });
            });

            // Draw connections
            ctx.lineWidth = 1;
            for (let i = 0; i < projectedPoints.length; i++) {
                const p1 = projectedPoints[i];
                if (p1.z < -config.radius / 2) continue; // Don't draw connections for far back points

                for (let j = i + 1; j < projectedPoints.length; j++) {
                    const p2 = projectedPoints[j];
                    if (p2.z < -config.radius / 2) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.connectionDistance) {
                        const opacity = (1 - dist / config.connectionDistance) * 0.3 * Math.min(p1.alpha, p2.alpha);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            projectedPoints.forEach(p => {
                const size = 2 * p.alpha;
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();

                // Glow for front nodes
                if (p.z > 0) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = config.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: '400px' }}
        />
    );
}
