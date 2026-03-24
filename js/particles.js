/**
 * particles.js — Custom canvas particle / starfield animation
 * No external libraries. Pure vanilla JS + Canvas API.
 */

(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mouse, animId;

    const CONFIG = {
        count: 120,          // number of particles (scaled down on mobile)
        maxSpeed: 0.4,
        minRadius: 1,
        maxRadius: 2.5,
        linkDistance: 150,
        linkOpacity: 0.12,
        mouseRadius: 200,
        colors: ['#A277FF', '#00D9FF', '#c4b5fd', '#67e8f9', '#ffffff'],
    };

    mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticles() {
        const count = window.innerWidth < 768 ? Math.floor(CONFIG.count * 0.5) : CONFIG.count;
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
                vy: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
                r: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
                color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
                alpha: 0.3 + Math.random() * 0.7,
                twinkleSpeed: 0.005 + Math.random() * 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    function draw(time) {
        ctx.clearRect(0, 0, width, height);

        // Draw links
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.linkDistance) {
                    const opacity = CONFIG.linkOpacity * (1 - dist / CONFIG.linkDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(162, 119, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw & update particles
        for (const p of particles) {
            // Twinkle effect
            const twinkle = 0.5 + 0.5 * Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
            const alpha = p.alpha * twinkle;

            // Mouse repulsion
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < CONFIG.mouseRadius && mDist > 0) {
                const force = (1 - mDist / CONFIG.mouseRadius) * 0.02;
                p.vx += (mdx / mDist) * force;
                p.vy += (mdy / mDist) * force;
            }

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Damping
            p.vx *= 0.999;
            p.vy *= 0.999;

            // Speed limit
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > CONFIG.maxSpeed) {
                p.vx = (p.vx / speed) * CONFIG.maxSpeed;
                p.vy = (p.vy / speed) * CONFIG.maxSpeed;
            }

            // Wrap edges
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
        }

        animId = requestAnimationFrame(draw);
    }

    // Events
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Init
    resize();
    createParticles();
    requestAnimationFrame(draw);
})();
