/* ============================================
   ANIMATIONS.JS — Scroll Reveal, Header Shrink,
   Hamburger Menu, Smooth Scroll
   ============================================ */

(function () {
    'use strict';

    // --- Scroll Reveal (IntersectionObserver) ---
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach((el) => observer.observe(el));
    }

    // --- Header Shrink on Scroll ---
    function initHeaderShrink() {
        const header = document.querySelector('.header');
        if (!header) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 60) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- Hamburger Menu ---
    function initHamburger() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.header nav');
        const overlay = document.querySelector('.nav-overlay');
        if (!hamburger || !nav) return;

        function closeMenu() {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function openMenu() {
            hamburger.classList.add('active');
            nav.classList.add('open');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        hamburger.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Close on nav link click
        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // --- Page Load Animation ---
    function initPageLoad() {
        document.body.classList.add('page-loaded');
    }

    // --- Init All ---
    function init() {
        initPageLoad();
        initHeaderShrink();
        initHamburger();
        initSmoothScroll();

        // Delay scroll reveal slightly for page load sequence
        setTimeout(initScrollReveal, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
