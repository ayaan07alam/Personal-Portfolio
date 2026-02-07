'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration
        const config = {
            gridSize: 40, // Size of grid squares
            speed: 0.5, // Speed of movement
            perspective: 300, // Perspective depth
            horizonY: 0.4, // Horizon position (0 to 1)
            lineColor: 'rgba(139, 92, 246, 0.15)', // Brand violet
            beamColor: '#2dd4bf', // Tech teal
            glowColor: 'rgba(139, 92, 246, 0.1)',
            beamChance: 0.005, // Chance of a new beam appearing per frame
        };

        let width = 0;
        let height = 0;
        let offset = 0;

        // Energy beams state
        interface Beam {
            x: number; // Grid column index
            y: number; // Grid row position (progress)
            speed: number;
            length: number;
            type: 'vertical' | 'horizontal'; // Only vertical for this perspective effect looks best
        }

        let beams: Beam[] = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const createBeam = () => {
            // Random column index
            // We need to calculate how many columns fit
            // This is a rough approximation for the perspective grid
            const cols = Math.floor(width / config.gridSize) * 4;
            const x = Math.floor(Math.random() * cols) - cols / 2;

            beams.push({
                x,
                y: 0, // Start at horizon (far away)
                speed: Math.random() * 0.02 + 0.015,
                length: Math.random() * 0.5 + 0.2,
                type: 'vertical'
            });
        };

        const drawGrid = () => {
            // Horizon line position
            const horizon = height * config.horizonY;

            // Clear canvas
            ctx.fillStyle = '#050505'; // Match background
            ctx.fillRect(0, 0, width, height);

            // Add horizon glow
            const gradient = ctx.createLinearGradient(0, horizon - 100, 0, height);
            gradient.addColorStop(0, config.glowColor);
            gradient.addColorStop(0.5, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, horizon, width, height - horizon);

            // Draw Vertical Lines (Perspective)
            // They originate from a vanishing point at center horizon
            const centerX = width / 2;
            const vanishingY = horizon;

            ctx.strokeStyle = config.lineColor;
            ctx.lineWidth = 1;

            // We draw lines spreading out from center
            // FOV determines density
            const fov = config.perspective;

            // Vertical lines
            for (let i = -100; i <= 100; i += 1) {
                // Calculate x position at bottom of screen
                // Simple perspective projection logic is complex to implement raw 2d.
                // Let's use a simpler "radiating lines" approach which looks like a 3D floor.

                const spacing = config.gridSize * 2;
                const xOffset = i * spacing;

                ctx.beginPath();
                ctx.moveTo(centerX, vanishingY);
                // The point at the bottom is determined by projecting the line through the camera
                // Simple version: line goes from vanishing point to (centerX + offset) at bottom
                // But we want parallel lines in 3D, which meet at vanishing point.

                // Angle based logic might be better or just lots of lines.
                // Let's stick to the "meet at vanishing point"

                // Determine 'x' at the bottom of the screen
                // We space them out linearly at some depth? No, they should be linear in 3D space.
                // If we assume a flat plane, lines parallel to view direction meet at vanishing point.
                // Lines perpendicular (horizontal) get closer together as they go up.

                // Let's draw the radiating lines
                // Limit the slope to avoid drawing millions of lines
                // We only need lines that pass through the viewport bottom or sides

                // Bottom x = centerX + (i * spacing) * scale
                // Let's just draw enough of them

                const bottomX = centerX + (i * spacing * 4);

                ctx.moveTo(centerX, vanishingY);
                ctx.lineTo(bottomX, height);
                ctx.stroke();
            }

            // Draw Horizontal Lines (Moving forward)
            // These are horizontal lines that move 'down' the screen
            // The distance between them should increase exponentially as they get closer (y increases)

            // Current offset affects the 'phase' of the movement
            // We map a 0-1 progress to Y screen coordinates using perspective formula:
            // y = vanishingY + (height - vanishingY) / z
            // where z goes from far (large) to near (1)

            const maxDepth = 10;
            const numHorizontals = 20;

            // Moving offset
            offset = (offset + config.speed * 0.01) % 1;

            for (let i = 0; i < maxDepth; i++) {
                // z represents depth. 
                // We want varying z. 
                // Let's model z as 1/y basically.

                // let's linearly iterate 'space' units and project them
                // z = i - offset (moving towards viewer)
                let z = i - offset;
                if (z <= 0) z += 10; // Wrap around

                // Project z to Y screen coordinate
                // classic 3D projection: y = y_vanishing + (h / z)
                // We need to map z range properly.

                // Let's say z=1 is bottom of screen, z=infinity is horizon.
                // y = horizon + (height-horizon)/z

                // Actually z should be > 1 to be in front of camera? 
                // Let's invert: focus on t (0 to 1) from horizon to bottom.
                // t = 1 / z

                // Let's try uniform stepping in 1/z space which gives geometric spacing in y

                const t = 1 / z; // 0 to 1 roughly
                if (t > 1) continue; // Behind camera

                const y = vanishingY + (height - vanishingY) * t;

                // Fate lines near horizon
                const alpha = t; // Fade out near horizon

                ctx.strokeStyle = `rgba(139, 92, 246, ${Math.max(0, 0.4 * alpha)})`; // Fade out
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw Beams
            // Beams travel along the vertical lines
            beams.forEach((beam, index) => {
                // Update beam position (z-coordinate space)
                beam.y += beam.speed;

                // Remove if passed camera
                if (beam.y > 10) { // arbitrary z-limit, same as grid loop logic
                    beams.splice(index, 1);
                    return;
                }

                // Calculate screen coordinates
                // We reuse the projection logic of vertical lines and grid depth

                // 1. Determine which vertical line (angle)
                // The vertical lines were indexed by 'i' in the loop: centerX + (i * spacing * 4)
                const spacing = config.gridSize * 2 * 4;
                const bottomX = centerX + (beam.x * spacing);

                // Interpolate X based on depth t
                // At horizon (t=0), x = centerX
                // At bottom (t=1), x = bottomX
                // Beam depth Z -> t = 1/z (roughly, reusing logic above)
                // z starts large (horizon) and goes to 1 (near)

                // Let's define beam.y as 't' (0 to 1) directly for simplicity
                // t=0 is horizon, t=1 is bottom
                const t = beam.y;
                const prevT = Math.max(0, t - beam.length * t); // Trail scales with perspective!

                const y = vanishingY + (height - vanishingY) * t;
                const prevY = vanishingY + (height - vanishingY) * prevT;

                const x = centerX + (bottomX - centerX) * t;
                const prevX = centerX + (bottomX - centerX) * prevT;

                // Draw beam
                const gradient = ctx.createLinearGradient(x, y, prevX, prevY);
                gradient.addColorStop(0, config.beamColor);
                gradient.addColorStop(1, 'transparent');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2 + (t * 2); // Thicker near camera
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Glow at head
                ctx.shadowBlur = 10;
                ctx.shadowColor = config.beamColor;
                ctx.fillStyle = config.beamColor;
                ctx.beginPath();
                ctx.arc(x, y, 1 + t * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        };

        const animate = () => {
            drawGrid();

            // Randomly spawn beams
            if (Math.random() < config.beamChance) {
                createBeam();
            }

            requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.8 }}
        />
    );
}
