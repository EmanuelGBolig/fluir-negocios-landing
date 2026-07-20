/**
 * MARTÍN TRONCOSO — NEGOCIOS EXITOSOS
 * Interactive Features & Accessibility JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({
      attrs: {
        'stroke-width': 2.3
      }
    });
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

      const endpoint = contactForm.getAttribute('action') || '{{FORM_ENDPOINT}}';
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
        }

        // Check if endpoint is still placeholder or valid Formspree / endpoint
        if (endpoint.includes('{{FORM_ENDPOINT}}') || endpoint === '#') {
          // Simulated success response for development / demo mode
          await new Promise(resolve => setTimeout(resolve, 800));
          showFormStatus('¡Mensaje enviado con éxito! Martín te responderá por WhatsApp o email a la brevedad.', 'success');
          contactForm.reset();
        } else {
          // Real fetch POST
          const formData = new FormData(contactForm);
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            showFormStatus('¡Mensaje recibido! Nos pondremos en contacto con vos a la brevedad sin compromiso.', 'success');
            contactForm.reset();
          } else {
            throw new Error('Server response error');
          }
        }
      } catch (err) {
        showFormStatus('Ocurrió un error al enviar el mensaje. Por favor, intentá escribirnos directamente por WhatsApp.', 'error');
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. Dynamic Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
