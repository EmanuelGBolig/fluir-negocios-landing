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


  /* ---------- Vidrio líquido v2 ---------- */
  (function () {
    var reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* 1) Toque: crece, se ilumina desde el dedo y se estira un poco si arrastrás */
    var activo = null, x0 = 0, y0 = 0;
    function soltar() {
      if (!activo) return;
      activo.classList.remove('fn-presionado');
      activo.style.transform = '';
      activo = null;
    }
    document.addEventListener('pointerdown', function (e) {
      var el = e.target.closest && e.target.closest('.boton, .flecha, .video .play');
      if (!el || reducir) return;
      activo = el; x0 = e.clientX; y0 = e.clientY;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100) + '%');
      el.classList.add('fn-presionado');
      el.style.transform = 'scale(1.07)';
    }, { passive: true });
    document.addEventListener('pointermove', function (e) {
      if (!activo) return;
      var dx = Math.max(-40, Math.min(40, e.clientX - x0)), dy = Math.max(-30, Math.min(30, e.clientY - y0));
      var sx = 1.07 + Math.abs(dx) / 420 - Math.abs(dy) / 900, sy = 1.07 + Math.abs(dy) / 420 - Math.abs(dx) / 900;
      activo.style.transform = 'translate(' + (dx * 0.22).toFixed(1) + 'px,' + (dy * 0.22).toFixed(1) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
      var r = activo.getBoundingClientRect();
      activo.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100) + '%');
      activo.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100) + '%');
    }, { passive: true });
    ['pointerup', 'pointercancel', 'blur'].forEach(function (ev) { window.addEventListener(ev, soltar, { passive: true }); });

    /* 2) Brillo que sigue la inclinación del teléfono (Android; iOS pide permiso y no lo forzamos) */
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null) return;
      var g = Math.max(-30, Math.min(30, e.gamma));
      document.documentElement.style.setProperty('--inclina', (50 + g * 1.4).toFixed(0) + '%');
    }, { passive: true });

    /* 3) La barra inferior cambia de tinte según el fondo, igual que la de arriba */
    var dock = document.querySelector('.dock');
    var zonas = [].slice.call(document.querySelectorAll('[data-tono]'));
    function tinteDock() {
      if (!dock) return;
      var y = dock.getBoundingClientRect().top + dock.offsetHeight / 2, tono = 'claro';
      for (var i = 0; i < zonas.length; i++) {
        var r = zonas[i].getBoundingClientRect();
        if (r.top <= y && r.bottom > y) { tono = zonas[i].dataset.tono; break; }
      }
      dock.classList.toggle('claro', tono === 'claro');
    }
    window.addEventListener('scroll', tinteDock, { passive: true });
    window.addEventListener('resize', tinteDock);
    tinteDock();

    /* 4) Lente: los bordes del vidrio curvan lo que tienen detrás, como en iOS 26.
          Solo Chrome y Android soportan un filtro SVG dentro de backdrop-filter;
          en el resto queda el vidrio transparente sin curvatura. */
    var chromium = !!(navigator.userAgentData && navigator.userAgentData.brands &&
      navigator.userAgentData.brands.some(function (b) { return /Chromium/.test(b.brand); }));
    if (!chromium || reducir || matchMedia('(prefers-reduced-transparency: reduce)').matches) return;
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    document.body.appendChild(svg);
    var n = 0;

    function mapa(w, h, radio, bisel) {
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
      var cx = w / 2, cy = h / 2, hx = w / 2 - radio, hy = h / 2 - radio;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var px = Math.abs(x + .5 - cx) - hx, py = Math.abs(y + .5 - cy) - hy;
          var dist, nx, ny;
          if (px > 0 && py > 0) { var l = Math.sqrt(px * px + py * py); dist = radio - l; nx = px / l; ny = py / l; }
          else if (px > py) { dist = radio - px; nx = 1; ny = 0; }
          else { dist = radio - py; nx = 0; ny = 1; }
          nx *= (x + .5 < cx ? -1 : 1); ny *= (y + .5 < cy ? -1 : 1);
          var k = (y * w + x) * 4, f = 0;
          if (dist < bisel && dist > -1) { var t = 1 - Math.max(0, dist) / bisel; f = t * t; }
          d[k] = 128 + nx * f * 127; d[k + 1] = 128 + ny * f * 127; d[k + 2] = 128; d[k + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      return c.toDataURL();
    }

    function lente(el) {
      var r = el.getBoundingClientRect(), w = Math.round(r.width), h = Math.round(r.height);
      if (w < 20 || h < 20) return;
      if (el._lente && Math.abs(el._lente.w - w) < 3 && Math.abs(el._lente.h - h) < 3) return;
      var radio = Math.min(h / 2, parseFloat(getComputedStyle(el).borderTopLeftRadius) || h / 2);
      var id = el._lente ? el._lente.id : 'fn-lente-' + (++n);
      var viejo = document.getElementById(id); if (viejo) viejo.remove();
      var f = document.createElementNS(NS, 'filter');
      f.setAttribute('id', id); f.setAttribute('x', '0'); f.setAttribute('y', '0');
      f.setAttribute('width', w); f.setAttribute('height', h);
      f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse');
      f.setAttribute('color-interpolation-filters', 'sRGB');
      var im = document.createElementNS(NS, 'feImage');
      im.setAttribute('href', mapa(w, h, radio, Math.min(18, h * 0.42)));
      im.setAttribute('x', '0'); im.setAttribute('y', '0'); im.setAttribute('width', w); im.setAttribute('height', h);
      im.setAttribute('result', 'mapa'); im.setAttribute('preserveAspectRatio', 'none');
      var dm = document.createElementNS(NS, 'feDisplacementMap');
      dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'mapa');
      dm.setAttribute('scale', String(-Math.min(46, h * 0.8)));
      dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
      f.appendChild(im); f.appendChild(dm); svg.appendChild(f);
      el._lente = { id: id, w: w, h: h };
      var claro = el.classList.contains('claro');
      el.style.backdropFilter = 'url(#' + id + ') blur(' + (claro ? 14 : 7) + 'px) saturate(190%) brightness(' + (claro ? 1.04 : 1.06) + ')';
    }

    var objetivos = [].slice.call(document.querySelectorAll('.barra, .dock, .boton.vidrio, .portada .ficha, .logos, .contacto .vidrio'));
    var pendiente = null;
    var ro = new ResizeObserver(function (entradas) {
      clearTimeout(pendiente);
      pendiente = setTimeout(function () { entradas.forEach(function (en) { lente(en.target); }); objetivos.forEach(lente); }, 160);
    });
    objetivos.forEach(function (el) { lente(el); ro.observe(el); });
    /* La barra de arriba y la de abajo cambian de tinte: el blur del lente se ajusta */
    var mo = new MutationObserver(function (ms) {
      ms.forEach(function (m) { var el = m.target; if (el._lente) { el._lente.w = 0; lente(el); } });
    });
    [document.querySelector('.barra'), dock].forEach(function (el) { if (el) mo.observe(el, { attributes: true, attributeFilter: ['class'] }); });
  })();

})();
