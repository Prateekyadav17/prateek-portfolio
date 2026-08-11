// Narendra Portfolio JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 0. CINEMATIC PRELOADER & HERO REVEAL CONTROLLER
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
            { threshold: 0, text: "INITIALIZING CORE SYSTEM..." },
            { threshold: 30, text: "LOADING HIGH-TECH ASSETS..." },
            { threshold: 65, text: "BUILDING DIGITAL EMOTION..." },
            { threshold: 90, text: "WELCOME TO THE EXPERIENCE" }
        ];

        const updateProgress = () => {
            progress += Math.floor(Math.random() * 6) + 3;
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
                    }, 450);

                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 1100);
                }, 400);
            }
        };

        setTimeout(updateProgress, 100);
    }

    // Elements
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const backToTopBtn = document.getElementById('back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Sticky Navbar & Back-to-Top visibility on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Section Link Highlight
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Scroll to Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Project Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: "43TsqjoiCvqkTClw8" });
    }

    // Contact Form Submission (EmailJS Integration)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('.submit-btn');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all fields before submitting.';
                return;
            }

            if (!emailRegex.test(email)) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please enter a valid email address.';
                return;
            }

            const originalBtnText = submitBtn.innerHTML;

            // Loading state animation
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const templateParams = {
                to_email: 'prateek82250@gmail.com',
                from_name: name,
                from_email: email,
                reply_to: email,
                subject: subject,
                message: message
            };

            // Send message directly to prateek82250@gmail.com via FormSubmit AJAX API
            fetch('https://formsubmit.co/ajax/prateek82250@gmail.com', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    _replyto: email,
                    _subject: `Portfolio Inquiry: ${subject}`,
                    message: message
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('FormSubmit endpoint error');
                return response.json();
            })
            .then(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully! Prateek will get back to you soon.';
                contactForm.reset();
            })
            .catch(() => {
                // If FormSubmit fetch fails, fallback to EmailJS
                if (typeof emailjs !== 'undefined') {
                    return emailjs.send('service_hrw5veq', 'template_935e2od', templateParams)
                        .then(() => {
                            formStatus.className = 'form-status success';
                            formStatus.textContent = 'Message sent successfully! Prateek will get back to you soon.';
                            contactForm.reset();
                        });
                } else {
                    throw new Error('Email service unavailable');
                }
            })
            .catch((error) => {
                console.error('Email Error:', error);
                // Final fallback: open user's mail client
                window.location.href = `mailto:prateek82250@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Opening mail client to send your message directly to Prateek...';
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 6000);
            });
        });
    }

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        if (animated) return;
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                let count = 0;
                const speed = target / 30;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        stat.textContent = Math.ceil(count) + suffix;
                        setTimeout(updateCount, 30);
                    } else {
                        stat.textContent = target + suffix;
                    }
                };
                updateCount();
            });
            animated = true;
        }
    };

    window.addEventListener('scroll', animateStats);
    animateStats(); // Initial check

    // Page Visibility API - Pause video marquee when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const marqueeTrack = document.querySelector('.video-marquee-track');
        if (!marqueeTrack) return;
        if (document.hidden) {
            marqueeTrack.classList.add('is-paused');
        } else {
            marqueeTrack.classList.remove('is-paused');
        }
    });

    // Reviews Carousel Arrow Navigation Controls
    const reviewsTrack = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (reviewsTrack && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = reviewsTrack.querySelector('.review-card')?.offsetWidth || 340;
            reviewsTrack.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = reviewsTrack.querySelector('.review-card')?.offsetWidth || 340;
            reviewsTrack.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        });
    }

    // Skill Bar Animation on Scroll
    const skillBars = document.querySelectorAll('.skills__bar');
    if (skillBars.length > 0) {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const skillsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        skillBars.forEach(bar => {
                            const targetWidth = bar.style.getPropertyValue('--width');
                            if (targetWidth) {
                                bar.style.width = targetWidth;
                            }
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            skillsObserver.observe(skillsSection);
        }
    }

    // Showcase Project Slideshow Logic
    const slideshowContainer = document.getElementById('showcase-slideshow');
    if (slideshowContainer) {
        const slides = slideshowContainer.querySelectorAll('.slide');
        const dots = slideshowContainer.querySelectorAll('.slideshow-dots .dot');
        const prevBtn = document.getElementById('slideshow-prev');
        const nextBtn = document.getElementById('slideshow-next');

        let currentSlide = 0;
        let slideInterval = null;

        const showSlide = (index) => {
            if (slides.length === 0) return;

            // Normalize index wrapping around
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;

            // Update active slide class
            slides.forEach((slide, i) => {
                if (i === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update active dot indicator class
            dots.forEach((dot, i) => {
                if (i === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };

        const startAutoplay = () => {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, 4000);
        };

        const stopAutoplay = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        };

        // Event listeners for Navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoplay();
            });
        }

        // Event listeners for Pagination dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startAutoplay();
            });
        });

        // Pause on mouse hover & resume on mouse leave
        slideshowContainer.addEventListener('mouseenter', stopAutoplay);
        slideshowContainer.addEventListener('mouseleave', startAutoplay);

        // Touch Swipe Navigation for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;

        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
                startAutoplay();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
                startAutoplay();
            }
        };

        // Start autoplay on load
        startAutoplay();
    }

    // Featured Projects Mobile Slider Observer & Dots
    const featuredGrid = document.querySelector('.long-videos-grid');
    const featuredDots = document.querySelectorAll('#featured-projects-dots .featured-dot');

    if (featuredGrid && featuredDots.length > 0) {
        const updateActiveDot = () => {
            const card = featuredGrid.querySelector('.long-video-card');
            if (!card) return;
            const cardWidth = card.offsetWidth;
            const scrollPosition = featuredGrid.scrollLeft;
            const activeIndex = Math.round(scrollPosition / (cardWidth + 16));
            
            featuredDots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        featuredGrid.addEventListener('scroll', updateActiveDot, { passive: true });

        featuredDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const card = featuredGrid.querySelector('.long-video-card');
                if (!card) return;
                const cardWidth = card.offsetWidth;
                featuredGrid.scrollTo({
                    left: index * (cardWidth + 16),
                    behavior: 'smooth'
                });
            });
        });
    }

    // ==========================================================================
    // 1. INTERACTIVE AMBIENT PARTICLE CONSTELLATION ENGINE
    // ==========================================================================
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        let mouseX = width / 2;
        let mouseY = height / 2;
        let mouseActive = false;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            mouseActive = true;
        });

        window.addEventListener('mouseleave', () => {
            mouseActive = false;
        });

        // Mobile Touch Events for Particle Constellation
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                mouseActive = true;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                mouseActive = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouseActive = false;
        });

        const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);
        const particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 1.8 + 1;
                this.color = Math.random() > 0.4 ? 'rgba(255, 101, 126, ' : 'rgba(255, 42, 75, ';
                this.alpha = Math.random() * 0.6 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.shadowColor = '#ff2a4b';
                ctx.shadowBlur = 8;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const renderCanvas = () => {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 101, 126, ${0.25 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }

                // Connect to mouse or touch pointer
                if (mouseActive) {
                    const dx = particles[i].x - mouseX;
                    const dy = particles[i].y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = `rgba(255, 42, 75, ${0.45 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.9;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderCanvas);
        };

        renderCanvas();
    }

    // ==========================================================================
    // 2. CUSTOM NEON FOLLOWER CURSOR ENGINE
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const updateCursorRing = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(updateCursorRing);
        };
        updateCursorRing();

        // Hover expansions
        const hoverTargets = document.querySelectorAll('a, button, input, textarea, .glass-card, [data-magnetic]');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
            target.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
        });

        window.addEventListener('mousedown', () => cursorRing.classList.add('cursor-active'));
        window.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-active'));
    }

    // ==========================================================================
    // 3. TYPEWRITER HEADLINE ROTATOR ENGINE
    // ==========================================================================
    const typewriterElement = document.querySelector('.typewriter-target');
    if (typewriterElement && typewriterElement.hasAttribute('data-typewriter')) {
        try {
            const phrases = JSON.parse(typewriterElement.getAttribute('data-typewriter'));
            let phraseIndex = 0;
            let charIndex = phrases[0].length;
            let isDeleting = false;

            const type = () => {
                const currentPhrase = phrases[phraseIndex];

                if (isDeleting) {
                    charIndex--;
                    typewriterElement.textContent = currentPhrase.substring(0, charIndex);
                } else {
                    charIndex++;
                    typewriterElement.textContent = currentPhrase.substring(0, charIndex);
                }

                let typeSpeed = isDeleting ? 40 : 80;

                if (!isDeleting && charIndex === currentPhrase.length) {
                    typeSpeed = 2200; // Pause at full phrase
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typeSpeed = 400; // Pause before typing next
                }

                setTimeout(type, typeSpeed);
            };

            setTimeout(type, 1500);
        } catch (err) {
            console.error('Typewriter JSON parse error:', err);
        }
    }

    // ==========================================================================
    // 4. 3D CARD TILT & SPECULAR GLARE CONTROLLER (Desktop & Mobile Touch)
    // ==========================================================================
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
            card.style.setProperty('--glare-opacity', '1');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.setProperty('--glare-opacity', '0');
        });

        // Mobile touch pulse effect
        card.addEventListener('touchstart', () => {
            card.style.transform = 'perspective(1000px) rotateX(-2deg) scale3d(0.98, 0.98, 0.98)';
            card.style.setProperty('--glare-opacity', '0.6');
        }, { passive: true });

        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) scale3d(1, 1, 1)';
                card.style.setProperty('--glare-opacity', '0');
            }, 250);
        });
    });

    // ==========================================================================
    // 5. MAGNETIC BUTTON HOVER PULL CONTROLLER
    // ==========================================================================
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            elem.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
        });

        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0px, 0px)';
        });
    });

    // ==========================================================================
    // 6. SCROLL REVEAL INTERSECTION OBSERVER ENGINE (OPTIMIZED FOR MOBILE)
    // ==========================================================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const checkAndRevealInViewport = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(elem => {
            const rect = elem.getBoundingClientRect();
            // Reveal if element top is within expanded viewport height
            if (rect.top <= windowHeight + 80 && rect.bottom >= -80) {
                const delay = elem.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    elem.classList.add('is-revealed');
                }, parseInt(delay));
            }
        });
    };

    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(() => {
                            entry.target.classList.add('is-revealed');
                        }, parseInt(delay));
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.01,
                rootMargin: '100px 0px 80px 0px'
            });

            revealElements.forEach(elem => revealObserver.observe(elem));
        }

        // Additional scroll & load fallback listeners for mobile screen responsiveness
        window.addEventListener('scroll', checkAndRevealInViewport, { passive: true });
        window.addEventListener('load', checkAndRevealInViewport);
        
        // Initial immediate check
        checkAndRevealInViewport();
        
        // Mobile safety trigger: reveal all elements after 2.5s to prevent any hidden content
        setTimeout(() => {
            revealElements.forEach(elem => elem.classList.add('is-revealed'));
        }, 2500);
    }
});


