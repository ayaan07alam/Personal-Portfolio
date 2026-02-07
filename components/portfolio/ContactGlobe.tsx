'use client';

import { useEffect, useRef } from 'react';

export default function ContactGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = 600;
        let height = canvas.height = 600;

        // Configuration
        const GLOBE_RADIUS = 220;
        const DOT_RADIUS = 1.5;
        const DOT_COUNT = 400; // Increase for density
        const CONNECTION_DISTANCE = 45;
        const START_ROTATION_SPEED = 0.002;

        let rotationX = 0;
        let rotationY = 0;
        let rotationXSpeed = START_ROTATION_SPEED;
        let rotationYSpeed = START_ROTATION_SPEED;

        // Fibonacci Sphere Algorithm
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden Angle
        const dots: Point3D[] = [];

        interface Point3D {
            x: number;
            y: number;
            z: number;
            projectedX?: number;
            projectedY?: number;
            scale?: number;
        }

        for (let i = 0; i < DOT_COUNT; i++) {
            const y = 1 - (i / (DOT_COUNT - 1)) * 2; // y goes from 1 to -1
            const radius = Math.sqrt(1 - y * y); // Radius at y
            const theta = phi * i; // Golden angle increment

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

            dots.push({
                x: x * GLOBE_RADIUS,
                y: y * GLOBE_RADIUS,
                z: z * GLOBE_RADIUS
            });
        }

        const project = (x: number, y: number, z: number) => {
            const perspective = 800;
            const scale = perspective / (perspective + z);
            return {
                x: width / 2 + x * scale,
                y: height / 2 + y * scale,
                scale: scale
            };
        };

        let mouseX = 0;
        let mouseY = 0;
        let isHovering = false;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Rotation
            if (isHovering) {
                // Interactive rotation towards mouse
                const targetXSpeed = (mouseY - height / 2) * 0.0001;
                const targetYSpeed = (mouseX - width / 2) * 0.0001;
                rotationXSpeed += (targetXSpeed - rotationXSpeed) * 0.05;
                rotationYSpeed += (targetYSpeed - rotationYSpeed) * 0.05;
            } else {
                // Return to idle rotation
                rotationXSpeed += (START_ROTATION_SPEED - rotationXSpeed) * 0.05;
                rotationYSpeed += (START_ROTATION_SPEED - rotationYSpeed) * 0.05;
            }

            rotationX += rotationXSpeed;
            rotationY += rotationYSpeed;

            // Pre-calculate positions
            dots.forEach(dot => {
                // Rotate Y
                let y = dot.y;
                let z = dot.z * Math.cos(rotationX) - dot.x * Math.sin(rotationX);
                let x = dot.x * Math.cos(rotationX) + dot.z * Math.sin(rotationX);

                // Rotate X
                let tempY = y * Math.cos(rotationY) - z * Math.sin(rotationY);
                z = y * Math.sin(rotationY) + z * Math.cos(rotationY);
                y = tempY;

                const projected = project(x, y, z);
                dot.projectedX = projected.x;
                dot.projectedY = projected.y;
                dot.scale = projected.scale;
            });

            // Draw Connections (Background first)
            ctx.lineWidth = 0.5;
            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                if (!dot.scale || dot.scale < 0.8) continue; // Skip back-facing dots somewhat

                for (let j = i + 1; j < dots.length; j++) {
                    const other = dots[j];
                    if (!other.scale || other.scale < 0.8) continue;

                    const dx = (dot.projectedX || 0) - (other.projectedX || 0);
                    const dy = (dot.projectedY || 0) - (other.projectedY || 0);
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.4 * dot.scale;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`; // Violet connections
                        ctx.beginPath();
                        ctx.moveTo(dot.projectedX || 0, dot.projectedY || 0);
                        ctx.lineTo(other.projectedX || 0, other.projectedY || 0);
                        ctx.stroke();
                    }
                }
            }

            // Draw Dots
            dots.forEach(dot => {
                if (!dot.projectedX || !dot.projectedY || !dot.scale) return;

                // Opacity based on Z-depth (scale)
                const alpha = Math.max(0.1, dot.scale - 0.2);

                ctx.beginPath();
                ctx.arc(dot.projectedX, dot.projectedY, DOT_RADIUS * dot.scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`; // Teal dots
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isHovering = true;
        };

        const handleMouseLeave = () => {
            isHovering = false;
        };

        const canvasEl = canvasRef.current;
        // Fix: Add null check for canvasEl
        if (!canvasEl) return;

        canvasEl.addEventListener('mousemove', handleMouseMove);
        canvasEl.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            canvasEl.removeEventListener('mousemove', handleMouseMove);
            canvasEl.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))' }}
        />
    );
}
