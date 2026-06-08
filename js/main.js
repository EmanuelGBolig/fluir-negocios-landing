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

    // 8. Modal Logic for Diagnóstico
    const btnOpenDiag = document.getElementById('btn-open-diagnostico');
    const btnCloseDiag = document.getElementById('btn-close-diagnostico');
    const modalDiag = document.getElementById('diagnostico');

    function openDiagnosticModal() {
        if (modalDiag) {
            modalDiag.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling

            // Cada apertura arranca limpia: reset del state + pantalla de bienvenida
            if (typeof fnStartDiagnostico === 'function') {
                fnStartDiagnostico();
            }

            // Trigger Meta Pixel Custom Event for starting diagnostic
            if (typeof fbq === 'function') {
                try {
                    fbq('trackCustom', 'DiagnosticStart');
                } catch (err) {
                    console.error("Meta Pixel Error:", err);
                }
            }
        }
    }

    // Trigger global para los botones con onclick inline (Obtener Guía, Hacer diagnóstico, etc.)
    window.fnOpenDiagnostico = openDiagnosticModal;

    // Mostrar la barra CTA fija (mobile) recién después del hero, para no tapar el pill de Abi.
    // Se usa IntersectionObserver (robusto sin importar qué elemento sea el contenedor de scroll).
    var fnCtaBar = document.querySelector('.mobile-cta-bar');
    var fnHeroSec = document.getElementById('inicio');
    if (fnCtaBar && fnHeroSec && 'IntersectionObserver' in window) {
        var fnCtaObserver = new IntersectionObserver(function (entries) {
            // Mostrar la barra solo cuando el hero ya no está en pantalla.
            document.body.classList.toggle('fn-cta-visible', !entries[0].isIntersecting);
        }, { threshold: 0 });
        fnCtaObserver.observe(fnHeroSec);
    } else if (fnCtaBar) {
        document.body.classList.add('fn-cta-visible'); // fallback: siempre visible
    }

    // Evento Contact del píxel en cualquier clic a WhatsApp (estáticos + botón dinámico del resultado).
    document.addEventListener('click', function (e) {
        const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"], a[href*="api.whatsapp"]');
        if (!waLink) return;
        if (typeof fbq === 'function') {
            try {
                fbq('track', 'Contact', { content_name: 'WhatsApp' });
            } catch (err) { console.error('Meta Pixel Contact Error:', err); }
        }
    }, true);

    if (btnOpenDiag && modalDiag) {
        btnOpenDiag.addEventListener('click', (e) => {
            e.preventDefault();
            openDiagnosticModal();
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

    // Auto-open diagnostic modal for Meta Ads (Facebook/Instagram) visitors
    function checkMetaAdsAutoOpen() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Detect fbclid (appended automatically by Facebook/Instagram click)
        const hasFbclid = urlParams.has('fbclid');
        
        // Detect UTM source indicating Meta platforms
        const utmSource = urlParams.get('utm_source') ? urlParams.get('utm_source').toLowerCase() : '';
        const isMetaSource = ['facebook', 'instagram', 'meta', 'fb', 'ig', 'fb-ads', 'meta-ads'].includes(utmSource);
        
        // Detect UTM medium indicating paid social ads
        const utmMedium = urlParams.get('utm_medium') ? urlParams.get('utm_medium').toLowerCase() : '';
        const isAdsMedium = ['cpc', 'cpm', 'ads', 'paid', 'social-ads'].includes(utmMedium);
        
        // Detect query parameter to force open manually if needed (e.g. ?diagnostico=true)
        const forceOpen = urlParams.get('diagnostico') === 'true' || urlParams.get('open') === 'diagnostico';

        if (hasFbclid || isMetaSource || (isAdsMedium && utmSource.includes('fb')) || forceOpen) {
            // Short timeout to let the page render before showing modal
            setTimeout(() => {
                openDiagnosticModal();
            }, 800);
        }
    }
    checkMetaAdsAutoOpen();

    // 9. Diagnóstico — flujo tipo quiz (rediseño).
    // Preguntas primero, mail al final. Maqueta y lógica: Prototipo_Diagnostico_Fluir.html.
    // Estilos: css/diagnostico.css (scopeados en #fnDiag).
    const fnStage = document.getElementById('fnStage');
    const fnBar = document.getElementById('fnBar');
    const fnBarWrap = document.querySelector('#fnDiag .fn-bar');

    // Endpoint de leads (mismo Formspree que ya usaba el sitio).
    // DEV: reemplazar por el endpoint real del CRM/Sheets/Apps Script si se migra.
    const FN_LEAD_ENDPOINT = 'https://formspree.io/f/mredepgv';

    const FN_QUESTIONS = [
        { key: 'vacaciones', q: 'Si te tomás 30 días de vacaciones, sin celular, ¿qué pasa con tu negocio?',
          opts: [ { t: 'Crece o se mantiene igual de bien.', w: 0 },
                  { t: 'Sigue, pero bajan las ventas y hay desorganización.', w: 1 },
                  { t: 'Se frena por completo o es un caos.', w: 2 } ] },
        { key: 'incendios', q: '¿Cuántas horas por semana dedicás a "apagar incendios" y tareas que no te corresponden?',
          opts: [ { t: 'Menos de 5 horas.', w: 0 },
                  { t: 'Entre 10 y 20 horas.', w: 1 },
                  { t: 'Más de 30 horas. El día a día me consume.', w: 2 } ] },
        { key: 'onboarding', q: 'Cuando entra alguien nuevo al equipo, ¿cómo lo capacitás?',
          opts: [ { t: 'Con procesos documentados y un onboarding casi automático.', w: 0 },
                  { t: 'Le explicamos sobre la marcha o con apuntes básicos.', w: 1 },
                  { t: 'Lo capacito yo mismo, y me quita muchísimo tiempo.', w: 2 } ] },
        { key: 'procesos', q: '¿Qué parte de tus procesos clave (ventas, atención, entrega) están escritos paso a paso?',
          opts: [ { t: 'Más del 80% — tenemos manuales operativos.', w: 0 },
                  { t: 'Entre 10% y 40% — algunas cosas sueltas.', w: 1 },
                  { t: '0% — todo está en mi cabeza o en la del equipo.', w: 2 } ] },
        { key: 'numeros', q: '¿Conocés con exactitud tu margen neto y tu costo por cliente nuevo del mes pasado?',
          opts: [ { t: 'Sí, los mido rigurosamente.', w: 0 },
                  { t: 'Tengo una idea aproximada.', w: 1 },
                  { t: 'No, me guío por lo que hay en el banco.', w: 2 } ] },
        { key: 'sector', meta: true, q: '¿A qué se dedica tu negocio?',
          opts: [ { t: 'Servicios', w: 0 }, { t: 'E-commerce / Retail', w: 0 }, { t: 'Manufactura / Producción', w: 0 }, { t: 'Otro', w: 0 } ] },
        { key: 'equipo', meta: true, q: '¿Cuántas personas son hoy en tu equipo?',
          opts: [ { t: 'Solo yo', w: 0 }, { t: '1 a 3', w: 0 }, { t: '4 a 10', w: 0 }, { t: 'Más de 10', w: 0 } ] }
    ];

    const FN_PROG = {
        PAC: { code: 'P·A·C', name: 'Programa Acelerador de Crecimiento',
               desc: '8 semanas grupales para ordenar tu cabeza de dueño, las finanzas y la estrategia comercial. Para dejar de improvisar.',
               link: 'https://fluirnegocios.com/pages/pac.html' },
        MAR: { code: 'M·A·R', name: 'Método Acelerador de Resultados',
               desc: 'Consultoría 1 a 1 para construir un negocio que funcione sin vos: tableros de KPIs, delegación y automatización.',
               link: 'https://fluirnegocios.com/pages/mar.html' },
        CDE: { code: 'C·D·E', name: 'Capacitación de Equipo',
               desc: 'Formamos a tus encargados y gerentes para que lideren la operación con autonomía. Para soltar el día a día.',
               link: 'https://fluirnegocios.com/pages/cde.html' }
    };

    const FN_WA = 'https://wa.me/5492233444604?text=';
    const FN_PDF = 'https://fluirnegocios.com/assets/pdf/Guia-3-Cuellos-de-Botella.pdf';
    // Denominador de la barra: 9 pantallas con progreso (5 operativas + abierta + sector + equipo + mail) + resultado.
    const FN_TOTAL = 10;

    // OP_COUNT = preguntas operativas; tras ellas va la pregunta abierta y luego las de perfil (sector, equipo).
    const FN_OP_COUNT = FN_QUESTIONS.filter(function (q) { return !q.meta; }).length;
    let fnState = { qi: 0, answers: {}, open: '', openShown: false, lead: { nombre: '', email: '' }, leadSent: false };

    function fnEl(html) { if (fnStage) fnStage.innerHTML = html; }
    function fnSetBar(stepDone) { if (fnBar) fnBar.style.width = Math.round((stepDone / FN_TOTAL) * 100) + '%'; }
    // La barra solo se muestra durante el avance (preguntas/abierta/mail), no en bienvenida ni resultado.
    function fnBarShow(show) { if (fnBarWrap) fnBarWrap.style.display = show ? '' : 'none'; }
    function fnEsc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function fnShowWelcome() {
        fnBarShow(false);
        fnSetBar(0);
        fnEl(
            '<div class="eyebrow">Diagnóstico gratuito</div>' +
            '<h1>¿Tu negocio puede funcionar sin vos?</h1>' +
            '<p class="lead">Respondé 7 preguntas (te lleva 2 minutos) y te decimos qué tan dependiente de vos es tu negocio, con un plan concreto para soltarlo.</p>' +
            '<div class="pills"><span class="pill">2 minutos</span><span class="pill">Sin compromiso</span><span class="pill">Resultado al instante</span></div>' +
            '<button class="btn btn-primary full" data-action="start">Empezar el diagnóstico →</button>' +
            '<div class="human"><span class="av" role="img" aria-label="Foto de Abi"></span><span class="human-copy">Te responde <b>Abi, nuestra asesora</b>, por WhatsApp.</span></div>'
        );
    }

    function fnShowQuestion(i) {
        const q = FN_QUESTIONS[i];
        fnBarShow(true);
        // Las operativas ocupan los pasos 1..5; las de perfil van después de la abierta (paso 6).
        fnSetBar((i < FN_OP_COUNT) ? i + 1 : i + 2);
        const saved = fnState.answers[q.key];
        const opts = q.opts.map(function (o, k) {
            const sel = (saved && saved.t === o.t) ? ' sel' : '';
            return '<button class="opt' + sel + '" data-opt="' + k + '"><span class="dot"></span><span>' + o.t + '</span></button>';
        }).join('');
        fnEl(
            '<div class="step">Pregunta ' + (i + 1) + ' de ' + FN_QUESTIONS.length + '</div>' +
            '<h2>' + q.q + '</h2>' +
            '<div class="opts">' + opts + '</div>' +
            '<div class="row">' +
                '<button class="btn btn-ghost" data-action="back">← Atrás</button>' +
                '<span class="micro" style="margin:0">Tocá una opción para seguir</span>' +
            '</div>'
        );
    }

    function fnShowOpen() {
        fnBarShow(true);
        fnSetBar(FN_OP_COUNT + 1);
        fnEl(
            '<div class="step">Última, y es la que más nos sirve</div>' +
            '<h2>En tus palabras: ¿cuál sentís que es el mayor freno para facturar el doble sin trabajar el doble?</h2>' +
            '<div class="field"><textarea id="fnOpenTxt" rows="4" placeholder="Escribí lo que se te venga a la cabeza...">' + fnEsc(fnState.open) + '</textarea></div>' +
            '<button class="btn btn-primary full" data-action="afterOpen">Continuar →</button>' +
            '<div class="row" style="justify-content:center"><button class="btn btn-ghost" data-action="afterOpen">Prefiero saltearla</button></div>'
        );
    }

    function fnShowEmail() {
        fnBarShow(true);
        fnSetBar(FN_QUESTIONS.length + 2);
        fnEl(
            '<div class="eyebrow">Casi listo</div>' +
            '<h2>Dejanos tu mail y mirá tu resultado</h2>' +
            '<div class="field"><label>Tu nombre</label><input id="fnInNombre" type="text" placeholder="Nombre" value="' + fnEsc(fnState.lead.nombre) + '"></div>' +
            '<div class="field"><label>Tu email</label><input id="fnInEmail" type="email" placeholder="vos@tunegocio.com" value="' + fnEsc(fnState.lead.email) + '"><div class="err" id="fnEmailErr">Poné un email válido para ver tu resultado.</div></div>' +
            '<div class="magnet">🎁 <span>Vas a ver tu <b>diagnóstico completo al instante</b> —tu nivel de dependencia y el plan recomendado— y te llevás gratis la guía <b>"Los 3 cuellos de botella de tu negocio"</b>.</span></div>' +
            '<button class="btn btn-primary full" style="margin-top:16px" data-action="submitEmail">Ver mi resultado →</button>' +
            '<div class="micro center">No te vamos a llenar de spam. Tus datos quedan con nosotros.</div>'
        );
    }

    function fnShowProcessing() {
        fnBarShow(false);
        fnSetBar(FN_TOTAL);
        fnEl('<div class="center" style="padding:26px 0"><div class="spin"></div><h2 style="margin-top:22px">Analizando tus respuestas...</h2><p class="lead center" style="margin:0">Armando tu diagnóstico y tu plan.</p></div>');
        setTimeout(fnShowResult, 1300);
    }

    function fnScore() {
        const keys = ['vacaciones', 'incendios', 'onboarding', 'procesos', 'numeros'];
        let s = 0;
        keys.forEach(function (k) { if (fnState.answers[k]) s += fnState.answers[k].w; });
        return Math.round((s / 10) * 100);
    }

    function fnBand(p) {
        if (p >= 67) return { label: 'ALTA', color: '#E5484D', tint: '#FCE9EA', head: 'Tu negocio depende demasiado de vos.' };
        if (p >= 34) return { label: 'MEDIA', color: '#E0A422', tint: '#FBF1DC', head: 'Tu negocio todavía depende bastante de vos.' };
        return { label: 'BAJA', color: '#2FB37A', tint: '#E4F6EE', head: 'Vas bien: tu negocio ya casi no depende de vos.' };
    }

    function fnRecommend(p) {
        const eq = fnState.answers.equipo ? fnState.answers.equipo.t : '';
        if (p >= 67) return (eq === 'Más de 10') ? FN_PROG.MAR : FN_PROG.PAC;
        if (p >= 34) return FN_PROG.MAR;
        return FN_PROG.CDE;
    }

    // Envía el lead al endpoint + dispara el evento Lead del píxel. No bloquea el resultado si falla.
    function fnSendLead() {
        if (fnState.leadSent) return;
        fnState.leadSent = true;

        const p = fnScore();
        const b = fnBand(p);
        const prog = fnRecommend(p);
        const a = fnState.answers;

        // 1) Evento Lead del píxel de Meta (arregla el tracking que nunca disparaba).
        if (typeof fbq === 'function') {
            try {
                const email = (fnState.lead.email || '').trim().toLowerCase();
                const firstName = (fnState.lead.nombre || '').trim().toLowerCase().split(' ')[0];
                fbq('init', '2089699688631959', { em: email, fn: firstName }); // Advanced Matching
                fbq('track', 'Lead', {
                    value: p,
                    currency: 'USD',
                    content_name: 'Diagnóstico de Dependencia Operativa',
                    predicted_plan: prog.code,
                    dependencia_level: b.label
                });
            } catch (err) { console.error('Meta Pixel Lead Error:', err); }
        }

        // 2) Enviar el lead al endpoint (CRM / Sheets / mail).
        try {
            const fd = new FormData();
            fd.set('_subject', 'Nuevo Diagnóstico Fluir Negocios');
            fd.set('Nombre', fnState.lead.nombre || '');
            fd.set('Email', fnState.lead.email || '');
            fd.set('Sector', a.sector ? a.sector.t : '');
            fd.set('Equipo', a.equipo ? a.equipo.t : '');
            fd.set('Dependencia (%)', String(p));
            fd.set('Nivel de dependencia', b.label);
            fd.set('Programa recomendado', prog.code + ' — ' + prog.name);
            fd.set('Mayor freno (texto libre)', fnState.open || '(sin respuesta)');
            FN_QUESTIONS.forEach(function (q) {
                if (!q.meta && a[q.key]) fd.set('R: ' + q.q, a[q.key].t);
            });
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (utm) {
                try { const v = sessionStorage.getItem('fn_' + utm); if (v) fd.set(utm, v); } catch (e) {}
            });
            fetch(FN_LEAD_ENDPOINT, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
                .catch(function () { /* no bloquear el resultado si falla */ });
        } catch (err) { console.error('Lead submit error:', err); }
    }

    function fnShowResult() {
        const p = fnScore();
        const b = fnBand(p);
        const prog = fnRecommend(p);
        const nombre = fnState.lead.nombre ? (', ' + fnEsc(fnState.lead.nombre)) : '';
        const waText = encodeURIComponent('Hola Abi! Hice el diagnóstico: mi dependencia operativa dio ' + p + '% (' + b.label + ') y me recomendó el ' + prog.code + '. Quiero agendar la sesión de 45 minutos.');
        const C = b.color;

        fnEl(
            '<div class="center"><div class="eyebrow">Tu diagnóstico' + nombre + '</div>' +
            '<div class="gauge">' +
                '<svg width="200" height="200" viewBox="0 0 200 200">' +
                    '<circle cx="100" cy="100" r="86" fill="none" stroke="#EAF0F7" stroke-width="18"/>' +
                    '<circle id="fnRing" cx="100" cy="100" r="86" fill="none" stroke="' + C + '" stroke-width="18" stroke-linecap="round" stroke-dasharray="540.4" stroke-dashoffset="540.4"/>' +
                '</svg>' +
                '<div class="num"><b id="fnPnum" style="color:' + C + '">0</b><span>de dependencia</span></div>' +
            '</div>' +
            '<div class="level" style="color:' + C + ';background:' + b.tint + '">Dependencia ' + b.label + '</div>' +
            '<h2 style="margin:10px 0 4px">' + b.head + '</h2>' +
            '<p class="lead center">Según tus respuestas, este es el camino más corto para que el negocio deje de girar alrededor tuyo:</p></div>' +

            '<div class="prog"><div class="code">' + prog.code + ' · RECOMENDADO PARA VOS</div><h3>' + prog.name + '</h3><p>' + prog.desc + '</p></div>' +

            '<a class="btn btn-wa" href="' + FN_WA + waText + '" target="_blank" rel="noopener">📅 Agendá tu sesión de 45 min gratis con Abi</a>' +
            '<div class="row" style="gap:10px;margin-top:10px">' +
                '<a class="btn btn-out" href="' + FN_PDF + '" target="_blank" rel="noopener">Descargar la guía</a>' +
                '<a class="btn btn-out" href="' + prog.link + '" target="_blank" rel="noopener">Ver el programa</a>' +
            '</div>' +

            '<div class="socip"><div><b>+100</b><span>negocios acompañados</span></div><div><b>+10</b><span>años de trayectoria</span></div><div><b>2-30</b><span>empleados, como vos</span></div></div>' +
            '<div class="quote">"Pasamos de que todo dependiera de nosotros a tener un encargado que decide solo. Franco hoy cierra cuentas mayoristas en vez de estar en el mostrador." — Distribuidora López y López, Mar del Plata</div>' +
            '<div class="row" style="justify-content:center;margin-top:14px"><button class="btn btn-ghost" data-action="restart">↺ Volver a hacer el diagnóstico</button></div>'
        );

        // Animar el anillo + contador
        const off = 540.4 - (540.4 * (p / 100));
        requestAnimationFrame(function () {
            const r = document.getElementById('fnRing');
            if (r) { r.style.transition = 'stroke-dashoffset 1.1s ease'; r.style.strokeDashoffset = off; }
        });
        const num = document.getElementById('fnPnum');
        let cur = 0;
        const t = setInterval(function () {
            cur += Math.max(1, Math.round(p / 28));
            if (cur >= p) { cur = p; clearInterval(t); }
            if (num) num.textContent = cur;
        }, 32);
    }

    function fnNext() {
        // Tras la última operativa va la pregunta abierta; después siguen las de perfil.
        if (fnState.qi === FN_OP_COUNT - 1 && !fnState.openShown) { fnShowOpen(); return; }
        if (fnState.qi < FN_QUESTIONS.length - 1) { fnState.qi++; fnShowQuestion(fnState.qi); }
        else { fnShowEmail(); }
    }
    function fnBack() {
        if (fnState.qi === 0) { fnShowWelcome(); return; }
        // Volver desde la primera de perfil reabre la pregunta abierta.
        if (fnState.qi === FN_OP_COUNT && fnState.openShown) { fnState.openShown = false; fnShowOpen(); return; }
        fnState.qi--;
        fnShowQuestion(fnState.qi);
    }

    // Reset + bienvenida. La llama openDiagnosticModal() en cada apertura (arranca limpio).
    function fnStartDiagnostico() {
        fnState = { qi: 0, answers: {}, open: '', openShown: false, lead: { nombre: '', email: '' }, leadSent: false };
        fnShowWelcome();
    }

    if (fnStage) {
        fnStage.addEventListener('click', function (e) {
            const optBtn = e.target.closest('.opt');
            const actBtn = e.target.closest('[data-action]');

            if (optBtn) {
                const q = FN_QUESTIONS[fnState.qi];
                const k = parseInt(optBtn.getAttribute('data-opt'), 10);
                fnState.answers[q.key] = q.opts[k];
                const all = fnStage.querySelectorAll('.opt');
                for (let j = 0; j < all.length; j++) all[j].classList.remove('sel');
                optBtn.classList.add('sel');
                setTimeout(fnNext, 280);
                return;
            }
            if (!actBtn) return;
            const action = actBtn.getAttribute('data-action');
            if (action === 'start') { fnState.qi = 0; fnShowQuestion(0); }
            else if (action === 'back') { fnBack(); }
            else if (action === 'afterOpen') {
                const tx = document.getElementById('fnOpenTxt');
                fnState.open = tx ? tx.value : '';
                fnState.openShown = true;
                fnState.qi = FN_OP_COUNT; // pasar a la primera pregunta de perfil (sector)
                fnShowQuestion(fnState.qi);
            }
            else if (action === 'submitEmail') {
                const n = document.getElementById('fnInNombre');
                const em = document.getElementById('fnInEmail');
                const ev = document.getElementById('fnEmailErr');
                const okEmail = em && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim());
                if (!okEmail) { if (ev) ev.style.display = 'block'; if (em) em.focus(); return; }
                fnState.lead.nombre = n ? n.value.trim() : '';
                fnState.lead.email = em.value.trim();
                fnSendLead();          // CRM/Formspree + evento Lead del píxel (antes de mostrar el resultado)
                fnShowProcessing();
            }
            else if (action === 'restart') { fnStartDiagnostico(); }
        });

        fnShowWelcome(); // estado inicial
    }
});
