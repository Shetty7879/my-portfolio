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

    // Carousel Logic
    // Carousel Logic (Generic for multiple carousels)
    const carousels = document.querySelectorAll('.carousel-wrapper');

    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (track && prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cardWidth = track.firstElementChild.offsetWidth;
                const gap = 32; // 2rem approx
                track.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                const cardWidth = track.firstElementChild.offsetWidth;
                const gap = 32;
                track.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
            });
        }
    });
});
