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
        const DOT_COUNT = 250; // Reduced from 400 for 40% less dots
        const CONNECTION_DISTANCE = 40;
        const START_ROTATION_SPEED = 0.001; // Slower default rotation

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

            // Rotation Logic...
            if (isHovering) {
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

            const cosX = Math.cos(rotationX);
            const sinX = Math.sin(rotationX);
            const cosY = Math.cos(rotationY);
            const sinY = Math.sin(rotationY);

            // Projection Loop
            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                // Rotate Y
                const y = dot.y;
                // Pre-calc rotation reuse
                const z1 = dot.z * cosX - dot.x * sinX;
                const x1 = dot.x * cosX + dot.z * sinX;

                // Rotate X
                const tempY = y * cosY - z1 * sinY;
                const z2 = y * sinY + z1 * cosY;
                const y2 = tempY;

                const perspective = 800;
                const scale = perspective / (perspective + z2);

                dot.projectedX = width / 2 + x1 * scale;
                dot.projectedY = height / 2 + y2 * scale;
                dot.scale = scale;
            }

            // Draw Connections (OPTIMIZED: K-Nearest Neighbor approx)
            // Instead of all-to-all (O(N^2)), we only check a window of neighbors in the array.
            // Since Fibonacci sphere packs points sequentially, neighbors in array are often spatial neighbors.
            ctx.lineWidth = 0.5;
            const neighborCheckCount = 10; // Check only 10 closest array indices

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                if (!dot.scale || dot.scale < 0.6) continue; // Skip back-facing

                // Check forward in list
                for (let j = 1; j <= neighborCheckCount; j++) {
                    const neighborIndex = (i + j) % dots.length;
                    const other = dots[neighborIndex];

                    if (!other.scale || other.scale < 0.6) continue;

                    const dx = (dot.projectedX || 0) - (other.projectedX || 0);
                    const dy = (dot.projectedY || 0) - (other.projectedY || 0);

                    // Fast distance check (squared)
                    const distSq = dx * dx + dy * dy;

                    if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
                        const alpha = (1 - Math.sqrt(distSq) / CONNECTION_DISTANCE) * 0.4 * dot.scale;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(dot.projectedX || 0, dot.projectedY || 0);
                        ctx.lineTo(other.projectedX || 0, other.projectedY || 0);
                        ctx.stroke();
                    }
                }
            }

            // Draw Dots
            ctx.fillStyle = `rgba(45, 212, 191, 0.8)`;
            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                if (!dot.scale || dot.projectedX === undefined || dot.projectedY === undefined) continue;

                // Simpler alpha/size logic
                const size = DOT_RADIUS * dot.scale;
                if (size < 0.5) continue;

                ctx.beginPath();
                ctx.rect(dot.projectedX, dot.projectedY, size, size); // Rect is faster than arc
                ctx.fill();
            }

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
