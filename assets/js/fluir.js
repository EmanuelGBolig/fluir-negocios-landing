/* Fluir Negocios · comportamiento de la home y de /diagnostico
   - Arma los links de WhatsApp con el mensaje base y el código del anuncio (utm_content).
   - Mide: Contact en cualquier clic a WhatsApp; Schedule (content_category = página-botón)
     y solicitar_diagnostico (GA4) en cada botón que pide el diagnóstico.
   - Titular según el anuncio en /diagnostico (?h= o la palabra dentro de utm_content).
   - Barra inferior de un solo botón, videos de a uno, guía gratis (Lead) y el diagnóstico rápido (home y /diagnostico-rapido/). */
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
     Diagnóstico rápido (home #rueda y link directo /diagnostico-rapido/).
     Embudo: 1) intro con lo que gana la persona, 2) preguntas de un toque, 3) nombre y email
     justo antes del resultado (explicando para qué), 4) resultado + WhatsApp para agendar la llamada.
     Preguntas: 3 del negocio y 3 de lo que busca (tomadas del formulario "Punto de Partida")
     y 10 de sí / a medias / no, dos por área: Finanzas, Equipo, Operaciones, Ventas y Proveedores
     (cada área de 0 a 4, total de 0 a 20). Todo le llega al equipo por Formspree (el mismo de la guía).
     No dispara Lead en el píxel: Lead es solo la guía.
     ===================================================================== */
  (function () {
    var tarjeta = $('rapido');
    if (!tarjeta) return;
    var intro = $('rapido-intro'), caja = $('rapido-preguntas'), form = $('rapido-datos'), res = $('rapido-resultado');

    var F = 0, O = 1, M = 2, E = 3, A = 4;
    var AREAS = [
      { corto: 'Finanzas', frena: 'son las finanzas',
        cuello: 'Decidís sin saber cuánto ganás ni dónde se va la plata. Si crecés así, crece el desorden.',
        porque: 'sin números claros, cualquier otra mejora es a ciegas',
        pasos: ['Armá un estado de resultados mensual real, con ingresos, costos y gastos fijos separados.', 'Definí tu sueldo fijo y sacalo de la caja diaria.'] },
      { corto: 'Operaciones', frena: 'son las operaciones',
        cuello: 'La calidad y los tiempos dependen de que vos estés mirando. Lo que hoy sostiene tu memoria lo tiene que sostener un proceso.',
        porque: 'lo que está escrito se puede delegar',
        pasos: ['Escribí paso a paso los 3 procesos críticos del negocio.', 'Definí un estándar de calidad con un control simple que funcione sin vos.'] },
      { corto: 'Ventas', frena: 'son las ventas',
        cuello: 'Los clientes llegan por boca en boca y por la suerte del mes. La facturación sube y baja sin que la controles.',
        porque: 'sin clientes nuevos no hay crecimiento que ordenar',
        pasos: ['Elegí un solo canal para conseguir clientes y sostenelo hasta poder medirlo.', 'Preguntá y anotá de dónde viene cada cliente nuevo.'] },
      { corto: 'Equipo', frena: 'es el equipo',
        cuello: 'Sos el centro de todas las decisiones. Por eso no podés irte una semana.',
        porque: 'mientras todo pase por vos, no te queda tiempo para lo demás',
        pasos: ['Designá un encargado con autoridad real y una regla: no se trae un problema sin una posible solución.', 'Hacé una reunión semanal corta, con agenda fija.'] },
      { corto: 'Proveedores', frena: 'son los proveedores',
        cuello: 'Crecés solo, con lo que tu estructura puede. Los acuerdos claros son la palanca más barata que tenés.',
        porque: 'es la mejora más barata de todas',
        pasos: ['Acordá por escrito precios y plazos con tus 3 proveedores críticos.', 'Conseguí un proveedor alternativo ya probado para cada dependencia crítica.'] }
    ];
    var SINO = ['Sí', 'A medias', 'No'];
    var VALOR = { 'Sí': 2, 'A medias': 1, 'No': 0 };
    /* Orden: del negocio (fácil de contestar) → cómo está hoy → lo que busca (más personal, cuando ya hay confianza) */
    var PREGUNTAS = [
      { parte: 'Tu negocio', clave: 'Rol', q: '¿Qué lugar ocupás en el negocio?',
        ops: ['Soy dueño y decido solo', 'Soy dueño y tengo socios', 'Es un negocio familiar', 'Soy encargado o gerente'] },
      { parte: 'Tu negocio', clave: 'Personas', q: '¿Cuántas personas trabajan con vos?',
        ops: ['Solo yo', '1 a 5', '6 a 15', '16 a 30', 'Más de 30'] },
      { parte: 'Tu negocio', clave: 'Antigüedad', q: '¿Hace cuánto está en marcha?',
        ops: ['Menos de 1 año', '1 a 3 años', '3 a 10 años', 'Más de 10 años'] },
      { area: F, q: '¿Sabés cuánto ganó tu negocio el mes pasado, sin estimarlo?' },
      { area: E, q: '¿Alguien resuelve el día a día sin consultarte?' },
      { area: O, q: '¿Los procesos clave están escritos, y no solo en tu cabeza?' },
      { area: M, q: '¿Entran clientes nuevos todos los meses, no solo por boca en boca?' },
      { area: A, q: '¿Tenés acuerdos claros y por escrito con tus proveedores clave?' },
      { area: F, q: '¿Cobrás un sueldo fijo, separado de la caja del negocio?' },
      { area: E, q: '¿Podrías tomarte una semana sin que el negocio se frene?' },
      { area: O, q: '¿El trabajo sale bien aunque no estés mirando?' },
      { area: M, q: '¿Sabés de dónde viene cada cliente nuevo?' },
      { area: A, q: '¿Tenés un proveedor alternativo para lo que no puede faltar?' },
      { parte: 'Lo que buscás', clave: 'Quiere lograr primero', q: '¿Qué te gustaría lograr primero?',
        ops: ['Ganar más con lo que vendo', 'Vender más', 'Tener más tiempo', 'Un equipo que resuelva sin mí', 'Ordenar los números', 'Claridad para decidir'] },
      { parte: 'Lo que buscás', clave: 'Cómo le afecta hoy', q: '¿Cómo te está afectando hoy?',
        ops: ['Vivo con estrés o cansado', 'No me queda tiempo para mí ni para mi familia', 'Perdí las ganas de antes', 'Estoy bien, quiero crecer'] },
      { parte: 'Lo que buscás', clave: 'Si nada cambia en 6 meses pierde', q: 'Si nada cambia en los próximos 6 meses, ¿qué es lo que más perdés?',
        ops: ['Plata', 'Tiempo', 'Clientes y oportunidades', 'Ganas y energía'] }
    ];
    /* Si empatan, se empieza por el área de la que dependen las demás */
    var PRIORIDAD = [F, E, O, M, A];
    var ETAPAS = [
      { max: 6, nombre: 'Autoempleo' },
      { max: 11, nombre: 'En transición' },
      { max: 15, nombre: 'Empresa en formación' },
      { max: 20, nombre: 'Empresa autónoma' }
    ];
    var PROGRAMAS = {
      mar: { texto: 'M·A·R, acompañamiento 1 a 1 o grupal', link: '/pages/mar.html' },
      cde: { texto: 'C·D·E, capacitación para tus encargados', link: '/pages/cde.html' },
      sistemas: { texto: 'Fluir Sistemas: tablero y tareas que se hacen solas', link: '/pages/sistemas.html' }
    };

    function lista(nombres) { return nombres.length < 2 ? nombres[0] : nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1]; }
    function escapar(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function diagnosticar(v) {
      var min = Math.min.apply(null, v), max = Math.max.apply(null, v);
      var suma = v.reduce(function (x, y) { return x + y; }, 0);
      var etapa = 0; while (suma > ETAPAS[etapa].max) etapa++;
      var flojos = PRIORIDAD.filter(function (i) { return v[i] === min; });
      var primero = flojos[0];
      var segundo = PRIORIDAD.filter(function (i) { return i !== primero; })
        .sort(function (x, y) { return v[x] - v[y] || PRIORIDAD.indexOf(x) - PRIORIDAD.indexOf(y); })[0];
      var frena = function (i) { return 'lo que más me frena ' + AREAS[i].frena; };
      var d;
      if (min >= 3) {
        d = { titulo: 'Estás para escalar', texto: 'Ninguna área te frena. Lo que sigue no es ordenar: es decidir dónde poner el crecimiento.',
              pasos: ['Elegí un solo frente de crecimiento para los próximos seis meses.', 'Armá un tablero con los cinco números que el equipo mire cada semana.'], prog: 'sistemas',
              frase: 'ninguna área me frena: quiero ver dónde poner el crecimiento' };
      } else if (max <= 1) {
        d = { titulo: 'Hoy el negocio sos vos', texto: 'Todo pasa por tu cabeza. Conviene empezar por los números, porque ' + AREAS[F].porque + '.',
              pasos: [AREAS[F].pasos[0], AREAS[E].pasos[0]], prog: 'mar', frase: 'hoy todo el negocio pasa por mí' };
      } else if (v[M] >= 3 && v[F] <= 1) {
        d = { titulo: 'Vendés, pero no sabés si ganás', texto: 'Los clientes entran, pero no sabés cuánto te deja cada uno. Si crecés así, crece el desorden.',
              pasos: AREAS[F].pasos, prog: 'mar', frase: frena(F) };
      } else if (v[E] <= 1 && v[O] <= 1) {
        d = { titulo: 'Sos el proceso', texto: 'Nada está escrito y nadie decide sin vos. Por eso no podés faltar ni un día.',
              pasos: [AREAS[O].pasos[0], AREAS[E].pasos[0]], prog: 'mar', frase: 'lo que más me frena son las operaciones y el equipo' };
      } else if (v[E] <= 1 && v[O] >= 3) {
        d = { titulo: 'Hay procesos, pero te consultan igual', texto: 'Está escrito cómo se hace, pero nadie tiene autoridad para decidir. Lo que falta es delegar.',
              pasos: AREAS[E].pasos, prog: 'cde', frase: frena(E) };
      } else if (v[O] <= 1 && v[M] >= 3) {
        d = { titulo: 'Vendés más de lo que podés sostener', texto: 'Entran clientes, pero la calidad depende de que vos estés mirando. Cada venta nueva te suma trabajo.',
              pasos: AREAS[O].pasos, prog: 'mar', frase: frena(O) };
      } else if (v[F] >= 3 && v[M] <= 1) {
        d = { titulo: 'Números en orden, clientes por suerte', texto: 'Sabés lo que ganás, pero los clientes llegan por boca en boca y la facturación sube y baja.',
              pasos: AREAS[M].pasos, prog: 'mar', frase: frena(M) };
      } else if (min === max) {
        d = { titulo: 'Todo a medias', texto: 'Ninguna área se cae, pero ninguna se sostiene sola. Empezá por ' + AREAS[F].corto + ', porque ' + AREAS[F].porque + '.',
              pasos: [AREAS[F].pasos[0], AREAS[E].pasos[0]], prog: 'mar', frase: 'tengo todas las áreas a medias' };
      } else {
        var texto = AREAS[primero].cuello;
        if (flojos.length > 1) {
          texto = 'Empatan ' + lista(flojos.map(function (i) { return AREAS[i].corto; })) + '. Empezá por ' + AREAS[primero].corto +
                  ', porque ' + AREAS[primero].porque + '. ' + texto;
        }
        d = { titulo: 'Lo que más te frena: ' + AREAS[primero].corto, texto: texto,
              pasos: [AREAS[primero].pasos[0], AREAS[segundo].pasos[0]], prog: primero === E ? 'cde' : 'mar', frase: frena(primero) };
      }
      /* Desparejo: lo que rinde el área fuerte se pierde en la floja */
      if (max - min >= 3 && min < 3 && max > 1) {
        var fuerte = PRIORIDAD.filter(function (i) { return v[i] === max; })[0];
        d.texto += ' Además, lo que ganás en ' + AREAS[fuerte].corto + ' se pierde en ' + AREAS[primero].corto + '.';
      }
      d.etapa = etapa; d.suma = suma; d.flojos = min >= 3 ? [] : flojos;
      return d;
    }

    var respuestas = [], actual = 0, datos = null, enviado = false;

    function valores() {
      var v = [0, 0, 0, 0, 0];
      PREGUNTAS.forEach(function (p, i) { if (p.area !== undefined) v[p.area] += VALOR[respuestas[i]] || 0; });
      return v;
    }
    function respuesta(clave) {
      for (var i = 0; i < PREGUNTAS.length; i++) if (PREGUNTAS[i].clave === clave) return respuestas[i] || '';
      return '';
    }
    function mostrar(el) {
      [intro, caja, form, res].forEach(function (x) { x.hidden = x !== el; });
      if (tarjeta.getBoundingClientRect().top < 0) tarjeta.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
    }

    /* --- 1) Intro --- */
    $('rapido-empezar').addEventListener('click', function (e) {
      ga('diagnostico_rapido_inicio', { pagina: PAGINA });
      actual = 0;
      mostrar(caja);
      pintarPregunta(true);
    });

    /* --- 2) Preguntas, de a una --- */
    function pintarPregunta(conFoco) {
      var p = PREGUNTAS[actual];
      var ops = p.ops || SINO;
      var segmentos = PREGUNTAS.map(function (x, i) {
        return '<i class="' + (i < actual ? 'hecha' : (i === actual ? 'actual' : '')) + '"></i>';
      }).join('');
      var aviso = actual === 3 ? '<p class="rapido__animo">Ahora, cómo está hoy. Respondé con lo primero que te salga: no hay respuestas buenas ni malas.</p>' :
                  (actual === 13 ? '<p class="rapido__animo">Ya casi. Tres preguntas sobre lo que buscás.</p>' : '');
      caja.innerHTML =
        '<div class="rapido__arriba"><p class="rapido__paso">Pregunta <b>' + (actual + 1) + '</b> de ' + PREGUNTAS.length + '</p>' +
        '<p class="rapido__area">' + (p.area !== undefined ? AREAS[p.area].corto : p.parte) + '</p></div>' +
        '<div class="rapido__progreso" aria-hidden="true">' + segmentos + '</div>' + aviso +
        '<div class="rapido__pregunta entra" role="group" aria-labelledby="rapido-q">' +
          '<p class="rapido__q" id="rapido-q" tabindex="-1">' + p.q + '</p>' +
          '<div class="rapido__opciones' + (p.ops ? ' rapido__opciones--lista' : '') + '">' + ops.map(function (o) {
            return '<button type="button" data-v="' + escapar(o) + '"' + (respuestas[actual] === o ? ' aria-pressed="true"' : '') + '>' + o + '</button>';
          }).join('') + '</div>' +
        '</div>' +
        (actual > 0 ? '<button class="rapido__volver" type="button" data-volver>Volver a la anterior</button>' : '');
      if (conFoco) $('rapido-q').focus({ preventScroll: true });
    }

    caja.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || caja.classList.contains('pasando')) return;
      var conFoco = caja.contains(document.activeElement) || e.detail === 0;
      if (b.hasAttribute('data-volver')) { actual--; pintarPregunta(conFoco); return; }
      respuestas[actual] = b.getAttribute('data-v');
      b.setAttribute('aria-pressed', 'true');
      caja.classList.add('pasando');
      setTimeout(function () {
        caja.classList.remove('pasando');
        actual++;
        if (actual < PREGUNTAS.length) { pintarPregunta(conFoco); return; }
        /* Ya contestó todo: si dejó sus datos en esta visita, va directo al resultado */
        if (datos) { mostrarResultado(conFoco); return; }
        ga('diagnostico_rapido_datos', { pagina: PAGINA });
        mostrar(form);
        if (conFoco) $('rapido-datos-titulo').focus({ preventScroll: true });
      }, reducir ? 60 : 240);
    });

    /* --- 3) Datos: justo antes del resultado, explicando para qué --- */
    var nombreEl = $('rapido-nombre'), emailEl = $('rapido-email'), telEl = $('rapido-tel'), negocioEl = $('rapido-negocio'), error = $('rapido-error');
    try {
      nombreEl.value = sessionStorage.getItem('fn_nombre') || '';
      emailEl.value = sessionStorage.getItem('fn_email') || '';
    } catch (e) {}
    $('rapido-volver-preguntas').addEventListener('click', function () {
      actual = PREGUNTAS.length - 1;
      mostrar(caja);
      pintarPregunta(true);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = nombreEl.value.trim(), email = emailEl.value.trim(), tel = telEl.value.trim(), negocio = negocioEl.value.trim();
      [nombreEl, emailEl, telEl].forEach(function (el) { el.removeAttribute('aria-invalid'); });
      var mal = null, texto = '';
      if (!nombre) { mal = nombreEl; texto = 'Escribí tu nombre, así sabemos con quién hablamos.'; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mal = emailEl; texto = 'Revisá tu email: le falta algo o tiene un error.'; }
      else if (tel && tel.replace(/\D/g, '').length < 8) { mal = telEl; texto = 'Revisá tu WhatsApp: escribilo con característica, sin el 0 ni el 15. O dejalo vacío.'; }
      if (mal) {
        error.textContent = texto; error.hidden = false;
        mal.setAttribute('aria-invalid', 'true'); mal.focus();
        return;
      }
      error.hidden = true;
      datos = { nombre: nombre, email: email, tel: tel, negocio: negocio };
      try { sessionStorage.setItem('fn_nombre', nombre); sessionStorage.setItem('fn_email', email); } catch (err) {}
      mostrarResultado(true);
    });

    /* Al equipo: datos, perfil, respuestas y resultado (mismo formulario de Formspree que la guía) */
    function paraEquipo(d, v) {
      var fd = new FormData();
      var rol = respuesta('Rol'), personas = respuesta('Personas');
      var encaja = rol.indexOf('Soy dueño') === 0 || rol.indexOf('familiar') > -1;
      encaja = encaja && ['1 a 5', '6 a 15', '16 a 30'].indexOf(personas) > -1;
      fd.set('_subject', 'Diagnóstico rápido: ' + datos.nombre + (datos.negocio ? ' (' + datos.negocio + ')' : '') + ' — ' + d.titulo);
      fd.set('Nombre', datos.nombre);
      fd.set('email', datos.email);
      if (datos.tel) fd.set('WhatsApp', datos.tel);
      if (datos.negocio) fd.set('Negocio', datos.negocio);
      fd.set('Perfil', encaja ? 'Encaja: dueño de un negocio de 2 a 30 personas' : 'Revisar: ' + rol + ', ' + personas);
      fd.set('Resultado', d.titulo);
      fd.set('Etapa', ETAPAS[d.etapa].nombre + ' (' + d.suma + ' de 20)');
      fd.set('Por área', AREAS.map(function (a, i) { return a.corto + ' ' + v[i] + '/4'; }).join(', '));
      fd.set('Programa sugerido', PROGRAMAS[d.prog].texto);
      PREGUNTAS.forEach(function (p, i) { fd.set((i + 1 < 10 ? '0' : '') + (i + 1) + '. ' + (p.clave || p.q), respuestas[i] || ''); });
      fd.set('Origen', 'Diagnóstico rápido de la web (' + (PAGINA === 'home' ? 'home' : 'link directo') + ')');
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (u) {
        var x = utm(u); if (x) fd.set(u, x);
      });
      return fd;
    }

    /* --- 4) Resultado --- */
    function mostrarResultado(conFoco) {
      var v = valores(), d = diagnosticar(v);
      var nombre = datos.nombre.split(/\s+/)[0];
      mostrar(res);
      $('etapa-nombre').innerHTML = 'Listo, ' + escapar(nombre) + '. Tu etapa: <b>' + ETAPAS[d.etapa].nombre + '</b> · ' + d.suma + ' de 20';
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
      /* El mensaje que manda la persona: corto y en primera persona */
      var msg = 'Hola, soy ' + datos.nombre + '. Hice el diagnóstico de la web y ' + d.frase + '. Quiero agendar la llamada de asesoría personalizada.';
      $('rueda-wa').href = waUrl(msg);
      $('resumen-vivo').textContent = 'Resultado: ' + d.titulo + '. Etapa: ' + ETAPAS[d.etapa].nombre + '.';
      var aviso = $('rapido-aviso');
      aviso.textContent = 'Sin cargo. Te responde una persona del equipo, no un bot.';
      if (!enviado) {
        enviado = true;
        try {
          fetch('https://formspree.io/f/mredepgv', { method: 'POST', body: paraEquipo(d, v), headers: { 'Accept': 'application/json' } })
            .then(function (r) { if (r.ok) aviso.textContent = 'Tu resultado ya le llegó a nuestro equipo: la llamada va directo a lo que hay que hacer. Sin cargo.'; })
            .catch(function () {});
        } catch (e) {}
      }
      ga('diagnostico_rapido', { pagina: PAGINA, resultado: d.titulo, etapa: ETAPAS[d.etapa].nombre, puntaje: d.suma });
      if (conFoco) $('diag-titulo').focus({ preventScroll: true });
    }

    /* Otra vuelta: las preguntas de nuevo, con los mismos datos */
    $('rapido-otra').addEventListener('click', function () {
      respuestas = []; actual = 0;
      mostrar(caja);
      pintarPregunta(true);
    });

    /* Antes de terminar, el botón de WhatsApp igual lleva el mensaje base con el código del anuncio */
    $('rueda-wa').href = waUrl(MENSAJE);
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
