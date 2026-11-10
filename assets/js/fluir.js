/* Fluir Negocios · comportamiento de la home y de /diagnostico
   - Arma los links de WhatsApp con el mensaje base y el código del anuncio (utm_content).
   - Mide: Contact en cualquier clic a WhatsApp; Schedule (content_category = página-botón)
     y solicitar_diagnostico (GA4) en cada botón que pide el diagnóstico.
   - Titular según el anuncio en /diagnostico (?h= o la palabra dentro de utm_content).
   - Barra inferior de un solo botón, videos de a uno, guía gratis (Lead) y el test de 1 minuto. */
(function () {
  'use strict';

  var WA_NUMERO = '5492235295052';
  var cuerpo = document.body;
  var PAGINA = cuerpo.getAttribute('data-pagina') || 'home';
  var MENSAJE = cuerpo.getAttribute('data-wa-mensaje') || 'Hola, quiero mi diagnóstico.';
  var reducir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  function todos(sel, raiz) { return [].slice.call((raiz || document).querySelectorAll(sel)); }

  /* ---------- UTM: se guardan para los leads y para el código del mensaje ---------- */
  var qs;
  try { qs = new URLSearchParams(location.search); } catch (e) { qs = { get: function () { return null; } }; }
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (u) {
    var v = qs.get(u);
    if (v) { try { sessionStorage.setItem('fn_' + u, v); } catch (e) {} }
  });
  function utm(u) {
    var v = qs.get(u);
    if (!v) { try { v = sessionStorage.getItem('fn_' + u); } catch (e) {} }
    return v || '';
  }

  /* ---------- WhatsApp ---------- */
  function conCodigo(texto) {
    var codigo = utm('utm_content');
    return codigo ? texto + ' (código: ' + codigo + ')' : texto;
  }
  function waUrl(texto) {
    return 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(conCodigo(texto));
  }
  todos('a[data-wa]').forEach(function (a) { a.href = waUrl(MENSAJE); });

  function track(evento, datos) {
    if (typeof window.fbq === 'function') { try { window.fbq('track', evento, datos); } catch (e) {} }
  }
  function ga(evento, datos) {
    if (typeof window.gtag === 'function') { try { window.gtag('event', evento, datos); } catch (e) {} }
  }

  /* Contact en cualquier clic a WhatsApp. Schedule y solicitar_diagnostico en los botones del diagnóstico. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    track('Contact', { content_name: 'WhatsApp' });
    var cta = a.getAttribute('data-cta');
    if (cta) {
      var categoria = PAGINA + '-' + cta;
      track('Schedule', { content_category: categoria });
      ga('solicitar_diagnostico', { pagina: PAGINA, boton: cta, content_category: categoria });
    }
  }, true);

  /* ---------- Titular según el anuncio ---------- */
  (function () {
    var cont = document.querySelector('[data-variantes]');
    if (!cont) return;
    var permitidas = ['plata', 'equipo', 'grupo'];
    var h = (qs.get('h') || '').toLowerCase();
    if (permitidas.indexOf(h) < 0) {
      var c = (qs.get('utm_content') || '').toLowerCase();
      h = permitidas.filter(function (p) { return c.indexOf(p) > -1; })[0] || '';
    }
    if (!h) return;
    /* data-variante admite varias palabras: "base plata" se ve sin parámetro y con ?h=plata */
    todos('[data-variante]', cont).forEach(function (el) {
      el.hidden = el.getAttribute('data-variante').split(' ').indexOf(h) < 0;
    });
    cuerpo.setAttribute('data-h', h);
  })();

  /* ---------- Barra inferior: aparece cuando el botón de la portada ya no se ve ---------- */
  (function () {
    var barra = document.querySelector('.barra-inferior');
    if (!barra || !('IntersectionObserver' in window)) return;
    cuerpo.classList.add('con-barra');
    var ocultan = todos('[data-oculta-barra]');
    var visibles = new Set();
    var foco = false;
    function actualizar() {
      var mostrar = visibles.size === 0 && !foco;
      barra.classList.toggle('visible', mostrar);
      barra.setAttribute('aria-hidden', mostrar ? 'false' : 'true');
      var b = barra.querySelector('a');
      if (b) b.tabIndex = mostrar ? 0 : -1;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) visibles.add(en.target); else visibles.delete(en.target);
      });
      actualizar();
    }, { threshold: 0 });
    ocultan.forEach(function (el) { io.observe(el); });
    /* Con el teclado abierto la barra sube y tapa el campo: se esconde */
    document.addEventListener('focusin', function (e) {
      if (e.target.matches && e.target.matches('input, textarea, select')) { foco = true; actualizar(); }
    });
    document.addEventListener('focusout', function () { foco = false; setTimeout(actualizar, 50); });
    actualizar();
  })();

  /* ---------- Videos: la portada es una imagen liviana; el video carga recién al tocar ---------- */
  var videos = todos('.video');
  videos.forEach(function (fig) {
    var boton = fig.querySelector('.video__play');
    var v = fig.querySelector('video');
    if (!boton || !v) return;
    boton.addEventListener('click', function () {
      videos.forEach(function (otra) {
        var ov = otra.querySelector('video');
        if (ov && ov !== v && !ov.paused) ov.pause();
      });
      if (!v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; }
      v.hidden = false;
      v.controls = true;
      fig.classList.add('sonando');
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
      v.focus();
    });
  });

  /* ---------- Momento 2: el tablero se arma al entrar en pantalla ---------- */
  (function () {
    var anim = todos('.anima');
    if (!anim.length) return;
    if (reducir || !('IntersectionObserver' in window)) { anim.forEach(function (el) { el.classList.add('visto'); }); return; }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('visto');
        io.unobserve(en.target);
      });
    }, { threshold: 0.35 });
    anim.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Guía gratis: lead a Formspree, evento Lead y descarga del PDF (solo home) ---------- */
  (function () {
    var form = $('guia');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl = $('guia-email'), nombreEl = $('guia-nombre'), error = $('guia-error');
      var email = emailEl.value.trim(), nombre = nombreEl.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.hidden = false; emailEl.setAttribute('aria-invalid', 'true'); emailEl.focus(); return;
      }
      error.hidden = true; emailEl.removeAttribute('aria-invalid');
      if (typeof window.fbq === 'function') {
        try {
          window.fbq('init', '2089699688631959', { em: email.toLowerCase(), fn: nombre.toLowerCase().split(' ')[0] });
          window.fbq('track', 'Lead', { content_name: 'Guía 3 Cuellos de Botella' });
        } catch (err) {}
      }
      try {
        var fd = new FormData();
        fd.set('_subject', 'Nueva descarga de guía — Fluir Negocios');
        fd.set('Nombre', nombre);
        fd.set('Email', email);
        fd.set('Origen', 'Descarga guía "Los 3 cuellos de botella"');
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (u) {
          var v = utm(u); if (v) fd.set(u, v);
        });
        fetch('https://formspree.io/f/mredepgv', { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } }).catch(function () {});
      } catch (err) {}
      var a = document.createElement('a');
      a.href = form.getAttribute('data-pdf');
      a.download = 'Guia-3-Cuellos-de-Botella.pdf';
      a.target = '_blank'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      $('guia-form').hidden = true;
      var listo = $('guia-listo');
      listo.hidden = false;
      listo.focus();
    });
  })();

  /* =====================================================================
     Test de 1 minuto: una frase por área.
     Lógica sin cambios respecto del boceto (textos y recomendaciones de js/rueda.js).
     El resultado lee el perfil completo: etapa, combinaciones entre áreas,
     empates y desbalance. No solo el valor más bajo.
     ===================================================================== */
  (function () {
    var form = $('form-rueda');
    if (!form) return;

    var F = 0, O = 1, M = 2, E = 3, A = 4;
    var PIL = [
      { corto: 'Finanzas', q: 'Sé cuánto ganó mi negocio el mes pasado, sin estimarlo.',
        cuello: 'Decidís sin saber cuánto ganás ni dónde se va la plata. Si crecés así, crece el desorden.',
        porque: 'sin números claros, cualquier otra mejora es a ciegas',
        pasos: ['Armá un estado de resultados mensual real, con ingresos, costos y gastos fijos separados.', 'Definí tu sueldo fijo y sacalo de la caja diaria.'] },
      { corto: 'Operaciones', q: 'Los procesos clave están escritos, no en mi memoria.',
        cuello: 'La calidad y los tiempos dependen de que vos estés mirando. Lo que hoy sostiene tu memoria lo tiene que sostener un proceso.',
        porque: 'lo que está escrito se puede delegar',
        pasos: ['Escribí paso a paso los 3 procesos críticos del negocio.', 'Definí un estándar de calidad con un control simple que funcione sin vos.'] },
      { corto: 'Marketing', q: 'Consigo clientes nuevos todos los meses de forma predecible.',
        cuello: 'Los clientes llegan por boca en boca y por la suerte del mes. La facturación sube y baja sin que la controles.',
        porque: 'sin clientes nuevos no hay crecimiento que ordenar',
        pasos: ['Elegí un solo canal para conseguir clientes y sostenelo hasta poder medirlo.', 'Preguntá y anotá de dónde viene cada cliente nuevo.'] },
      { corto: 'Equipo', q: 'Alguien resuelve el día a día sin consultarme.',
        cuello: 'Sos el centro de todas las decisiones. Por eso no podés irte una semana.',
        porque: 'mientras todo pase por vos, no te queda tiempo para lo demás',
        pasos: ['Designá un encargado con autoridad real y una regla: no se trae un problema sin una posible solución.', 'Hacé una reunión semanal corta, con agenda fija.'] },
      { corto: 'Alianzas', q: 'Tengo acuerdos claros con mis proveedores clave.',
        cuello: 'Crecés solo, con lo que tu estructura puede. Los acuerdos claros son la palanca más barata que tenés.',
        porque: 'es la mejora más barata de todas',
        pasos: ['Acordá por escrito precios y plazos con tus 3 proveedores críticos.', 'Conseguí un proveedor alternativo ya probado para cada dependencia crítica.'] }
    ];
    /* Si empatan, se empieza por el área de la que dependen las demás */
    var PRIORIDAD = [F, E, O, M, A];
    /* Mismas etapas que el test completo (js/rueda.js) */
    var ETAPAS = [
      { max: 3.4, nombre: 'Autoempleo' },
      { max: 5.9, nombre: 'En transición' },
      { max: 7.9, nombre: 'Empresa en formación' },
      { max: 10, nombre: 'Empresa autónoma' }
    ];
    var PROGRAMAS = {
      pac: { texto: 'P·A·C, el programa grupal de 8 semanas', link: './pages/pac.html' },
      mar: { texto: 'M·A·R, acompañamiento 1 a 1', link: './pages/mar.html' },
      cde: { texto: 'C·D·E, capacitación para tus encargados', link: './pages/cde.html' }
    };
    var INICIAL = [2, 3, 4, 2, 3];
    var ETIQ = ['', 'Nada cierta', 'Poco cierta', 'A medias', 'Bastante', 'Totalmente'];

    function lista(nombres) { return nombres.length < 2 ? nombres[0] : nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1]; }

    function diagnosticar(v) {
      var min = Math.min.apply(null, v), max = Math.max.apply(null, v);
      var suma = v.reduce(function (x, y) { return x + y; }, 0);
      /* De 5..25 a 0..10, la misma escala que usa el test completo */
      var nota = (suma - 5) / 20 * 10;
      var etapa = 0; while (nota > ETAPAS[etapa].max) etapa++;
      var flojos = PRIORIDAD.filter(function (i) { return v[i] === min; });
      var primero = flojos[0];
      var segundo = PRIORIDAD.filter(function (i) { return i !== primero; })
        .sort(function (x, y) { return v[x] - v[y] || PRIORIDAD.indexOf(x) - PRIORIDAD.indexOf(y); })[0];
      var bajos = v.filter(function (x) { return x <= 2; }).length;
      var d;

      if (min >= 4) {
        d = { titulo: 'Estás para escalar', texto: 'Ninguna área te frena. Lo que sigue no es ordenar: es decidir dónde poner el crecimiento.',
              pasos: ['Elegí un solo frente de crecimiento para los próximos seis meses.', 'Armá un tablero con los cinco números que el equipo mire cada semana.'], prog: 'mar' };
      } else if (max <= 2) {
        d = { titulo: 'Hoy el negocio sos vos', texto: 'Todo pasa por tu cabeza. Conviene empezar por los números, porque ' + PIL[F].porque + '.',
              pasos: [PIL[F].pasos[0], PIL[E].pasos[0]], prog: 'pac' };
      } else if (v[M] >= 4 && v[F] <= 2) {
        d = { titulo: 'Vendés, pero no sabés si ganás', texto: 'Los clientes entran, pero no sabés cuánto te deja cada uno. Si crecés así, crece el desorden.',
              pasos: PIL[F].pasos, prog: 'mar' };
      } else if (v[E] <= 2 && v[O] <= 2) {
        d = { titulo: 'Sos el proceso', texto: 'Nada está escrito y nadie decide sin vos. Por eso no podés faltar ni un día.',
              pasos: [PIL[O].pasos[0], PIL[E].pasos[0]], prog: 'pac' };
      } else if (v[E] <= 2 && v[O] >= 4) {
        d = { titulo: 'Hay procesos, pero te consultan igual', texto: 'Está escrito cómo se hace, pero nadie tiene autoridad para decidir. Lo que falta es delegar.',
              pasos: PIL[E].pasos, prog: 'cde' };
      } else if (v[O] <= 2 && v[M] >= 4) {
        d = { titulo: 'Vendés más de lo que podés sostener', texto: 'Entran clientes, pero la calidad depende de que vos estés mirando. Cada venta nueva te suma trabajo.',
              pasos: PIL[O].pasos, prog: 'mar' };
      } else if (v[F] >= 4 && v[M] <= 2) {
        d = { titulo: 'Números en orden, clientes por suerte', texto: 'Sabés lo que ganás, pero los clientes llegan por boca en boca y la facturación sube y baja.',
              pasos: PIL[M].pasos, prog: 'mar' };
      } else if (min === max) {
        d = { titulo: 'Todo a medias', texto: 'Ninguna área se cae, pero ninguna se sostiene sola. Empezá por ' + PIL[F].corto + ', porque ' + PIL[F].porque + '.',
              pasos: [PIL[F].pasos[0], PIL[E].pasos[0]], prog: 'pac' };
      } else {
        var texto = PIL[primero].cuello;
        if (flojos.length > 1) {
          texto = 'Empatan ' + lista(flojos.map(function (i) { return PIL[i].corto; })) + '. Empezá por ' + PIL[primero].corto +
                  ', porque ' + PIL[primero].porque + '. ' + texto;
        }
        d = { titulo: 'Lo que más te frena: ' + PIL[primero].corto, texto: texto,
              pasos: [PIL[primero].pasos[0], PIL[segundo].pasos[0]],
              prog: primero === E ? 'cde' : (bajos >= 3 ? 'pac' : 'mar') };
      }

      /* Rueda despareja: lo que rinde el área fuerte se pierde en la floja */
      if (max - min >= 3 && min < 4 && max > 2) {
        var fuerte = PRIORIDAD.filter(function (i) { return v[i] === max; })[0];
        d.texto += ' Además, lo que ganás en ' + PIL[fuerte].corto + ' se pierde en ' + PIL[primero].corto + '.';
      }
      d.etapa = etapa; d.suma = suma; d.flojos = min >= 4 ? [] : flojos;
      return d;
    }

    /* --- Frases con barras de nivel: cada barra es un botón de opción (48 px de alto) --- */
    form.innerHTML = PIL.map(function (p, i) {
      var opciones = '';
      for (var n = 1; n <= 5; n++) {
        opciones += '<label style="--n:' + n + '"><input type="radio" name="r' + i + '" value="' + n + '"' +
          (n === INICIAL[i] ? ' checked' : '') + ' aria-label="' + ETIQ[n] + '"><i aria-hidden="true"></i></label>';
      }
      return '<fieldset class="pregunta">' +
        '<legend><span>' + p.corto + '</span><b>' + p.q + '</b></legend>' +
        '<div class="nivel">' + opciones + '</div>' +
        '<div class="pregunta__valor"><span>Nada cierta</span><output id="o' + i + '" aria-live="off"></output><span>Totalmente</span></div>' +
        '</fieldset>';
    }).join('');

    /* --- Radar en SVG --- */
    var svg = $('radar'), NS = 'http://www.w3.org/2000/svg', C = 160, R = 112;
    function pto(i, v) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [C + Math.cos(a) * R * v / 5, C + Math.sin(a) * R * v / 5]; }
    function el(tag, at) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); svg.appendChild(e); return e; }
    for (var n = 1; n <= 5; n++) el('polygon', { 'class': 'red', points: [0, 1, 2, 3, 4].map(function (i) { return pto(i, n).join(','); }).join(' ') });
    PIL.forEach(function (p, i) { var e = pto(i, 5); el('line', { 'class': 'eje', x1: C, y1: C, x2: e[0], y2: e[1] }); });
    var forma = el('polygon', { 'class': 'forma' });
    var puntos = PIL.map(function () { return el('circle', { 'class': 'punto', r: 5 }); });
    var textos = PIL.map(function (p, i) {
      var e = pto(i, 6.25), anchor = Math.abs(e[0] - C) < 5 ? 'middle' : (e[0] > C ? 'start' : 'end');
      var t = el('text', { x: e[0], y: e[1] + (i === 0 ? -2 : 5), 'text-anchor': anchor }); t.textContent = p.corto; return t;
    });

    function valores() {
      return PIL.map(function (p, i) {
        var marcado = form.querySelector('input[name="r' + i + '"]:checked');
        return marcado ? +marcado.value : INICIAL[i];
      });
    }

    /* Momento 1: el radar se transforma de una forma a la otra */
    var actual = INICIAL.slice(), anim = 0;
    function pintarForma(vals) {
      forma.setAttribute('points', vals.map(function (v, i) { return pto(i, v).join(','); }).join(' '));
      vals.forEach(function (v, i) { var p = pto(i, v); puntos[i].setAttribute('cx', p[0].toFixed(2)); puntos[i].setAttribute('cy', p[1].toFixed(2)); });
    }
    function morph(destino) {
      cancelAnimationFrame(anim);
      if (reducir) { actual = destino.slice(); pintarForma(actual); return; }
      var desde = actual.slice(), t0 = null, dur = 420;
      function paso(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        actual = desde.map(function (d, i) { return d + (destino[i] - d) * e; });
        pintarForma(actual);
        if (k < 1) anim = requestAnimationFrame(paso);
      }
      anim = requestAnimationFrame(paso);
    }

    var etapasLi = todos('#etapas li');
    var titulo = $('diag-titulo'), ultimoTitulo = null;

    function dibujar(primeraVez) {
      var vals = valores();
      var d = diagnosticar(vals);
      if (primeraVez) { actual = vals.slice(); pintarForma(vals); } else { morph(vals); }
      vals.forEach(function (v, i) {
        var flojo = d.flojos.indexOf(i) > -1;
        puntos[i].classList.toggle('flojo', flojo);
        puntos[i].setAttribute('r', flojo ? 7 : 5);
        textos[i].classList.toggle('flojo', flojo);
        $('o' + i).textContent = ETIQ[v];
        todos('input[name="r' + i + '"]', form).forEach(function (inp) {
          inp.parentNode.classList.toggle('lleno', +inp.value <= v);
        });
      });
      $('etapa-nombre').textContent = ETAPAS[d.etapa].nombre;
      $('puntaje').textContent = d.suma + ' de 25';
      etapasLi.forEach(function (li, i) {
        li.className = i < d.etapa ? 'pasada' : (i === d.etapa ? 'actual' : '');
        if (i === d.etapa) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      svg.setAttribute('aria-label', 'Radar de las cinco áreas: ' + PIL.map(function (p, i) { return p.corto + ' ' + vals[i] + ' de 5'; }).join(', '));
      if (ultimoTitulo !== null && d.titulo !== ultimoTitulo) {
        titulo.classList.remove('fn-cambio'); void titulo.offsetWidth; titulo.classList.add('fn-cambio');
      }
      ultimoTitulo = d.titulo;
      titulo.textContent = d.titulo;
      $('diag-texto').textContent = d.texto;
      $('diag-pasos').innerHTML = d.pasos.map(function (t) { return '<li>' + t + '</li>'; }).join('');
      var prog = PROGRAMAS[d.prog];
      $('diag-prog').textContent = prog.texto;
      $('diag-prog').href = prog.link;
      var msg = 'Hola, quiero mi diagnóstico. Hice el test de la web. Etapa: ' + ETAPAS[d.etapa].nombre + ' (' + d.suma + ' de 25). ' +
        'Resultado: ' + d.titulo + '. ' + PIL.map(function (p, i) { return p.corto + ' ' + vals[i] + '/5'; }).join(', ') + '.';
      $('rueda-wa').href = waUrl(msg);
      $('resumen-vivo').textContent = 'Etapa: ' + ETAPAS[d.etapa].nombre + '. ' + d.titulo + '.';
    }
    form.addEventListener('change', function (e) {
      dibujar(false);
      /* En el celular las frases se deslizan: al marcar una, pasa sola a la siguiente */
      if (!form.classList.contains('deslizable') || !matchMedia('(max-width: 719px)').matches) return;
      var actualFs = e.target.closest('fieldset'), siguiente = actualFs && actualFs.nextElementSibling;
      if (!siguiente) return;
      setTimeout(function () {
        form.scrollTo({ left: siguiente.offsetLeft - parseFloat(getComputedStyle(form).paddingLeft || 0), behavior: reducir ? 'auto' : 'smooth' });
      }, 260);
    });
    dibujar(true);
  })();
  /* ---------- Grupos deslizables (celular): puntitos de posición y foco con teclado ---------- */
  todos('.deslizable, .piezas').forEach(function (el) {
    var items = [].slice.call(el.children);
    if (items.length < 2) return;
    var puntos = document.createElement('div');
    puntos.className = 'puntos';
    puntos.setAttribute('aria-hidden', 'true');
    items.forEach(function () { puntos.appendChild(document.createElement('i')); });
    el.parentNode.insertBefore(puntos, el.nextSibling);
    function actualizar() {
      var desliza = el.scrollWidth > el.clientWidth + 4;
      if (desliza) el.setAttribute('tabindex', '0'); else el.removeAttribute('tabindex');
      puntos.hidden = !desliza;
      if (!desliza) return;
      var paso = items[1].offsetLeft - items[0].offsetLeft || el.clientWidth;
      var i = Math.round(el.scrollLeft / paso);
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) i = items.length - 1;
      [].forEach.call(puntos.children, function (p, k) { p.classList.toggle('activo', k === i); });
    }
    el.addEventListener('scroll', actualizar, { passive: true });
    addEventListener('resize', actualizar);
    /* El CSS completo puede llegar después que este script: se vuelve a medir cuando cambia el tamaño */
    addEventListener('load', actualizar);
    if ('ResizeObserver' in window) new ResizeObserver(actualizar).observe(el);
    actualizar();
  });
})();
