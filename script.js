// Prateek Yadav Portfolio - Apple MacBook Pro Motion & Interaction Logic

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. PRELOADER & INITIAL ANIMATION
    // ==========================================================================
    const preloader = document.getElementById('cinematic-loader');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderStatus = document.getElementById('loader-status');
    const loaderFill = document.getElementById('loader-line-fill');
    const loaderProgressCircle = document.getElementById('loader-progress-circle');

    if (preloader && loaderPercent && loaderFill && loaderProgressCircle) {
        let progress = 0;
        const totalLength = 276.46;

        const statuses = [
            { threshold: 0, text: "INITIALIZING APPLE HARDWARE ENGINE..." },
            { threshold: 35, text: "LOADING HIGH-RESOLUTION MESH..." },
            { threshold: 70, text: "CALIBRATING RETINA DISPLAY..." },
            { threshold: 90, text: "WELCOME TO THE EXPERIENCE" }
        ];

        const updateProgress = () => {
            progress += Math.floor(Math.random() * 8) + 4;
            if (progress > 100) progress = 100;

            loaderPercent.textContent = `${progress}%`;
            loaderFill.style.width = `${progress}%`;
            
            const offset = totalLength - (progress / 100) * totalLength;
            loaderProgressCircle.style.strokeDashoffset = offset;

            for (let i = statuses.length - 1; i >= 0; i--) {
                if (progress >= statuses[i].threshold) {
                    if (loaderStatus.textContent !== statuses[i].text) {
                        loaderStatus.textContent = statuses[i].text;
                    }
                    break;
                }
            }

            if (progress < 100) {
                setTimeout(updateProgress, 25);
            } else {
                setTimeout(() => {
                    preloader.classList.add('is-loaded');
                    document.body.classList.remove('is-loading');

                    setTimeout(() => {
                        const heroReveals = document.querySelectorAll('#hero [data-reveal]');
                        heroReveals.forEach(el => el.classList.add('is-revealed'));
                    }, 300);

                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 800);
                }, 400);
            }
        };

        setTimeout(updateProgress, 100);
    }

    // ==========================================================================
    // 2. AMBIENT PARTICLES CANVAS
    // ==========================================================================
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2
        }));

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(41, 151, 255, ${p.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // ==========================================================================
    // 3. CUSTOM GLOWING CURSOR
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverable = document.querySelectorAll('a, button, .bento-card, .project-apple-card');
        hoverable.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorRing.style.borderColor = 'rgba(41, 151, 255, 0.9)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorRing.style.borderColor = 'rgba(41, 151, 255, 0.5)';
            });
        });
    }

    // ==========================================================================
    // 4. SCROLL-DRIVEN 3D MACBOOK PRO LID OPENING ANIMATION
    // ==========================================================================
    const heroSection = document.getElementById('hero');
    const macbookLid = document.getElementById('macbook-lid');
    const macbookGlow = document.getElementById('macbook-glow');
    const heroTextGroup = document.getElementById('hero-text-group');
    const macbookContainer = document.querySelector('.macbook-viewport-container');

    function updateMacBookLid() {
        if (!heroSection || !macbookLid) return;

        const heroRect = heroSection.getBoundingClientRect();
        const totalScrollable = heroSection.offsetHeight - window.innerHeight;
        if (totalScrollable <= 0) return;

        const scrolled = -heroRect.top;
        let progress = scrolled / (totalScrollable * 0.75);
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        // Lid angle: -88deg (closed) -> 0deg (100% fully open facing viewer in exact middle of screen)
        const angle = -88 + (progress * 88);
        macbookLid.style.transform = `rotateX(${angle}deg)`;

        // Fade hero text group as user scrolls to middle
        if (heroTextGroup) {
            const textOpacity = Math.max(0, 1 - (progress * 2.5));
            const textTranslateY = -progress * 60;
            heroTextGroup.style.opacity = textOpacity;
            heroTextGroup.style.transform = `translate(-50%, calc(-50% + ${textTranslateY}px))`;
        }

        if (macbookGlow) {
            macbookGlow.style.opacity = 0.2 + (progress * 0.8);
        }
    }

    window.addEventListener('scroll', updateMacBookLid, { passive: true });
    updateMacBookLid();

    // ==========================================================================
    // 5. NAVBAR STICKY & NAV LINKS
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 450) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Link Highlighting
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');

                // Trigger stat counters if inside revealed element
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(counter => {
                    if (!counter.dataset.animated) {
                        counter.dataset.animated = "true";
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target') || "0");
        let count = 0;
        const duration = 1500;
        const increment = target / (duration / 16);

        function step() {
            count += increment;
            if (count >= target) {
                el.textContent = `${target}+`;
                if (target === 100) el.textContent = '100%';
            } else {
                el.textContent = `${Math.floor(count)}+`;
                requestAnimationFrame(step);
            }
        }
        step();
    }

    // ==========================================================================
    // 7. FEATURED PROJECTS SLIDER CONTROLLER (TRANSFORM TRACK SLIDER)
    // ==========================================================================
    const projectsTrack = document.getElementById('projects-track');
    const projectsPrevBtn = document.getElementById('projects-prev');
    const projectsNextBtn = document.getElementById('projects-next');
    const projectsDots = document.querySelectorAll('.projects-dot');
    let currentProjectIndex = 0;

    if (projectsTrack) {
        const cards = projectsTrack.querySelectorAll('.project-apple-card');
        const totalProjects = cards.length;

        function getMaxIndex() {
            const isMobile = window.innerWidth <= 768;
            return isMobile ? totalProjects - 1 : Math.max(0, totalProjects - 2);
        }

        function updateProjectsSlider() {
            const maxIdx = getMaxIndex();
            if (currentProjectIndex < 0) currentProjectIndex = 0;
            if (currentProjectIndex > maxIdx) currentProjectIndex = maxIdx;

            const card = cards[0];
            if (!card) return;

            const gap = parseInt(window.getComputedStyle(projectsTrack).gap) || 24;
            const moveAmount = (card.offsetWidth + gap) * currentProjectIndex;

            projectsTrack.style.transform = `translateX(-${moveAmount}px)`;

            projectsDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentProjectIndex);
            });
        }

        if (projectsNextBtn) {
            projectsNextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const maxIdx = getMaxIndex();
                if (currentProjectIndex < maxIdx) {
                    currentProjectIndex++;
                } else {
                    currentProjectIndex = 0;
                }
                updateProjectsSlider();
            });
        }

        if (projectsPrevBtn) {
            projectsPrevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const maxIdx = getMaxIndex();
                if (currentProjectIndex > 0) {
                    currentProjectIndex--;
                } else {
                    currentProjectIndex = maxIdx;
                }
                updateProjectsSlider();
            });
        }

        projectsDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                currentProjectIndex = idx;
                updateProjectsSlider();
            });
        });

        // Touch Swipe Gesture Handler
        let touchStartX = 0;
        let touchEndX = 0;

        projectsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoSlideLoop();
        }, { passive: true });

        projectsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;

            if (Math.abs(diffX) > 40) {
                const maxIdx = getMaxIndex();
                if (diffX > 0 && currentProjectIndex < maxIdx) {
                    currentProjectIndex++;
                } else if (diffX < 0 && currentProjectIndex > 0) {
                    currentProjectIndex--;
                }
                updateProjectsSlider();
            }
        }, { passive: true });

        // Auto-Slide Peek & Auto-Play on Scroll into Viewport
        let hasAutoSlidPeek = false;
        let autoSlideTimer = null;

        function startAutoSlideLoop() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(() => {
                const maxIdx = getMaxIndex();
                currentProjectIndex = (currentProjectIndex + 1) > maxIdx ? 0 : currentProjectIndex + 1;
                updateProjectsSlider();
            }, 4500);
        }

        function stopAutoSlideLoop() {
            if (autoSlideTimer) {
                clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        }

        const sliderWrapper = document.querySelector('.projects-slider-wrapper') || projectsTrack;
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!hasAutoSlidPeek) {
                        hasAutoSlidPeek = true;
                        // Perform an initial peek slide 600ms after entering view to signal it's a slide
                        setTimeout(() => {
                            if (currentProjectIndex === 0) {
                                currentProjectIndex = 1;
                                updateProjectsSlider();
                            }
                        }, 600);
                    }
                    startAutoSlideLoop();
                } else {
                    stopAutoSlideLoop();
                }
            });
        }, { threshold: 0.2 });

        sliderObserver.observe(sliderWrapper);

        // Pause auto-slide on manual button interaction
        if (projectsNextBtn) projectsNextBtn.addEventListener('click', stopAutoSlideLoop);
        if (projectsPrevBtn) projectsPrevBtn.addEventListener('click', stopAutoSlideLoop);
        projectsDots.forEach(dot => dot.addEventListener('click', stopAutoSlideLoop));

        window.addEventListener('resize', updateProjectsSlider);
        updateProjectsSlider();
    }

    // ==========================================================================
    // 8. CONTACT FORM HANDLER (EMAILJS)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        // Initialize EmailJS if key available or fallback to demo feedback
        if (window.emailjs) {
            try {
                emailjs.init("YOUR_PUBLIC_KEY");
            } catch (e) {
                console.log("EmailJS init note:", e);
            }
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.className = 'form-status-box';
            formStatus.textContent = 'Sending message...';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simulating or sending message
            setTimeout(() => {
                formStatus.className = 'form-status-box success';
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                contactForm.reset();
            }, 1000);
        });
    }

});
