document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation (Fade In Elements)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.section, .hero, .skill-card, .timeline-item, .edu-card, .cert-card, .project-card');
    sections.forEach(section => {
        section.style.opacity = '0'; // Initial state
        section.style.transform = 'translateY(20px)'; // Initial offset
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Initial styles from JS to ensure clean start
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .hero-subtitle, .hero-title, .hero-role, .hero-description {
            visibility: hidden; /* Hide initially for typing effect */
        }
        .typing-visible {
            visibility: visible !important;
        }
    `;
    document.head.appendChild(style);

    // Typing Animation Script
    const typeWriter = (element, text, speed = 50) => {
        return new Promise(resolve => {
            element.textContent = '';
            element.classList.add('typing-visible');
            element.classList.add('typing-cursor');

            let i = 0;
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing-cursor');
                    resolve();
                }
            }
            type();
        });
    };

    // Special handler for the Role which has a span
    const typeRole = (element, part1, part2, speed = 50) => {
        return new Promise(resolve => {
            element.textContent = '';
            element.classList.add('typing-visible');
            element.classList.add('typing-cursor');

            let i = 0;
            function typePart1() {
                if (i < part1.length) {
                    element.textContent += part1.charAt(i);
                    i++;
                    setTimeout(typePart1, speed);
                } else {
                    // Start Part 2 (Span)
                    const span = document.createElement('span');
                    element.appendChild(span);
                    // Move cursor to span? No, keep on parent or append to span?
                    // CSS .typing-cursor::after is on the element class. 
                    // Use a temporary class on span or just append text to span and keep cursor on parent?
                    // Best visual: remove cursor from parent, add to span.
                    element.classList.remove('typing-cursor');
                    span.classList.add('typing-cursor');

                    let j = 0;
                    function typePart2() {
                        if (j < part2.length) {
                            span.textContent += part2.charAt(j);
                            j++;
                            setTimeout(typePart2, speed);
                        } else {
                            span.classList.remove('typing-cursor');
                            // Keep blinking cursor at the very end? User didn't ask, but it's cool.
                            // span.classList.add('typing-cursor'); 
                            resolve();
                        }
                    }
                    typePart2();
                }
            }
            typePart1();
        });
    };

    const startTyping = async () => {
        const subtitle = document.querySelector('.hero-subtitle');
        const title = document.querySelector('.hero-title');
        const role = document.querySelector('.hero-role');
        const desc = document.querySelector('.hero-description');

        // Text Content
        const subtitleText = "Hello, It's Me";
        const titleText = "Prajwal S Shetty";
        const rolePart1 = "And I'm a ";
        const rolePart2 = "Cybersecurity Enthusiast";
        const descText = "I am a Computer Science Engineering student passionate about cybersecurity, technology, and leadership. I balance both physical and intellectual challenges, turning problems into solutions.";

        // Sequence
        // Note: We use a slightly faster speed for description
        await new Promise(r => setTimeout(r, 500)); // Small initial delay
        await typeWriter(subtitle, subtitleText, 50);
        await typeWriter(title, titleText, 50);
        await typeRole(role, rolePart1, rolePart2, 50);
        await typeWriter(desc, descText, 20); // Faster for long text

        // Show social icons after typing
        const socialIcons = document.querySelector('.social-icons');
        if (socialIcons) socialIcons.classList.add('fade-in');

        const heroBtn = document.querySelector('.hero .btn');
        if (heroBtn) heroBtn.classList.add('fade-in');
    };

    // Hide social/buttons initially for effect
    const heroExtras = document.querySelectorAll('.social-icons, .hero .btn');
    heroExtras.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 1s';
    });

    // Start
    startTyping();

    // Carousel Logic (Generic for multiple carousels)
    const carousels = document.querySelectorAll('.carousel-wrapper');

    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (!track || !prevBtn || !nextBtn) return;

        let cards = Array.from(track.children);
        if (cards.length === 0) return;

        // Double clone for seamless infinite scroll buffer
        cards.forEach(card => {
            const cloneEnd1 = card.cloneNode(true);
            const cloneEnd2 = card.cloneNode(true);
            track.appendChild(cloneEnd1);
            track.appendChild(cloneEnd2);
        });

        [...cards].reverse().forEach(card => {
            const cloneStart1 = card.cloneNode(true);
            const cloneStart2 = card.cloneNode(true);
            track.insertBefore(cloneStart1, track.firstElementChild);
            track.insertBefore(cloneStart2, track.firstElementChild);
        });

        const getCardWidthAndGap = () => {
            const cardWidth = track.firstElementChild.offsetWidth;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 32;
            return cardWidth + gap;
        };

        // Start initial scroll position at the original card set (offset by 2 cloned sets)
        const initScroll = () => {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = getCardWidthAndGap() * (cards.length * 2);
            track.offsetHeight;
            track.style.scrollBehavior = 'smooth';
        };
        setTimeout(initScroll, 100);
        window.addEventListener('resize', initScroll);

        let isAnimating = false;

        const checkBoundary = () => {
            const scrollAmount = getCardWidthAndGap();
            const setWidth = scrollAmount * cards.length;
            const startOffset = setWidth * 2;

            // If scrolled left past start of original cards
            if (track.scrollLeft < startOffset - 10) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft += setWidth;
                track.offsetHeight;
                track.style.scrollBehavior = 'smooth';
            }
            // If scrolled right past 4th card into end clones -> seamless jump back 1 set
            else if (track.scrollLeft >= startOffset + setWidth - 10) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft -= setWidth;
                track.offsetHeight;
                track.style.scrollBehavior = 'smooth';
            }
        };

        const scrollCarousel = (direction) => {
            if (isAnimating) return;
            isAnimating = true;

            const scrollAmount = getCardWidthAndGap();
            track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

            setTimeout(() => {
                isAnimating = false;
                checkBoundary();
            }, 520);
        };

        nextBtn.addEventListener('click', () => scrollCarousel(1));
        prevBtn.addEventListener('click', () => scrollCarousel(-1));

        track.addEventListener('scroll', () => {
            if (!isAnimating) {
                checkBoundary();
            }
        });

        // Mouse Drag / Swipe
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.classList.add('active');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            track.style.scrollBehavior = 'auto'; // Disable smooth for drag
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.classList.remove('active');
            track.style.scrollBehavior = 'smooth';
            checkBoundary();
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.classList.remove('active');
            track.style.scrollBehavior = 'smooth';
            checkBoundary();
            // Optional: Snap to closest card after drag ends
            const scrollAmount = getCardWidthAndGap();
            const currentScroll = track.scrollLeft;
            const targetScroll = Math.round(currentScroll / scrollAmount) * scrollAmount;
            track.scrollTo({ left: targetScroll, behavior: 'smooth' });
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            track.scrollLeft = scrollLeft - walk;
        });

        // Touch Swipe Events (Native scrolling handles this well, but keeping consistent snap)
        track.addEventListener('touchend', () => {
            setTimeout(() => {
                if (!isAnimating) checkBoundary();
            }, 100);
        });
    });

    // 3D Card Mouse Tilt Effect
    const tiltElements = document.querySelectorAll('.project-card, .social-card, .skill-card, .sports-card, .edu-card, .timeline-content');

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Disable tilt during carousel dragging
            if (card.closest('.carousel-track') && card.closest('.carousel-track').classList.contains('active')) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6; // 6 deg tilt max
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        });
    });
});
