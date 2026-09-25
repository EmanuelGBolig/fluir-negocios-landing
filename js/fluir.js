/* Fluir Negocios: comportamiento compartido de las páginas internas.
   Barra flotante, brillo del vidrio, UTM, evento Contact del píxel y videos. */
(function () {
  /* Barra: se achica al bajar y cambia de tinte según lo que tiene abajo */
  var barra = document.getElementById('barra');
  var zonas = [].slice.call(document.querySelectorAll('[data-tono]'));
  function tonoEn(y) {
    for (var i = 0; i < zonas.length; i++) {
      var r = zonas[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) return zonas[i].dataset.tono;
    }
    return 'claro';
  }
  function actualizar() {
    if (!barra) return;
    barra.classList.toggle('claro', tonoEn(barra.getBoundingClientRect().bottom - 8) === 'claro');
    barra.classList.toggle('compacta', window.scrollY > 200);
  }
  window.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);
  actualizar();

  /* Brillo del vidrio que sigue al puntero */
  document.addEventListener('pointermove', function (e) {
    var el = e.target.closest && e.target.closest('.vidrio');
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--bx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
  }, { passive: true });

  /* UTM: se guardan para los leads */
  try {
    var qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (u) {
      var v = qs.get(u); if (v) sessionStorage.setItem('fn_' + u, v);
    });
  } catch (e) {}

  /* Evento Contact del píxel en cualquier clic a WhatsApp */
  document.addEventListener('click', function (e) {
    var wa = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (wa && typeof fbq === 'function') { try { fbq('track', 'Contact', { content_name: 'WhatsApp' }); } catch (err) {} }
  }, true);

  /* Videos: uno a la vez; la cita se esconde mientras suena */
  var figs = [].slice.call(document.querySelectorAll('.video'));
  figs.forEach(function (fig) {
    var v = fig.querySelector('video'), b = fig.querySelector('.play'), cap = fig.querySelector('figcaption');
    if (!v || !b) return;
    b.addEventListener('click', function () {
      figs.forEach(function (o) { var ov = o.querySelector('video'); if (ov && ov !== v) ov.pause(); });
      v.controls = true; v.play(); b.hidden = true; if (cap) cap.hidden = true;
    });
    v.addEventListener('pause', function () { b.hidden = false; if (cap) cap.hidden = false; v.controls = false; });
  });

  /* Aparición al bajar: solo a lo que todavía no se ve, así nada queda
     escondido si el script no corre o si la página se abre a mitad de camino */
  (function () {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sel = '.bloque h2, .cabeza p, .lista > div, .oferta, .tramo > div, .comparar > div, .datos > div, .video, ' +
              '.plan, .faq details, .preguntas, .resultado, .guia, .cierre h2, .cierre .bajada, .equipo, .contacto a, .kit';
    var els = [].slice.call(document.querySelectorAll(sel)).filter(function (el) {
      return el.getBoundingClientRect().top > window.innerHeight * 0.92;
    });
    els.forEach(function (el) {
      var hermanos = [].slice.call(el.parentNode.children).filter(function (h) { return els.indexOf(h) > -1; });
      el.style.transitionDelay = (Math.min(hermanos.indexOf(el), 5) * 80) + 'ms';
      el.classList.add('fn-revela');
    });
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('fn-visto');
        io.unobserve(en.target);
        setTimeout(function () { en.target.style.transitionDelay = ''; }, 1200);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* Barra inferior del teléfono: se achica al bajar y vuelve al subir */
  (function () {
    var dock = document.querySelector('.dock');
    if (!dock) return;
    var ultimo = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > ultimo + 8 && y > 320) dock.classList.add('mini');
      else if (y < ultimo - 8 || y < 120) dock.classList.remove('mini');
      ultimo = y;
    }, { passive: true });
  })();

})();
