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

    // 5. Carousel Navigation (Mobile & Desktop with arrows)
    const carouselWrappers = document.querySelectorAll('.carousel-wrapper');

    carouselWrappers.forEach(wrapper => {
        const carousel = wrapper.querySelector('.pain-grid, .programs-grid, .testimonials-grid');
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

    // 8. Modal Logic for Diagnóstico
    const btnOpenDiag = document.getElementById('btn-open-diagnostico');
    const btnCloseDiag = document.getElementById('btn-close-diagnostico');
    const modalDiag = document.getElementById('diagnostico');

    if (btnOpenDiag && modalDiag) {
        btnOpenDiag.addEventListener('click', (e) => {
            e.preventDefault();
            modalDiag.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    if (btnCloseDiag && modalDiag) {
        btnCloseDiag.addEventListener('click', () => {
            modalDiag.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (modalDiag) {
        modalDiag.addEventListener('click', (e) => {
            if (e.target === modalDiag || e.target.classList.contains('modal-container')) {
                modalDiag.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 9. Diagnostic Form Logic
    const diagForm = document.getElementById('form-diagnostico');
    if (diagForm) {
        const steps = Array.from(document.querySelectorAll('.form-step'));
        const nextBtns = document.querySelectorAll('.btn-next');
        const prevBtns = document.querySelectorAll('.btn-prev');
        const progressFill = document.getElementById('progress-fill');
        const stepIndicators = document.querySelectorAll('.progress-steps .step');
        let currentStep = 0;

        function updateFormState() {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === currentStep);
            });
            
            stepIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index <= currentStep);
            });

            // Update progress bar (0%, 33%, 66%, 100%)
            const progress = (currentStep / (steps.length - 1)) * 100;
            if (progressFill) progressFill.style.width = `${progress}%`;
        }

        function validateStep(stepIndex) {
            const stepEl = steps[stepIndex];
            const inputs = stepEl.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            // Clear previous styles
            stepEl.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));

            inputs.forEach(input => {
                if (input.type === 'radio') {
                    const name = input.name;
                    const isChecked = stepEl.querySelector(`input[name="${name}"]:checked`);
                    if (!isChecked) {
                        isValid = false;
                        const group = input.closest('.radio-group');
                        if (group) {
                            group.style.border = "1px solid #ef4444";
                            group.style.borderRadius = "8px";
                            group.style.padding = "4px";
                            setTimeout(() => { group.style.border = "none"; group.style.padding = "0"; }, 3000);
                        }
                    }
                } else if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = "#ef4444";
                    setTimeout(() => input.style.borderColor = "", 3000);
                } else if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.style.borderColor = "#ef4444";
                        setTimeout(() => input.style.borderColor = "", 3000);
                    }
                }
            });

            return isValid;
        }

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    currentStep++;
                    updateFormState();
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentStep--;
                updateFormState();
            });
        });

        diagForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateStep(currentStep)) return;

            const submitBtn = document.getElementById('btn-submit-diag');
            const spinner = document.getElementById('form-spinner');
            
            submitBtn.style.display = 'none';
            if (spinner) spinner.style.display = 'block';

            // Calculate Score
            const getVal = (name) => {
                const checked = document.querySelector(`input[name="${name}"]:checked`);
                return checked ? checked.value : '';
            };

            const equipo = getVal('equipo');
            
            // A=1, B=2, C=3
            const scoreMap = { 'A': 1, 'B': 2, 'C': 3 };
            let totalScore = 0;
            ['vacaciones', 'incendios', 'onboarding', 'procesos', 'finanzas'].forEach(name => {
                const val = getVal(name);
                if (scoreMap[val]) totalScore += scoreMap[val];
            });

            let dependencia = 'MEDIA';
            let depClass = 'dependencia-media';
            if (totalScore >= 12) {
                dependencia = 'ALTA';
                depClass = 'dependencia-alta';
            } else if (totalScore <= 7) {
                dependencia = 'BAJA';
                depClass = 'dependencia-baja';
            }

            // Recommendation Logic
            let plan = 'P.A.C.';
            let justificacion = 'Ideal para dueños que necesitan salir de la operación diaria, ordenar las finanzas y construir mentalidad empresarial.';
            let planLink = './pac.html';
            let planClass = 'badge-pac';

            if (dependencia === 'ALTA' && (equipo === '4-10' || equipo === '+10')) {
                plan = 'M·A·R';
                justificacion = 'Tienes equipo pero falta estructura. Este programa 1 a 1 instalará tableros de control y automatizaciones para darte libertad.';
                planLink = './mar.html';
                planClass = 'badge-mar';
            } else if (dependencia === 'MEDIA' && equipo === '+10' && getVal('onboarding') !== 'A') {
                plan = 'C·D·E';
                justificacion = 'Tu negocio ya tracciona, pero necesitas que tus mandos medios o encargados lideren con autonomía. Este programa forma a tu equipo.';
                planLink = './cde.html';
                planClass = 'badge-cde';
            }

            // Update DOM
            const resDep = document.getElementById('results-dependencia');
            if (resDep) {
                resDep.textContent = dependencia;
                resDep.className = depClass;
            }
            
            const resPlan = document.getElementById('results-plan');
            if (resPlan) {
                resPlan.textContent = plan;
                resPlan.className = 'recommended-badge ' + planClass;
            }
            
            const resJust = document.getElementById('results-justificacion');
            if (resJust) resJust.textContent = justificacion;
            
            const resLink = document.getElementById('results-link-plan');
            if (resLink) resLink.href = planLink;

            // Save result to hidden input for email
            const inputResult = document.getElementById('input-diagnostico-resultado');
            if (inputResult) {
                inputResult.value = `Dependencia: ${dependencia} | Recomendación: ${plan}`;
            }

            // Submit Data via Fetch
            const formData = new FormData(diagForm);
            
            try {
                const response = await fetch(diagForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    currentStep++;
                    updateFormState();
                } else {
                    alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
                    submitBtn.style.display = 'inline-block';
                    if (spinner) spinner.style.display = 'none';
                }
            } catch (error) {
                console.error(error);
                // Si falla el fetch por CORS o algo, igual mostramos el resultado para no bloquear al usuario en la demo
                currentStep++;
                updateFormState();
            }
        });
    }
});
