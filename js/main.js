/**
 * main.js — Core interactivity
 * Typewriter, navigation, language toggle, filters, cursor glow
 */

(function () {
    'use strict';

    // ============================
    // Cursor Glow
    // ============================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
        let glowX = 0, glowY = 0, currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            glowX = e.clientX;
            glowY = e.clientY;
        });

        function updateGlow() {
            currentX += (glowX - currentX) * 0.1;
            currentY += (glowY - currentY) * 0.1;
            cursorGlow.style.left = currentX + 'px';
            cursorGlow.style.top = currentY + 'px';
            requestAnimationFrame(updateGlow);
        }
        requestAnimationFrame(updateGlow);
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // ============================
    // Typewriter Effect
    // ============================
    const typewriterEl = document.getElementById('typewriter-text');

    const phrasesEN = [
        'intelligent AI agents 🤖',
        'the Aurora Universe ✨',
        'memory systems for AI 🧠',
        'LLM security firewalls 🛡️',
        'Chinese metaphysics algorithms ☯️',
        'full-stack web platforms 🌐',
        'Minecraft AI companions ⛏️',
        'search engines from scratch 🔍',
        'game AI with 87.5% win rate 🎮',
    ];

    const phrasesZH = [
        '智能AI Agent 🤖',
        '极光宇宙 ✨',
        'AI记忆系统 🧠',
        'LLM安全防火墙 🛡️',
        '玄学算法库 ☯️',
        '全栈Web平台 🌐',
        'Minecraft AI伙伴 ⛏️',
        '从零搜索引擎 🔍',
        '87.5%胜率的游戏AI 🎮',
    ];

    let currentLang = 'en';
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimer;

    function getPhrases() {
        return currentLang === 'zh' ? phrasesZH : phrasesEN;
    }

    function typewrite() {
        const phrases = getPhrases();
        const phrase = phrases[phraseIndex % phrases.length];

        if (!isDeleting) {
            typewriterEl.textContent = phrase.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex >= phrase.length) {
                isDeleting = true;
                typeTimer = setTimeout(typewrite, 2000);
                return;
            }
            typeTimer = setTimeout(typewrite, 60 + Math.random() * 40);
        } else {
            typewriterEl.textContent = phrase.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex <= 0) {
                isDeleting = false;
                phraseIndex++;
                typeTimer = setTimeout(typewrite, 500);
                return;
            }
            typeTimer = setTimeout(typewrite, 30);
        }
    }

    // ============================
    // Navigation
    // ============================
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.getElementById('menu-toggle');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        const sections = document.querySelectorAll('.section');
        let current = '';
        sections.forEach((s) => {
            if (scrollY >= s.offsetTop - 200) {
                current = s.id;
            }
        });
        navLinks.querySelectorAll('a').forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });

        lastScroll = scrollY;
    });

    // Mobile menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

    // ============================
    // Language Toggle
    // ============================
    const langToggle = document.getElementById('lang-toggle');
    const langLabel = document.getElementById('lang-label');

    function switchLanguage(lang) {
        currentLang = lang;
        document.documentElement.setAttribute('data-lang', lang);

        // Update all [data-en] / [data-zh] elements
        document.querySelectorAll('[data-en]').forEach((el) => {
            const text = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // skip — placeholders
                } else if (el.children.length === 0 || el.classList.contains('about-text')) {
                    el.innerHTML = text;
                } else {
                    // Elements with child nodes: update text content carefully
                    el.innerHTML = text;
                }
            }
        });

        langLabel.textContent = lang === 'zh' ? 'EN' : '中';

        // Reset typewriter
        clearTimeout(typeTimer);
        charIndex = 0;
        isDeleting = false;
        typewriterEl.textContent = '';
        setTimeout(typewrite, 300);
    }

    langToggle.addEventListener('click', () => {
        switchLanguage(currentLang === 'en' ? 'zh' : 'en');
    });

    // ============================
    // Tech Stack Filters
    // ============================
    const techFilters = document.querySelectorAll('.tech-filter');
    const techCards = document.querySelectorAll('.tech-card');

    techFilters.forEach((btn) => {
        btn.addEventListener('click', () => {
            techFilters.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            techCards.forEach((card) => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============================
    // Project Filters
    // ============================
    const projectFilters = document.querySelectorAll('.project-filter');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilters.forEach((btn) => {
        btn.addEventListener('click', () => {
            projectFilters.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectCards.forEach((card) => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============================
    // Back to Top
    // ============================
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================
    // Smooth Anchor Scroll
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================
    // Init
    // ============================
    document.addEventListener('DOMContentLoaded', () => {
        typewrite();
    });

    // Start typewriter immediately if DOM is already loaded
    if (document.readyState !== 'loading') {
        typewrite();
    }
})();
