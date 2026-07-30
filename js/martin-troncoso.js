/**
 * MARTÍN TRONCOSO — NEGOCIOS EXITOSOS
 * Interactive Features & Accessibility JavaScript
 */

// Marca temprana: habilita estilos que dependen de JS (reveals, entrada del hero).
// Si el JS no carga, el contenido se muestra completo sin animaciones.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;

  // 1. Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({
      attrs: {
        'stroke-width': 2.3
      }
    });
  }

  // 1b. Lenis Smooth Scroll (solo sin prefers-reduced-motion)
  let lenis = null;
  if (!REDUCED_MOTION && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    // Lenis maneja el suavizado: desactivar el smooth nativo para evitar doble easing
    document.documentElement.style.scrollBehavior = 'auto';

    const lenisRaf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    };
    requestAnimationFrame(lenisRaf);
  }

  // 2. Sticky Header Compaction on Scroll
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // 3. Mobile Hamburger Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. FAQ Accordion (Accessible with ARIA & Keyboard Support)
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other accordion items for clean accordion UX
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        trigger.setAttribute('aria-expanded', !isActive);
      });
    }
  });

  // 5. Contact Form Client-Side Validation & Asynchronous Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('form-nombre')?.value.trim();
      const negocio = document.getElementById('form-negocio')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const whatsapp = document.getElementById('form-whatsapp')?.value.trim();
      const mensaje = document.getElementById('form-mensaje')?.value.trim();

      // Basic Client Validation
      if (!name || !email || !whatsapp || !mensaje) {
        showFormStatus('Por favor, completá todos los campos requeridos.', 'error');
        return;
      }

      const endpoint = contactForm.getAttribute('action');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
        }

        if (!endpoint || endpoint === '#') {
          // Endpoint no configurado: no simular éxito, informar y ofrecer WhatsApp
          showFormStatus('No pudimos enviar tu mensaje por esta vía. Escribinos directo por WhatsApp: +54 9 223 529-5052.', 'error');
          return;
        }

        // Envío real a Formspree: éxito SOLO con response.ok
        const formData = new FormData(contactForm);
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showFormStatus('¡Mensaje recibido con éxito! Martín te responderá a la brevedad.', 'success');
          contactForm.reset();
        } else {
          // Error del servidor (422, 429, 500...): NO borrar el formulario
          showFormStatus('No pudimos enviar tu mensaje. Tus datos siguen acá: probá de nuevo o escribinos por WhatsApp: +54 9 223 529-5052.', 'error');
        }
      } catch (err) {
        // Falla de red u otro error: NO borrar el formulario, NO fingir éxito
        showFormStatus('No pudimos enviar tu mensaje (revisá tu conexión). Tus datos siguen acá: probá de nuevo o escribinos por WhatsApp: +54 9 223 529-5052.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Enviar mensaje <i data-lucide="send" class="gold-icon" style="color:var(--noche); width:18px; height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    });
  }

  function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';

    setTimeout(() => {
      if (type === 'success') {
        formStatus.style.display = 'none';
      }
    }, 6000);
  }

  // 6. Scroll to top button functionality
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: REDUCED_MOTION ? 'auto' : 'smooth'
        });
      }
    });
  }

  // 6b. Anclajes internos integrados con Lenis (nav, footer, CTAs locales)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash.length <= 1) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -90 });
      } else {
        target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
      }
    });
  });

  // 7. Dynamic Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 8. Scroll Reveal System (IntersectionObserver local, patrón portado del proyecto)
  const revealObserver = ('IntersectionObserver' in window && !REDUCED_MOTION)
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // Stagger por hijos: delay incremental y limpieza posterior
        if (el.classList.contains('reveal-stagger')) {
          const children = Array.from(el.children);
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.09}s`;
          });
          const maxDelay = children.length * 90 + 750;
          setTimeout(() => {
            children.forEach(child => { child.style.transitionDelay = ''; });
          }, maxDelay);
        }

        el.classList.add('reveal-visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    : null;

  if (revealObserver) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: mostrar todo sin animación (sin IO o reduced-motion)
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('reveal-visible'));
  }

  // 9. Contadores animados de stats (+10, +100) con easing ease-out
  const statNumbers = document.querySelectorAll('.stat-number[data-count-target]');
  if (statNumbers.length && 'IntersectionObserver' in window && !REDUCED_MOTION) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const el = entry.target;
        const target = parseFloat(el.dataset.countTarget);
        const prefix = el.dataset.countPrefix || '';
        const suffix = el.dataset.countSuffix || '';
        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    statNumbers.forEach(el => countObserver.observe(el));
  }

  // 10. Tilt 3D de la foto del hero siguiendo el mouse (rAF + lerp, solo desktop)
  const heroSection = document.querySelector('.hero-section');
  const heroCard = document.querySelector('.hero-image-card');
  if (heroSection && heroCard && FINE_POINTER && !REDUCED_MOTION) {
    const MAX_TILT = 5; // grados máximos (±5°)
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    heroSection.addEventListener('pointermove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * MAX_TILT * 2;   // rotateY
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * -MAX_TILT * 2;  // rotateX
    });
    heroSection.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
    });

    const tiltTick = () => {
      currentX += (targetX - currentX) * 0.08; // lerp = suavidad
      currentY += (targetY - currentY) * 0.08;
      heroCard.style.transform = `rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg) translateZ(0)`;
      requestAnimationFrame(tiltTick);
    };
    requestAnimationFrame(tiltTick);
  }

  // 11. Spotlight dorado + tilt magnético en .brand-card (custom properties, solo desktop)
  if (FINE_POINTER && !REDUCED_MOTION) {
    const MAX_CARD_TILT = 3; // grados máximos (±3°)
    document.querySelectorAll('.brand-card').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        // No competir con el reveal de entrada
        const staggerParent = card.closest('.reveal-stagger');
        if (staggerParent && !staggerParent.classList.contains('reveal-visible')) return;

        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        card.style.setProperty('--ry', `${((relX - 0.5) * MAX_CARD_TILT * 2).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((relY - 0.5) * -MAX_CARD_TILT * 2).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // 12. Quote banner: reveal palabra por palabra ligado al scroll (scrub)
  // Divide la cita en spans .qword y cada una pasa de opacidad 0.15 a 1
  // progresivamente según la posición de la sección en el viewport.
  const quoteEl = document.querySelector('.quote-banner-text');
  const quoteSection = document.querySelector('.quote-banner-section');
  if (quoteEl && quoteSection && !REDUCED_MOTION) {
    const words = quoteEl.textContent.trim().split(/\s+/);
    quoteEl.textContent = '';
    const wordSpans = words.map(word => {
      const span = document.createElement('span');
      span.className = 'qword';
      span.textContent = word;
      quoteEl.appendChild(span);
      quoteEl.appendChild(document.createTextNode(' '));
      return span;
    });
    const wordCount = wordSpans.length;

    let quoteTicking = false;
    const updateQuote = () => {
      quoteTicking = false;
      const rect = quoteSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 cuando la sección entra por abajo; 1 cuando su top llega al 30% del viewport
      const progress = Math.min(Math.max((vh * 0.85 - rect.top) / (vh * 0.55), 0), 1);
      wordSpans.forEach((span, i) => {
        const wordProgress = Math.min(Math.max(progress * (wordCount + 2) - i, 0), 1);
        span.style.opacity = (0.15 + 0.85 * wordProgress).toFixed(3);
        span.style.filter = wordProgress >= 1 ? 'none' : `blur(${(4 * (1 - wordProgress)).toFixed(1)}px)`;
      });
    };
    const onQuoteScroll = () => {
      if (!quoteTicking) {
        quoteTicking = true;
        requestAnimationFrame(updateQuote);
      }
    };
    window.addEventListener('scroll', onQuoteScroll, { passive: true });
    updateQuote(); // estado inicial (p. ej. si se carga con la sección ya visible)
  }

  // 13. Sobre mí: foto de grayscale a color + parallax sutil (metáfora "de dueño a líder")
  const aboutSection = document.getElementById('sobre-mi');
  const aboutImg = aboutSection ? aboutSection.querySelector('.about-photo-frame img') : null;
  if (aboutSection && aboutImg && !REDUCED_MOTION) {
    let aboutTicking = false;
    const updateAbout = () => {
      aboutTicking = false;
      const rect = aboutSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 con la sección entrando por abajo; 1 cuando su top llega al 20% del viewport
      const progress = Math.min(Math.max((vh * 0.85 - rect.top) / (vh * 0.65), 0), 1);
      aboutImg.style.setProperty('--gray', (1 - progress).toFixed(3));
      aboutImg.style.transform = `translateY(${((progress - 0.5) * 28).toFixed(1)}px)`;
    };
    const onAboutScroll = () => {
      if (!aboutTicking) {
        aboutTicking = true;
        requestAnimationFrame(updateAbout);
      }
    };
    window.addEventListener('scroll', onAboutScroll, { passive: true });
    updateAbout();
  }

  // 14. Método: línea de tiempo vertical que se dibuja con el scroll + nodos que se iluminan
  const methodTimeline = document.querySelector('.method-timeline');
  if (methodTimeline && !REDUCED_MOTION) {
    methodTimeline.classList.add('tl-active');
    const methodSteps = Array.from(methodTimeline.querySelectorAll('.method-step'));
    // Ratio de cada nodo dentro del timeline (cacheado; se recalcula en resize).
    // Desktop (>=993px): stepper horizontal → eje X. Mobile/tablet: vertical → eje Y.
    let nodeRatios = [];
    const cacheNodeRatios = () => {
      const horizontal = window.matchMedia('(min-width: 993px)').matches;
      if (horizontal) {
        const total = methodTimeline.offsetWidth || 1;
        nodeRatios = methodSteps.map(step => (step.offsetLeft + step.offsetWidth / 2) / total);
      } else {
        const total = methodTimeline.offsetHeight || 1;
        nodeRatios = methodSteps.map(step => (step.offsetTop + 42) / total);
      }
    };
    cacheNodeRatios();
    window.addEventListener('resize', cacheNodeRatios, { passive: true });
    window.addEventListener('load', cacheNodeRatios);

    let tlTicking = false;
    const updateTimeline = () => {
      tlTicking = false;
      const rect = methodTimeline.getBoundingClientRect();
      const vh = window.innerHeight;
      // La línea se dibuja mientras el timeline atraviesa el viewport
      const progress = Math.min(Math.max((vh * 0.75 - rect.top) / rect.height, 0), 1);
      methodTimeline.style.setProperty('--tl-progress', progress.toFixed(4));
      methodSteps.forEach((step, i) => {
        step.classList.toggle('lit', progress >= nodeRatios[i]);
      });
    };
    const onTimelineScroll = () => {
      if (!tlTicking) {
        tlTicking = true;
        requestAnimationFrame(updateTimeline);
      }
    };
    window.addEventListener('scroll', onTimelineScroll, { passive: true });
    updateTimeline();
  }

  // 15. Botones: data-text para el text-swap hover (se genera desde el span,
  //     así no hace falta tocar el HTML de cada botón)
  document.querySelectorAll('.btn-pill').forEach(btn => {
    const label = btn.querySelector('span');
    if (label && !btn.dataset.text) {
      btn.dataset.text = label.textContent.trim();
    }
  });

  // 16. Botón magnético: el CTA principal del hero se acerca sutilmente al cursor
  //     (mismo patrón lerp/rAF que el tilt 3D, solo desktop con puntero fino)
  const heroPrimaryBtn = document.querySelector('.hero-ctas .btn-primary');
  if (heroPrimaryBtn && FINE_POINTER && !REDUCED_MOTION) {
    const MAGNET_RANGE = 8; // px máximos de desplazamiento
    let mTargetX = 0, mTargetY = 0, mCurX = 0, mCurY = 0;

    heroPrimaryBtn.addEventListener('pointermove', (e) => {
      const rect = heroPrimaryBtn.getBoundingClientRect();
      mTargetX = ((e.clientX - rect.left) / rect.width - 0.5) * MAGNET_RANGE * 2;
      mTargetY = ((e.clientY - rect.top) / rect.height - 0.5) * MAGNET_RANGE * 1.4;
    });
    heroPrimaryBtn.addEventListener('pointerleave', () => {
      mTargetX = 0;
      mTargetY = 0;
    });

    const magnetTick = () => {
      mCurX += (mTargetX - mCurX) * 0.15;
      mCurY += (mTargetY - mCurY) * 0.15;
      heroPrimaryBtn.style.transform = `translate(${mCurX.toFixed(2)}px, ${mCurY.toFixed(2)}px)`;
      requestAnimationFrame(magnetTick);
    };
    requestAnimationFrame(magnetTick);
  }
});
