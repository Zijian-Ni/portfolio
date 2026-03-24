/**
 * animations.js — Scroll-triggered animations using Intersection Observer
 * Handles: fade-in elements, skill bars, growth bars, aurora constellation canvas
 */

(function () {
    'use strict';

    // ============================
    // Scroll Fade-in Animations
    // ============================
    function initScrollAnimations() {
        // Tag all animatable elements
        const selectors = [
            '.about-grid', '.about-left', '.about-right', '.about-quote',
            '.tech-card', '.project-card', '.timeline-item',
            '.edu-card', '.growth-chart', '.interest-card',
            '.github-card', '.contact-form', '.contact-links',
            '.aurora-intro', '.contact-intro',
        ];

        selectors.forEach((sel) => {
            document.querySelectorAll(sel).forEach((el, i) => {
                el.classList.add('anim-fade');
                el.style.transitionDelay = `${Math.min(i * 0.08, 0.5)}s`;
            });
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.anim-fade').forEach((el) => observer.observe(el));
    }

    // ============================
    // Skill Bar Animations
    // ============================
    function initSkillBars() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bars = entry.target.querySelectorAll('.tech-bar-fill');
                        bars.forEach((bar) => {
                            const level = bar.getAttribute('data-level');
                            bar.style.setProperty('--level', level + '%');
                            bar.classList.add('animated');
                        });
                    }
                });
            },
            { threshold: 0.2 }
        );

        const techSection = document.getElementById('techstack');
        if (techSection) observer.observe(techSection);
    }

    // ============================
    // Growth Bar Animations
    // ============================
    function initGrowthBars() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bars = entry.target.querySelectorAll('.growth-fill');
                        bars.forEach((bar) => {
                            const level = bar.getAttribute('data-level');
                            bar.style.setProperty('--level', level + '%');
                            bar.classList.add('animated');
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );

        document.querySelectorAll('.growth-chart').forEach((el) => observer.observe(el));
    }

    // ============================
    // Aurora Constellation Canvas
    // ============================
    function initAuroraConstellation() {
        const canvas = document.getElementById('aurora-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        resize();
        window.addEventListener('resize', resize);

        // Define constellation nodes (Aurora projects)
        const nodes = [
            { label: '落雨阁', x: 0.1, y: 0.5 },
            { label: '小落', x: 0.35, y: 0.3 },
            { label: '小雨', x: 0.35, y: 0.7 },
            { label: 'MCP', x: 0.55, y: 0.2 },
            { label: 'Memory', x: 0.55, y: 0.5 },
            { label: 'Firewall', x: 0.55, y: 0.8 },
            { label: 'Ecosystem', x: 0.85, y: 0.5 },
        ];

        const links = [
            [0, 1], [0, 2], [1, 3], [1, 4], [1, 6],
            [2, 5], [2, 6], [3, 6], [4, 6], [5, 6],
        ];

        function draw(time) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width;
            const h = canvas.height;

            // Draw links
            links.forEach(([a, b]) => {
                const na = nodes[a], nb = nodes[b];
                ctx.beginPath();
                ctx.moveTo(na.x * w, na.y * h);
                ctx.lineTo(nb.x * w, nb.y * h);
                ctx.strokeStyle = 'rgba(162, 119, 255, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Draw nodes
            nodes.forEach((n, i) => {
                const px = n.x * w;
                const py = n.y * h;
                const pulse = 4 + Math.sin(time * 0.002 + i) * 2;

                // Glow
                ctx.beginPath();
                ctx.arc(px, py, pulse + 6, 0, Math.PI * 2);
                ctx.fillStyle = i === 6 ? 'rgba(0, 217, 255, 0.15)' : 'rgba(162, 119, 255, 0.15)';
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(px, py, pulse, 0, Math.PI * 2);
                ctx.fillStyle = i === 6 ? '#00D9FF' : '#A277FF';
                ctx.fill();

                // Label
                ctx.font = '12px Inter, sans-serif';
                ctx.fillStyle = '#9ca3af';
                ctx.textAlign = 'center';
                ctx.fillText(n.label, px, py + pulse + 18);
            });

            requestAnimationFrame(draw);
        }

        // Start animation when section is visible
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    requestAnimationFrame(draw);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(canvas.parentElement);
    }

    // ============================
    // Init All
    // ============================
    document.addEventListener('DOMContentLoaded', () => {
        initScrollAnimations();
        initSkillBars();
        initGrowthBars();
        initAuroraConstellation();
    });
})();
