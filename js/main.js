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

    // UTM Parameter Capture & Storage
    function captureUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        
        utms.forEach(utm => {
            const val = urlParams.get(utm);
            if (val) {
                try {
                    sessionStorage.setItem('fn_' + utm, val);
                } catch (e) {
                    console.error("sessionStorage error:", e);
                }
            }
        });
    }
    captureUTMParameters();

    // 0. PAC Alert Bar — dismiss + seguir a la navbar
    const pacAlertBar = document.getElementById('pac-alert-bar');
    const pacAlertClose = document.getElementById('pac-alert-close');

    if (pacAlertBar) {
        const navbarEl = document.querySelector('.navbar');

        // Función que ajusta el top del alert al tamaño actual de la navbar
        const syncAlertTop = () => {
            if (navbarEl && pacAlertBar.style.display !== 'none') {
                pacAlertBar.style.top = navbarEl.offsetHeight + 'px';
            }
        };

        // Sincronizar en scroll, resize, al cargar y al finalizar transiciones de la navbar
        window.addEventListener('scroll', syncAlertTop, { passive: true });
        window.addEventListener('resize', syncAlertTop, { passive: true });
        window.addEventListener('load', syncAlertTop, { passive: true });
        
        if (navbarEl) {
            navbarEl.addEventListener('transitionend', syncAlertTop);
        }

        // Sincronización inicial
        syncAlertTop();

        if (pacAlertClose) {
            pacAlertClose.addEventListener('click', () => {
                pacAlertBar.classList.add('hidden');
                setTimeout(() => { pacAlertBar.style.display = 'none'; }, 380);
                window.removeEventListener('scroll', syncAlertTop);
                window.removeEventListener('resize', syncAlertTop);
                window.removeEventListener('load', syncAlertTop);
                if (navbarEl) {
                    navbarEl.removeEventListener('transitionend', syncAlertTop);
                }
            });
        }
    }

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

    // 5. Carousel Navigation (Mobile & Desktop with arrows)
    const carouselWrappers = document.querySelectorAll('.carousel-wrapper');

    carouselWrappers.forEach(wrapper => {
        const carousel = wrapper.querySelector('.pain-grid, .programs-grid, .testimonials-grid, .team-grid');
        const prevBtn = wrapper.querySelector('.carousel-nav-btn.prev');
        const nextBtn = wrapper.querySelector('.carousel-nav-btn.next');
        const dotsContainer = wrapper.parentElement.querySelector('.carousel-dots');
        
        if (!carousel) return;

        const cards = carousel.children;
        const totalCards = cards.length;

        // Create dots
        if (dotsContainer) {
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    const cardWidth = cards[0].offsetWidth;
                    const gap = 24;
                    carousel.scrollTo({ left: i * (cardWidth + gap), behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
            }
        }

        const updateDots = () => {
            if (!dotsContainer) return;
            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const scrollIndex = Math.round(carousel.scrollLeft / (cardWidth + gap));
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === scrollIndex);
            });
        };

        const scrollNext = () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const scrollAmount = cardWidth + gap;

            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        };

        const scrollPrev = () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const scrollAmount = cardWidth + gap;

            if (carousel.scrollLeft <= 10) {
                carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        };

        if (nextBtn) nextBtn.addEventListener('click', scrollNext);
        if (prevBtn) prevBtn.addEventListener('click', scrollPrev);

        carousel.addEventListener('scroll', updateDots);

        // Auto-scroll
        let autoScrollInterval;
        const startAutoScroll = () => {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(scrollNext, 5500);
        };
        const stopAutoScroll = () => clearInterval(autoScrollInterval);

        startAutoScroll();
        wrapper.addEventListener('mouseenter', stopAutoScroll);
        wrapper.addEventListener('mouseleave', startAutoScroll);
        carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
        carousel.addEventListener('touchend', startAutoScroll, { passive: true });
    });

    // 6. Hero Image Slider (Inside the Card)
    const heroSlides = document.querySelectorAll('.hero-img-new');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5500);
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

    // Barra CTA fija (mobile): aparece recién después del hero para no tapar el pill.
    // IntersectionObserver es robusto sin importar qué elemento sea el contenedor de scroll.
    var fnCtaBar = document.querySelector('.mobile-cta-bar');
    var fnHeroSec = document.getElementById('inicio');
    if (fnCtaBar && fnHeroSec && 'IntersectionObserver' in window) {
        var fnCtaObserver = new IntersectionObserver(function (entries) {
            document.body.classList.toggle('fn-cta-visible', !entries[0].isIntersecting);
        }, { threshold: 0 });
        fnCtaObserver.observe(fnHeroSec);
    } else if (fnCtaBar) {
        document.body.classList.add('fn-cta-visible'); // fallback: siempre visible
    }

    // Evento Contact del píxel en cualquier clic a WhatsApp.
    document.addEventListener('click', function (e) {
        const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"], a[href*="api.whatsapp"]');
        if (!waLink) return;
        if (typeof fbq === 'function') {
            try {
                fbq('track', 'Contact', { content_name: 'WhatsApp' });
            } catch (err) { console.error('Meta Pixel Contact Error:', err); }
        }
    }, true);

    // 8b. Modal de Guía gratis — captura nombre + email, manda el lead al mail y descarga el PDF.
    // Sirve para las dos guías: se elige con window.fnOpenGuia('cuellos' | 'pilares').
    const GUIAS = {
        cuellos: {
            titulo: 'Los 3 cuellos de botella de tu negocio',
            bajada: 'Dejanos tu nombre y tu email, y descargá la guía al instante. Sin vueltas.',
            archivo: 'Guia-3-Cuellos-de-Botella.pdf',
            evento: 'Guía 3 Cuellos de Botella',
            origen: 'Descarga guía "Los 3 cuellos de botella"'
        },
        pilares: {
            titulo: 'Los 5 pilares de un negocio que se sostiene solo',
            bajada: 'Cómo se conectan entre sí, por qué ninguno funciona aislado y cuál define hoy tu techo. Dejanos tu nombre y tu email y la descargás al instante.',
            archivo: 'Guia-5-Pilares-Fluir-Negocios.pdf',
            evento: 'Guía 5 Pilares',
            origen: 'Descarga guía "Los 5 pilares"'
        }
    };
    let guiaActual = GUIAS.cuellos;

    const modalGuia = document.getElementById('modal-guia');
    function openGuiaModal(clave) {
        if (!modalGuia) return;
        guiaActual = GUIAS[clave] || GUIAS.cuellos;
        const t = document.getElementById('guia-titulo');
        if (t) t.textContent = guiaActual.titulo;
        const b = document.getElementById('guia-bajada');
        if (b) b.textContent = guiaActual.bajada;
        const dl = document.getElementById('guia-download-link');
        if (dl) {
            dl.href = './assets/pdf/' + guiaActual.archivo;
            dl.setAttribute('download', guiaActual.archivo);
        }
        const fs = document.getElementById('guia-form-state');
        const ss = document.getElementById('guia-success-state');
        if (fs) fs.style.display = '';
        if (ss) ss.style.display = 'none';
        const err = document.getElementById('guia-err');
        if (err) err.style.display = 'none';
        modalGuia.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeGuiaModal() {
        if (!modalGuia) return;
        modalGuia.classList.remove('active');
        document.body.style.overflow = '';
    }
    window.fnOpenGuia = openGuiaModal;

    if (modalGuia) {
        const btnCloseGuia = document.getElementById('btn-close-guia');
        if (btnCloseGuia) btnCloseGuia.addEventListener('click', closeGuiaModal);
        modalGuia.addEventListener('click', function (e) {
            if (e.target === modalGuia || e.target.classList.contains('modal-container')) closeGuiaModal();
        });

        const btnGuiaSubmit = document.getElementById('btn-guia-submit');
        if (btnGuiaSubmit) {
            btnGuiaSubmit.addEventListener('click', function () {
                const em = document.getElementById('guia-email');
                const n = document.getElementById('guia-nombre');
                const err = document.getElementById('guia-err');
                const email = em ? em.value.trim() : '';
                const nombre = n ? n.value.trim() : '';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    if (err) err.style.display = 'block';
                    if (em) em.focus();
                    return;
                }

                // 1) Evento Lead del píxel (con Advanced Matching)
                if (typeof fbq === 'function') {
                    try {
                        fbq('init', '2089699688631959', { em: email.toLowerCase(), fn: nombre.toLowerCase().split(' ')[0] });
                        fbq('track', 'Lead', { content_name: guiaActual.evento });
                    } catch (e) { console.error('Pixel guía:', e); }
                }

                // 2) Mandar el lead al mail (Formspree, mismo endpoint del diagnóstico)
                try {
                    const fd = new FormData();
                    fd.set('_subject', 'Nueva descarga de guía — Fluir Negocios');
                    fd.set('Nombre', nombre);
                    fd.set('Email', email);
                    fd.set('Origen', guiaActual.origen);
                    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (u) {
                        try { const v = sessionStorage.getItem('fn_' + u); if (v) fd.set(u, v); } catch (e) {}
                    });
                    fetch('https://formspree.io/f/mredepgv', { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } }).catch(function () {});
                } catch (e) { console.error('Lead guía:', e); }

                // 3) Disparar la descarga del PDF
                try {
                    const a = document.createElement('a');
                    a.href = './assets/pdf/' + guiaActual.archivo;
                    a.download = guiaActual.archivo;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } catch (e) { console.error('Descarga guía:', e); }

                // 4) Mostrar estado de éxito
                const fs = document.getElementById('guia-form-state');
                const ss = document.getElementById('guia-success-state');
                if (fs) fs.style.display = 'none';
                if (ss) ss.style.display = '';
            });
        }
    }

});
