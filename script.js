// Narendra Portfolio JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    
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
});
