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

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Simple reveal animation on scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.fade-in');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Flip hamburger to 'X'
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu automatically when clicking a link
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
    const carousels = document.querySelectorAll('.pain-grid, .programs-grid');

    carousels.forEach(carousel => {
        let autoScrollInterval;

        const startAutoScroll = () => {
            if (window.innerWidth > 768) return; // Activar solo en móvil

            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                // Seleccionamos la primera tarjeta para medir el avance
                const firstCard = carousel.querySelector('div');
                if (!firstCard) return;

                const cardWidth = firstCard.offsetWidth;
                const gap = 24; // 1.5rem aprox
                const scrollAmount = cardWidth + gap;

                // Si llegamos al final, volver al inicio
                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                    carousel.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    carousel.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            }, 3500); // Cambia de tarjeta cada 3.5 segundos
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Iniciar al cargar
        startAutoScroll();

        // Control de redimensionamiento
        window.addEventListener('resize', () => {
            stopAutoScroll();
            startAutoScroll();
        });

        // Pausar si el usuario interactúa (toca o pone el cursor)
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
        }, 5000); // Cambia la imagen de fondo cada 5 segundos
    }
});
