/* Fluir Negocios · comportamiento de la home y de /diagnostico
   - Arma los links de WhatsApp con el mensaje base y el código del anuncio (utm_content).
   - Mide: Contact en cualquier clic a WhatsApp; Schedule (content_category = página-botón)
     y solicitar_diagnostico (GA4) en cada botón que pide el diagnóstico.
   - Titular según el anuncio en /diagnostico (?h= o la palabra dentro de utm_content).
   - Barra inferior de un solo botón, videos de a uno, guía gratis (Lead) y el diagnóstico rápido de 10 preguntas. */
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

  /* ---------- Titular según el anuncio ----------
     Lo decide un script en el <head> antes de dibujar (marca <html data-h>), y el CSS muestra
     solo la variante que corresponde. Esto queda de respaldo por si ese script no estuvo. */
  (function () {
    if (!document.querySelector('[data-variantes]') || document.documentElement.hasAttribute('data-h')) return;
    var permitidas = ['plata', 'equipo', 'grupo'];
    var h = (qs.get('h') || '').toLowerCase();
    if (permitidas.indexOf(h) < 0) {
      var c = (qs.get('utm_content') || '').toLowerCase();
      h = permitidas.filter(function (p) { return c.indexOf(p) > -1; })[0] || '';
    }
    if (h) document.documentElement.setAttribute('data-h', h);
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
      /* Miniaturas chicas: el video se ve a pantalla completa con el reproductor del teléfono */
      if (fig.hasAttribute('data-pantalla')) {
        try {
          var r = v.requestFullscreen ? v.requestFullscreen() : (v.webkitEnterFullscreen ? v.webkitEnterFullscreen() : null);
          if (r && r.catch) r.catch(function () {});
        } catch (err) {}
      }
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
     Diagnóstico rápido: 10 preguntas de sí, a medias o no, de a una.
     Dos preguntas por área. Sí = 2, a medias = 1, no = 0: cada área va de 0 a 4 y el total de 0 a 20.
     El resultado lee el perfil completo (etapa, combinaciones entre áreas, empates y desbalance),
     con los mismos textos y recomendaciones que el test anterior. El P·A·C ya no existe: lo grupal es M·A·R.
     ===================================================================== */
  (function () {
    var caja = $('rapido-preguntas');
    if (!caja) return;
    var res = $('rapido-resultado');

    var F = 0, O = 1, M = 2, E = 3, A = 4;
    var AREAS = [
      { corto: 'Finanzas',
        cuello: 'Decidís sin saber cuánto ganás ni dónde se va la plata. Si crecés así, crece el desorden.',
        porque: 'sin números claros, cualquier otra mejora es a ciegas',
        pasos: ['Armá un estado de resultados mensual real, con ingresos, costos y gastos fijos separados.', 'Definí tu sueldo fijo y sacalo de la caja diaria.'] },
      { corto: 'Operaciones',
        cuello: 'La calidad y los tiempos dependen de que vos estés mirando. Lo que hoy sostiene tu memoria lo tiene que sostener un proceso.',
        porque: 'lo que está escrito se puede delegar',
        pasos: ['Escribí paso a paso los 3 procesos críticos del negocio.', 'Definí un estándar de calidad con un control simple que funcione sin vos.'] },
      { corto: 'Ventas',
        cuello: 'Los clientes llegan por boca en boca y por la suerte del mes. La facturación sube y baja sin que la controles.',
        porque: 'sin clientes nuevos no hay crecimiento que ordenar',
        pasos: ['Elegí un solo canal para conseguir clientes y sostenelo hasta poder medirlo.', 'Preguntá y anotá de dónde viene cada cliente nuevo.'] },
      { corto: 'Equipo',
        cuello: 'Sos el centro de todas las decisiones. Por eso no podés irte una semana.',
        porque: 'mientras todo pase por vos, no te queda tiempo para lo demás',
        pasos: ['Designá un encargado con autoridad real y una regla: no se trae un problema sin una posible solución.', 'Hacé una reunión semanal corta, con agenda fija.'] },
      { corto: 'Proveedores',
        cuello: 'Crecés solo, con lo que tu estructura puede. Los acuerdos claros son la palanca más barata que tenés.',
        porque: 'es la mejora más barata de todas',
        pasos: ['Acordá por escrito precios y plazos con tus 3 proveedores críticos.', 'Conseguí un proveedor alternativo ya probado para cada dependencia crítica.'] }
    ];
    /* Intercaladas, para que no se sientan repetidas */
    var PREGUNTAS = [
      [F, '¿Sabés cuánto ganó tu negocio el mes pasado, sin estimarlo?'],
      [E, '¿Alguien resuelve el día a día sin consultarte?'],
      [O, '¿Los procesos clave están escritos, y no solo en tu cabeza?'],
      [M, '¿Entran clientes nuevos todos los meses, no solo por boca en boca?'],
      [A, '¿Tenés acuerdos claros y por escrito con tus proveedores clave?'],
      [F, '¿Cobrás un sueldo fijo, separado de la caja del negocio?'],
      [E, '¿Podrías tomarte una semana sin que el negocio se frene?'],
      [O, '¿El trabajo sale bien aunque no estés mirando?'],
      [M, '¿Sabés de dónde viene cada cliente nuevo?'],
      [A, '¿Tenés un proveedor alternativo para lo que no puede faltar?']
    ];
    var OPCIONES = [['Sí', 2], ['A medias', 1], ['No', 0]];
    /* Si empatan, se empieza por el área de la que dependen las demás */
    var PRIORIDAD = [F, E, O, M, A];
    var ETAPAS = [
      { max: 6, nombre: 'Autoempleo' },
      { max: 11, nombre: 'En transición' },
      { max: 15, nombre: 'Empresa en formación' },
      { max: 20, nombre: 'Empresa autónoma' }
    ];
    var PROGRAMAS = {
      mar: { texto: 'M·A·R, acompañamiento 1 a 1 o grupal', link: './pages/mar.html' },
      cde: { texto: 'C·D·E, capacitación para tus encargados', link: './pages/cde.html' },
      sistemas: { texto: 'Fluir Sistemas: tablero y tareas que se hacen solas', link: './pages/sistemas.html' }
    };

    function lista(nombres) { return nombres.length < 2 ? nombres[0] : nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1]; }

    function diagnosticar(v) {
      var min = Math.min.apply(null, v), max = Math.max.apply(null, v);
      var suma = v.reduce(function (x, y) { return x + y; }, 0);
      var etapa = 0; while (suma > ETAPAS[etapa].max) etapa++;
      var flojos = PRIORIDAD.filter(function (i) { return v[i] === min; });
      var primero = flojos[0];
      var segundo = PRIORIDAD.filter(function (i) { return i !== primero; })
        .sort(function (x, y) { return v[x] - v[y] || PRIORIDAD.indexOf(x) - PRIORIDAD.indexOf(y); })[0];
      var d;
      if (min >= 3) {
        d = { titulo: 'Estás para escalar', texto: 'Ninguna área te frena. Lo que sigue no es ordenar: es decidir dónde poner el crecimiento.',
              pasos: ['Elegí un solo frente de crecimiento para los próximos seis meses.', 'Armá un tablero con los cinco números que el equipo mire cada semana.'], prog: 'sistemas' };
      } else if (max <= 1) {
        d = { titulo: 'Hoy el negocio sos vos', texto: 'Todo pasa por tu cabeza. Conviene empezar por los números, porque ' + AREAS[F].porque + '.',
              pasos: [AREAS[F].pasos[0], AREAS[E].pasos[0]], prog: 'mar' };
      } else if (v[M] >= 3 && v[F] <= 1) {
        d = { titulo: 'Vendés, pero no sabés si ganás', texto: 'Los clientes entran, pero no sabés cuánto te deja cada uno. Si crecés así, crece el desorden.',
              pasos: AREAS[F].pasos, prog: 'mar' };
      } else if (v[E] <= 1 && v[O] <= 1) {
        d = { titulo: 'Sos el proceso', texto: 'Nada está escrito y nadie decide sin vos. Por eso no podés faltar ni un día.',
              pasos: [AREAS[O].pasos[0], AREAS[E].pasos[0]], prog: 'mar' };
      } else if (v[E] <= 1 && v[O] >= 3) {
        d = { titulo: 'Hay procesos, pero te consultan igual', texto: 'Está escrito cómo se hace, pero nadie tiene autoridad para decidir. Lo que falta es delegar.',
              pasos: AREAS[E].pasos, prog: 'cde' };
      } else if (v[O] <= 1 && v[M] >= 3) {
        d = { titulo: 'Vendés más de lo que podés sostener', texto: 'Entran clientes, pero la calidad depende de que vos estés mirando. Cada venta nueva te suma trabajo.',
              pasos: AREAS[O].pasos, prog: 'mar' };
      } else if (v[F] >= 3 && v[M] <= 1) {
        d = { titulo: 'Números en orden, clientes por suerte', texto: 'Sabés lo que ganás, pero los clientes llegan por boca en boca y la facturación sube y baja.',
              pasos: AREAS[M].pasos, prog: 'mar' };
      } else if (min === max) {
        d = { titulo: 'Todo a medias', texto: 'Ninguna área se cae, pero ninguna se sostiene sola. Empezá por ' + AREAS[F].corto + ', porque ' + AREAS[F].porque + '.',
              pasos: [AREAS[F].pasos[0], AREAS[E].pasos[0]], prog: 'mar' };
      } else {
        var texto = AREAS[primero].cuello;
        if (flojos.length > 1) {
          texto = 'Empatan ' + lista(flojos.map(function (i) { return AREAS[i].corto; })) + '. Empezá por ' + AREAS[primero].corto +
                  ', porque ' + AREAS[primero].porque + '. ' + texto;
        }
        d = { titulo: 'Lo que más te frena: ' + AREAS[primero].corto, texto: texto,
              pasos: [AREAS[primero].pasos[0], AREAS[segundo].pasos[0]], prog: primero === E ? 'cde' : 'mar' };
      }
      /* Desparejo: lo que rinde el área fuerte se pierde en la floja */
      if (max - min >= 3 && min < 3 && max > 1) {
        var fuerte = PRIORIDAD.filter(function (i) { return v[i] === max; })[0];
        d.texto += ' Además, lo que ganás en ' + AREAS[fuerte].corto + ' se pierde en ' + AREAS[primero].corto + '.';
      }
      d.etapa = etapa; d.suma = suma; d.flojos = min >= 3 ? [] : flojos;
      return d;
    }

    var respuestas = [], actual = 0;

    function pintarPregunta(conFoco) {
      var p = PREGUNTAS[actual];
      var segmentos = PREGUNTAS.map(function (x, i) {
        return '<i class="' + (i < actual ? 'hecha' : (i === actual ? 'actual' : '')) + '"></i>';
      }).join('');
      caja.innerHTML =
        '<div class="rapido__arriba"><p class="rapido__paso">Pregunta <b>' + (actual + 1) + '</b> de ' + PREGUNTAS.length + '</p>' +
        '<p class="rapido__area">' + AREAS[p[0]].corto + '</p></div>' +
        '<div class="rapido__progreso" aria-hidden="true">' + segmentos + '</div>' +
        '<div class="rapido__pregunta' + (conFoco !== null ? ' entra' : '') + '" role="group" aria-labelledby="rapido-q">' +
          '<p class="rapido__q" id="rapido-q" tabindex="-1">' + p[1] + '</p>' +
          '<div class="rapido__opciones">' + OPCIONES.map(function (o) {
            return '<button type="button" data-v="' + o[1] + '"' + (respuestas[actual] === o[1] ? ' aria-pressed="true"' : '') + '>' + o[0] + '</button>';
          }).join('') + '</div>' +
        '</div>' +
        (actual > 0 ? '<button class="rapido__volver" type="button" data-volver>Volver a la anterior</button>' : '');
      if (conFoco) $('rapido-q').focus({ preventScroll: true });
    }

    function valores() {
      var v = [0, 0, 0, 0, 0];
      PREGUNTAS.forEach(function (p, i) { v[p[0]] += respuestas[i] || 0; });
      return v;
    }

    function mostrarResultado(conFoco) {
      var v = valores(), d = diagnosticar(v);
      caja.hidden = true;
      res.hidden = false;
      $('etapa-nombre').innerHTML = 'Tu etapa: <b>' + ETAPAS[d.etapa].nombre + '</b> · ' + d.suma + ' de 20';
      $('diag-titulo').textContent = d.titulo;
      $('diag-texto').textContent = d.texto;
      $('rapido-areas').innerHTML = AREAS.map(function (a, i) {
        var barras = '';
        for (var n = 1; n <= 4; n++) barras += '<i' + (n <= v[i] ? ' class="lleno"' : '') + '></i>';
        return '<li' + (d.flojos.indexOf(i) > -1 ? ' class="flojo"' : '') + '><span>' + a.corto + '</span>' +
               '<span class="rapido__barra" aria-hidden="true">' + barras + '</span><span class="solo-lector">' + v[i] + ' de 4</span></li>';
      }).join('');
      $('diag-pasos').innerHTML = d.pasos.map(function (t) { return '<li>' + t + '</li>'; }).join('');
      var prog = PROGRAMAS[d.prog];
      $('diag-prog').textContent = prog.texto;
      $('diag-prog').href = prog.link;
      var msg = 'Hola, quiero mi diagnóstico. Hice el diagnóstico rápido de la web. Etapa: ' + ETAPAS[d.etapa].nombre + ' (' + d.suma + ' de 20). ' +
        'Resultado: ' + d.titulo + '. ' + AREAS.map(function (a, i) { return a.corto + ' ' + v[i] + '/4'; }).join(', ') + '.';
      $('rueda-wa').href = waUrl(msg);
      $('resumen-vivo').textContent = 'Resultado: ' + d.titulo + '. Etapa: ' + ETAPAS[d.etapa].nombre + '.';
      ga('diagnostico_rapido', { resultado: d.titulo, etapa: ETAPAS[d.etapa].nombre, puntaje: d.suma });
      if (conFoco) $('diag-titulo').focus({ preventScroll: true });
      var tarjeta = res.closest('.rapido__tarjeta');
      if (tarjeta && tarjeta.getBoundingClientRect().top < 0) tarjeta.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
    }

    caja.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || caja.classList.contains('pasando')) return;
      var conFoco = caja.contains(document.activeElement) || e.detail === 0;
      if (b.hasAttribute('data-volver')) { actual--; pintarPregunta(conFoco); return; }
      respuestas[actual] = +b.getAttribute('data-v');
      b.setAttribute('aria-pressed', 'true');
      caja.classList.add('pasando');
      setTimeout(function () {
        caja.classList.remove('pasando');
        actual++;
        if (actual < PREGUNTAS.length) pintarPregunta(conFoco); else mostrarResultado(conFoco);
      }, reducir ? 60 : 240);
    });

    $('rapido-otra').addEventListener('click', function () {
      respuestas = []; actual = 0;
      res.hidden = true; caja.hidden = false;
      pintarPregunta(true);
    });

    /* Antes de terminar, el botón de WhatsApp igual lleva el mensaje base con el código del anuncio */
    $('rueda-wa').href = waUrl(MENSAJE);
    pintarPregunta(null);
  })();

  /* ---------- /diagnostico: la tarjeta de WhatsApp se escribe sola y la página acompaña al bajar ----------
     El <head> marca html.dg-anima si la persona no pidió menos movimiento; sin esa marca todo queda
     quieto y en su estado final. Arranca recién cuando el CSS completo está aplicado (--dg-completo),
     para que las transiciones existan. La tarjeta es un link: tocarla abre WhatsApp en cualquier momento. */
  (function () {
    if (!cuerpo.classList.contains('dg')) return;
    var raiz = document.documentElement;
    raiz.classList.add('dg-js');
    var chat = document.querySelector('.dg-chat');
    var mueve = raiz.classList.contains('dg-anima') && !reducir && 'IntersectionObserver' in window;
    if (!mueve) {
      raiz.classList.remove('dg-anima');
      if (chat) chat.classList.add('v-mia', 'v-leido', 'v-suya');
      return;
    }
    function conCss(fn) {
      var intentos = 0;
      (function mirar() {
        if (getComputedStyle(cuerpo).getPropertyValue('--dg-completo').trim() || intentos++ > 60) fn();
        else setTimeout(mirar, 80);
      })();
    }
    function alVer(els, fn, umbral, margen) {
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) { io.unobserve(en.target); fn(en.target); }
        });
      }, { threshold: umbral || 0, rootMargin: margen || '0px' });
      [].concat(els).forEach(function (el) { io.observe(el); });
    }
    function brillo(b) {
      if (!b) return;
      b.classList.remove('brilla');
      void b.offsetWidth;
      b.classList.add('brilla');
    }

    /* Tarjeta: escribe el mensaje, lo manda, se lee, escriben del otro lado y responden */
    function escribir() {
      var campo = chat.querySelector('.dg-chat__tipeo');
      var texto = (campo && campo.getAttribute('data-texto')) || '';
      var i = 0;
      setTimeout(function letra() {
        campo.textContent = texto.slice(0, ++i);
        if (i < texto.length) setTimeout(letra, 28 + Math.random() * 40);
        else setTimeout(enviar, 360);
      }, 250);
      function enviar() {
        campo.textContent = '';
        chat.classList.add('v-envia', 'v-mia');
        setTimeout(function () { chat.classList.add('v-leido'); }, 700);
        setTimeout(function () { chat.classList.add('v-escribe'); }, 1000);
        setTimeout(function () {
          chat.classList.add('v-suya');
          brillo(document.querySelector('.dg-accion .boton'));
        }, 2500);
      }
    }

    /* Pasos: se encienden de a uno, en orden, a medida que se baja */
    function pasos() {
      var items = todos('.dg-pasos .paso');
      if (!items.length) return;
      items[0].parentNode.classList.add('anima');
      var meta = 0, hechos = 0, andando = false;
      function seguir() {
        if (hechos >= meta) { andando = false; return; }
        andando = true;
        var previo = items[hechos - 1], actual = items[hechos];
        if (previo) previo.classList.add('lleno');
        setTimeout(function () {
          actual.classList.add('activo');
          hechos++;
          if (hechos === items.length) setTimeout(function () { brillo(document.querySelector('.dg-pasos__accion .boton')); }, 350);
          setTimeout(seguir, 220);
        }, previo ? 480 : 0);
      }
      alVer(items, function (p) {
        meta = Math.max(meta, items.indexOf(p) + 1);
        if (!andando) seguir();
      }, 0, '0px 0px -30% 0px');
    }

    /* Casos: cada tarjeta se dibuja al verse; en el celular, la fila se asoma para invitar a deslizar */
    function casos() {
      var lista = document.querySelector('.dg-casos');
      if (!lista) return;
      alVer(todos('.dg-caso', lista), function (c) { c.classList.add('visto'); }, 0.55);
      var bloque = lista.closest('section'), pista = bloque && bloque.querySelector('.dg-desliza'), usado = false;
      lista.addEventListener('scroll', function () {
        if (!usado && lista.scrollLeft > 12) { usado = true; if (pista) pista.classList.add('usado'); }
      }, { passive: true });
      if (bloque) alVer(lista, function () {
        if (!usado && lista.scrollWidth > lista.clientWidth + 4) bloque.classList.add('asoma');
      }, 0.45);
    }

    conCss(function () {
      var escena = document.querySelector('.dg-escena');
      if (escena) escena.classList.add('v-foto');
      if (chat) alVer(chat, escribir, 0.5);
      pasos();
      casos();
      var equipo = document.querySelector('.dg-equipo');
      if (equipo) alVer(equipo, function () { equipo.classList.add('visto'); }, 0.25);
    });
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
