window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 800);
        }, 600); // Pequeño retraso para que se aprecie la animación
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // 3. Intersection Observer for fade-in animations
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-up');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 5. Auto-scroll Mobile Carousels
    const carousels = document.querySelectorAll('.pain-grid, .programs-grid, .testimonials-grid');

    carousels.forEach(carousel => {
        let autoScrollInterval;

        const startAutoScroll = () => {
            if (window.innerWidth > 768) return;
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                const firstCard = carousel.querySelector('div');
                if (!firstCard) return;
                const cardWidth = firstCard.offsetWidth;
                const gap = 24;
                const scrollAmount = cardWidth + gap;

                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 3500);
        };

        const stopAutoScroll = () => clearInterval(autoScrollInterval);

        startAutoScroll();

        window.addEventListener('resize', () => {
            stopAutoScroll();
            startAutoScroll();
        });

        carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
        carousel.addEventListener('touchend', startAutoScroll, { passive: true });
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
    });

    // 6. Hero Background Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 7. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';

            // Cerrar todos los demás
            faqItems.forEach(other => {
                const otherQ = other.querySelector('.faq-question');
                const otherA = other.querySelector('.faq-answer');
                otherQ.setAttribute('aria-expanded', 'false');
                otherA.classList.remove('open');
            });

            // Abrir el clickeado (si estaba cerrado)
            if (!isOpen) {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });

});
