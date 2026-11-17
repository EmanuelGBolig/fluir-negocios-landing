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
     Embudo: 1) intro con el nombre completo, 2) 13 preguntas de un toque (la última, hasta 3 opciones),
     3) email (WhatsApp y negocio opcionales) antes del resultado, 4) resultado centrado en el problema
     de la persona y en lo que quiere lograr, con cómo la ayudamos y el WhatsApp para agendar la llamada.
     Las 10 preguntas de sí / en parte / no son dos por área: Administración, Equipo, Operaciones, Ventas
     y Proveedores (cada área de 0 a 4, total de 0 a 20). Las otras 3 salen del formulario "Punto de Partida".
     Lenguaje: claro y directo, sin metáforas. Todo le llega al equipo por Formspree (el mismo de la guía).
     No dispara Lead en el píxel: Lead es solo la guía.
     ===================================================================== */
  (function () {
    var tarjeta = $('rapido');
    if (!tarjeta) return;
    var intro = $('rapido-intro'), caja = $('rapido-preguntas'), form = $('rapido-datos'), res = $('rapido-resultado');
    var linkProg = $('diag-prog');

    var F = 0, O = 1, M = 2, E = 3, A = 4;
    var AREAS = [
      { corto: 'Administración', frena: 'es la administración', porque: 'con los números claros se ordena todo lo demás',
        titulo: 'No sabés cuánto gana tu negocio',
        dolor: 'Tomás decisiones sin saber cuánto te queda a fin de mes ni en qué se va la plata. Por eso podés vender más y no ver la ganancia.',
        pasos: ['Armá un estado de resultados por mes, con ingresos, costos y gastos fijos por separado.', 'Fijate un sueldo fijo y cobralo aparte de la plata del negocio.'],
        ayuda: 'En el M·A·R ordenamos con vos los números del negocio: el estado de resultados de cada mes, tu sueldo aparte y cuánto necesitás vender para no perder plata.' },
      { corto: 'Operaciones', frena: 'son las operaciones', porque: 'lo que está escrito se puede delegar',
        titulo: 'El trabajo sale bien solo si estás vos',
        dolor: 'Las tareas importantes no están escritas, entonces la calidad y los tiempos cambian cuando no estás. Cada error termina en tus manos.',
        pasos: ['Escribí paso a paso los 3 procesos más importantes del negocio.', 'Definí cómo se controla que el trabajo salió bien, sin que lo revises vos.'],
        ayuda: 'En el M·A·R escribimos con vos los procesos clave y armamos controles simples, para que el trabajo salga bien aunque no estés.' },
      { corto: 'Ventas', frena: 'son las ventas', porque: 'sin clientes nuevos el negocio no crece',
        titulo: 'No tenés una forma fija de conseguir clientes',
        dolor: 'Los clientes nuevos no llegan todos los meses. Por eso hay meses buenos y meses malos, y no sabés cuánto vas a facturar.',
        pasos: ['Elegí un solo canal para conseguir clientes y mantenelo durante varios meses.', 'Anotá por qué medio llega cada cliente nuevo.'],
        ayuda: 'En el M·A·R elegimos con vos un canal de ventas, lo ponemos en marcha y medimos sus resultados mes a mes.' },
      { corto: 'Equipo', frena: 'es el equipo', porque: 'si todo pasa por vos, no te queda tiempo para lo demás',
        titulo: 'Todo pasa por vos',
        dolor: 'Tu equipo te consulta antes de decidir. Por eso no podés faltar ni tomarte vacaciones sin que haya problemas.',
        pasos: ['Elegí un encargado y dale autoridad para decidir sobre el día a día.', 'Poné una regla: nadie trae un problema sin una posible solución.'],
        ayuda: 'En el M·A·R armamos con vos encargados y acuerdos claros, para que el negocio funcione cuando no estás.' },
      { corto: 'Proveedores', frena: 'son los proveedores', porque: 'es la mejora más rápida de hacer',
        titulo: 'Dependés de proveedores sin acuerdos claros',
        dolor: 'Sin acuerdos por escrito, los precios y los plazos cambian sin aviso. Si un proveedor falla, te quedás sin lo que necesitás para trabajar.',
        pasos: ['Acordá por escrito precios y plazos con tus 3 proveedores principales.', 'Conseguí un segundo proveedor para lo que no te puede faltar.'],
        ayuda: 'En el M·A·R revisamos con vos tus proveedores principales y armamos acuerdos por escrito.' }
    ];
    var SINO = ['Sí', 'En parte', 'No'];
    var VALOR = { 'Sí': 2, 'En parte': 1, 'No': 0 };
    var MAX_METAS = 3;
    /* Las metas, dichas a la persona en el resultado */
    var META_VOS = {
      'Ganar más con lo que vendo': 'ganar más con lo que vendés', 'Vender más': 'vender más', 'Tener más tiempo libre': 'tener más tiempo libre',
      'Un equipo que resuelva sin mí': 'tener un equipo que resuelva sin vos', 'Tener los números en orden': 'tener los números en orden',
      'Decidir con más claridad': 'decidir con más claridad'
    };
    /* Orden: del negocio (fácil de contestar) → cómo está hoy → qué quiere lograr */
    var PREGUNTAS = [
      { parte: 'Tu negocio', clave: 'Rol', q: '¿Cuál es tu rol en el negocio?',
        ops: ['Dueño, sin socios', 'Dueño, con socios', 'Negocio familiar', 'Encargado o gerente'] },
      { parte: 'Tu negocio', clave: 'Personas', q: '¿Cuántas personas trabajan con vos?',
        ops: ['Solo yo', '1 a 5', '6 a 15', '16 a 30', 'Más de 30'] },
      { area: F, q: '¿Sabés con exactitud cuánto ganó tu negocio el mes pasado?' },
      { area: E, q: '¿Hay alguien que resuelva los problemas del día sin consultarte?' },
      { area: O, q: '¿Los procesos importantes del negocio están escritos?' },
      { area: M, q: '¿Conseguís clientes nuevos todos los meses, además de los que llegan por recomendación?' },
      { area: A, q: '¿Tenés acuerdos por escrito con tus proveedores principales?' },
      { area: F, q: '¿Cobrás un sueldo fijo, separado de la plata del negocio?' },
      { area: E, q: '¿Podrías tomarte una semana de vacaciones y que el negocio siga funcionando?' },
      { area: O, q: '¿El trabajo sale bien cuando vos no estás?' },
      { area: M, q: '¿Sabés por qué medio llega cada cliente nuevo?' },
      { area: A, q: '¿Tenés un segundo proveedor para lo que no te puede faltar?' },
      { parte: 'Lo que buscás', clave: 'Quiere lograr', q: '¿Qué te gustaría lograr?', ayuda: 'Elegí hasta 3.', varias: true,
        ops: ['Ganar más con lo que vendo', 'Vender más', 'Tener más tiempo libre', 'Un equipo que resuelva sin mí', 'Tener los números en orden', 'Decidir con más claridad'] }
    ];
    /* Si hay dos áreas con el mismo puntaje, se empieza por la que ordena a las demás */
    var PRIORIDAD = [F, E, O, M, A];
    var ETAPAS = [
      { max: 6, nombre: 'Autoempleo' },
      { max: 11, nombre: 'En transición' },
      { max: 15, nombre: 'Empresa en formación' },
      { max: 20, nombre: 'Empresa autónoma' }
    ];
    var PROGRAMAS = {
      mar: { nombre: 'M·A·R', link: '/pages/mar.html' },
      cde: { nombre: 'C·D·E', link: '/pages/cde.html' },
      sistemas: { nombre: 'Fluir Sistemas', link: '/pages/sistemas.html' }
    };

    function lista(nombres) { return nombres.length < 2 ? nombres[0] : nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1]; }
    function escapar(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function minuscula(t) { return t.charAt(0).toLowerCase() + t.slice(1); }

    function diagnosticar(v) {
      var min = Math.min.apply(null, v), max = Math.max.apply(null, v);
      var suma = v.reduce(function (x, y) { return x + y; }, 0);
      var etapa = 0; while (suma > ETAPAS[etapa].max) etapa++;
      var flojos = PRIORIDAD.filter(function (i) { return v[i] === min; });
      var primero = flojos[0];
      var area = function (i, extra) {
        var a = AREAS[i];
        return { titulo: a.titulo, dolor: a.dolor, pasos: a.pasos, ayuda: a.ayuda, prog: 'mar', frase: 'lo que más me frena ' + a.frena };
      };
      var d;
      if (min >= 3) {
        d = { titulo: 'Tu negocio está ordenado: ahora toca crecer',
              dolor: 'Ninguna área está floja. Lo que falta es decidir dónde poner el esfuerzo para crecer sin perder el orden.',
              pasos: ['Elegí un solo objetivo de crecimiento para los próximos 6 meses.', 'Armá un tablero con los 5 números que el equipo revise cada semana.'],
              ayuda: 'Con Fluir Sistemas armamos tu tablero y automatizamos tareas repetidas, para crecer sin sumarte trabajo.',
              prog: 'sistemas', frase: 'tengo el negocio ordenado y quiero crecer' };
      } else if (max <= 1) {
        d = { titulo: 'Todo el negocio depende de vos',
              dolor: 'No hay números claros, procesos escritos ni alguien que decida en tu lugar. Por eso trabajás muchas horas y el negocio no avanza.',
              pasos: [AREAS[F].pasos[0], AREAS[E].pasos[0]],
              ayuda: 'En el M·A·R empezamos por los números y después armamos los procesos y el equipo, una etapa a la vez.',
              prog: 'mar', frase: 'hoy todo el negocio depende de mí' };
      } else if (v[M] >= 3 && v[F] <= 1) {
        d = area(F); d.titulo = 'Vendés, pero no sabés cuánto ganás';
        d.dolor = 'Entran clientes, pero no sabés cuánto te deja cada venta. Vender más no te asegura ganar más.';
      } else if (v[E] <= 1 && v[O] <= 1) {
        d = { titulo: 'Nada está escrito y todo pasa por vos',
              dolor: 'Los procesos no están escritos y nadie decide sin consultarte. Por eso no podés faltar ni un día.',
              pasos: [AREAS[O].pasos[0], AREAS[E].pasos[0]],
              ayuda: 'En el M·A·R escribimos con vos los procesos y armamos un equipo que decida, para que el negocio funcione sin vos.',
              prog: 'mar', frase: 'lo que más me frena son las operaciones y el equipo' };
      } else if (v[E] <= 1 && v[O] >= 3) {
        d = area(E); d.titulo = 'Hay procesos, pero te siguen consultando todo';
        d.dolor = 'Está escrito cómo se hace cada tarea, pero nadie tiene autoridad para decidir. Falta delegar.';
        d.ayuda = 'En el C·D·E capacitamos a tus encargados para que decidan y resuelvan sin consultarte.'; d.prog = 'cde';
      } else if (v[O] <= 1 && v[M] >= 3) {
        d = area(O); d.titulo = 'Vendés más de lo que podés atender bien';
        d.dolor = 'Entran clientes, pero la calidad depende de que estés vos. Cada venta nueva te suma trabajo.';
      } else if (v[F] >= 3 && v[M] <= 1) {
        d = area(M); d.titulo = 'Tenés los números en orden, pero te faltan clientes';
        d.dolor = 'Sabés cuánto ganás, pero los clientes nuevos no llegan todos los meses y la facturación sube y baja.';
      } else if (min === max) {
        d = { titulo: 'Todas las áreas están a la mitad',
              dolor: 'Ninguna área está mal, pero ninguna funciona sola. Conviene empezar por la administración, porque ' + AREAS[F].porque + '.',
              pasos: [AREAS[F].pasos[0], AREAS[E].pasos[0]],
              ayuda: 'En el M·A·R trabajamos con vos un área a la vez, empezando por los números del negocio.',
              prog: 'mar', frase: 'tengo todas las áreas a la mitad' };
      } else {
        d = area(primero);
        if (flojos.length > 1) {
          d.dolor += ' ' + lista(flojos.map(function (i) { return AREAS[i].corto; })) + ' tienen el mismo puntaje: conviene empezar por ' +
                     minuscula(AREAS[primero].corto) + ', porque ' + AREAS[primero].porque + '.';
        }
        if (primero === E && v[O] >= 2) { d.ayuda = 'En el C·D·E capacitamos a tus encargados para que decidan y resuelvan sin consultarte.'; d.prog = 'cde'; }
      }
      d.etapa = etapa; d.suma = suma; d.flojos = min >= 3 ? [] : flojos;
      return d;
    }

    var respuestas = [], actual = 0, datos = { nombre: '' }, conEmail = false, enviado = false;

    function valores() {
      var v = [0, 0, 0, 0, 0];
      PREGUNTAS.forEach(function (p, i) { if (p.area !== undefined) v[p.area] += VALOR[respuestas[i]] || 0; });
      return v;
    }
    function respuesta(clave) {
      for (var i = 0; i < PREGUNTAS.length; i++) if (PREGUNTAS[i].clave === clave) return respuestas[i] || '';
      return '';
    }
    function metas() { var m = respuesta('Quiere lograr'); return Array.isArray(m) ? m : []; }
    function primerNombre() { return datos.nombre.split(/\s+/)[0]; }
    function mostrar(el) {
      [intro, caja, form, res].forEach(function (x) { x.hidden = x !== el; });
      if (tarjeta.getBoundingClientRect().top < 0) tarjeta.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
    }

    /* --- 1) Intro: nombre completo --- */
    var nombreEl = $('rapido-nombre'), errorIntro = $('rapido-error-intro');
    intro.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = nombreEl.value.trim().replace(/\s+/g, ' ');
      if (!nombre) {
        errorIntro.textContent = 'Escribí tu nombre completo para empezar.';
        errorIntro.hidden = false; nombreEl.setAttribute('aria-invalid', 'true'); nombreEl.focus();
        return;
      }
      errorIntro.hidden = true; nombreEl.removeAttribute('aria-invalid');
      datos.nombre = nombre;
      try { sessionStorage.setItem('fn_nombre', nombre); } catch (err) {}
      ga('diagnostico_rapido_inicio', { pagina: PAGINA });
      actual = 0;
      mostrar(caja);
      pintarPregunta(true);
    });

    /* --- 2) Preguntas, de a una --- */
    function pintarPregunta(conFoco) {
      var p = PREGUNTAS[actual];
      var ops = p.ops || SINO;
      var elegidas = p.varias ? (Array.isArray(respuestas[actual]) ? respuestas[actual] : []) : [];
      var segmentos = PREGUNTAS.map(function (x, i) {
        return '<i class="' + (i < actual ? 'hecha' : (i === actual ? 'actual' : '')) + '"></i>';
      }).join('');
      var aviso = actual === 0 ? 'Hola, ' + escapar(primerNombre()) + '. Primero, dos preguntas sobre tu negocio.' :
                  actual === 2 ? 'Ahora, cómo está tu negocio hoy. Respondé lo primero que pienses.' :
                  (p.varias ? 'Última pregunta.' : '');
      caja.innerHTML =
        '<div class="rapido__arriba"><p class="rapido__paso">Pregunta <b>' + (actual + 1) + '</b> de ' + PREGUNTAS.length + '</p>' +
        '<p class="rapido__area">' + (p.area !== undefined ? AREAS[p.area].corto : p.parte) + '</p></div>' +
        '<div class="rapido__progreso" aria-hidden="true">' + segmentos + '</div>' +
        (aviso ? '<p class="rapido__animo">' + aviso + '</p>' : '') +
        '<div class="rapido__pregunta entra" role="group" aria-labelledby="rapido-q"' + (p.ayuda ? ' aria-describedby="rapido-q-ayuda"' : '') + '>' +
          '<p class="rapido__q" id="rapido-q" tabindex="-1">' + p.q + (p.ayuda ? ' <span id="rapido-q-ayuda">' + p.ayuda + '</span>' : '') + '</p>' +
          '<div class="rapido__opciones' + (p.ops ? ' rapido__opciones--lista' : '') + '">' + ops.map(function (o) {
            var marcada = p.varias ? elegidas.indexOf(o) > -1 : respuestas[actual] === o;
            var bloqueada = p.varias && !marcada && elegidas.length >= MAX_METAS;
            return '<button type="button" data-v="' + escapar(o) + '" aria-pressed="' + (marcada ? 'true' : 'false') + '"' + (bloqueada ? ' disabled' : '') + '>' + o + '</button>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="rapido__pie">' +
          (actual > 0 ? '<button class="rapido__volver" type="button" data-volver>Volver a la anterior</button>' : '<span></span>') +
          (p.varias ? '<button class="boton rapido__seguir" type="button" id="rapido-seguir" data-seguir' + (elegidas.length ? '' : ' disabled') + '>Seguir</button>' : '') +
        '</div>';
      if (conFoco) $('rapido-q').focus({ preventScroll: true });
    }

    function siguiente(conFoco) {
      actual++;
      if (actual < PREGUNTAS.length) { pintarPregunta(conFoco); return; }
      /* Ya contestó todo: si dejó su email en esta visita, va directo al resultado */
      if (conEmail) { mostrarResultado(conFoco); return; }
      ga('diagnostico_rapido_datos', { pagina: PAGINA });
      $('rapido-datos-titulo').textContent = 'Tu resultado está listo, ' + primerNombre();
      mostrar(form);
      if (conFoco) $('rapido-datos-titulo').focus({ preventScroll: true });
    }

    caja.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled || caja.classList.contains('pasando')) return;
      var conFoco = caja.contains(document.activeElement) || e.detail === 0;
      var p = PREGUNTAS[actual];
      if (b.hasAttribute('data-volver')) { actual--; pintarPregunta(conFoco); return; }
      if (b.hasAttribute('data-seguir')) { siguiente(conFoco); return; }
      var valor = b.getAttribute('data-v');
      if (p.varias) {
        /* Hasta 3 opciones: se marcan y desmarcan; "Seguir" avanza */
        var elegidas = Array.isArray(respuestas[actual]) ? respuestas[actual].slice() : [];
        var k = elegidas.indexOf(valor);
        if (k > -1) elegidas.splice(k, 1); else if (elegidas.length < MAX_METAS) elegidas.push(valor);
        respuestas[actual] = elegidas;
        var botones = caja.querySelectorAll('.rapido__opciones button');
        [].forEach.call(botones, function (x) {
          var on = elegidas.indexOf(x.getAttribute('data-v')) > -1;
          x.setAttribute('aria-pressed', on ? 'true' : 'false');
          x.disabled = !on && elegidas.length >= MAX_METAS;
        });
        $('rapido-seguir').disabled = !elegidas.length;
        return;
      }
      respuestas[actual] = valor;
      b.setAttribute('aria-pressed', 'true');
      caja.classList.add('pasando');
      setTimeout(function () {
        caja.classList.remove('pasando');
        siguiente(conFoco);
      }, reducir ? 60 : 240);
    });

    /* --- 3) Datos: email antes del resultado, explicando para qué --- */
    var emailEl = $('rapido-email'), telEl = $('rapido-tel'), negocioEl = $('rapido-negocio'), error = $('rapido-error');
    try {
      nombreEl.value = sessionStorage.getItem('fn_nombre') || '';
      emailEl.value = sessionStorage.getItem('fn_email') || '';
    } catch (e) {}
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailEl.value.trim(), tel = telEl.value.trim(), negocio = negocioEl.value.trim();
      [emailEl, telEl].forEach(function (el) { el.removeAttribute('aria-invalid'); });
      var mal = null, texto = '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mal = emailEl; texto = 'Revisá tu email: le falta algo o tiene un error.'; }
      else if (tel && tel.replace(/\D/g, '').length < 8) { mal = telEl; texto = 'Revisá tu WhatsApp: escribilo con el código de área, sin el 0 ni el 15. O dejalo vacío.'; }
      if (mal) {
        error.textContent = texto; error.hidden = false;
        mal.setAttribute('aria-invalid', 'true'); mal.focus();
        return;
      }
      error.hidden = true;
      datos.email = email; datos.tel = tel; datos.negocio = negocio; conEmail = true;
      try { sessionStorage.setItem('fn_email', email); } catch (err) {}
      mostrarResultado(true);
    });

    /* Al equipo: datos, perfil, respuestas y resultado (mismo formulario de Formspree que la guía) */
    function paraEquipo(d, v) {
      var fd = new FormData();
      var rol = respuesta('Rol'), personas = respuesta('Personas');
      var encaja = rol.indexOf('Dueño') === 0 || rol.indexOf('familiar') > -1;
      encaja = encaja && ['1 a 5', '6 a 15', '16 a 30'].indexOf(personas) > -1;
      fd.set('_subject', 'Diagnóstico rápido: ' + datos.nombre + (datos.negocio ? ' (' + datos.negocio + ')' : '') + ' — ' + d.titulo);
      fd.set('Nombre', datos.nombre);
      fd.set('email', datos.email);
      if (datos.tel) fd.set('WhatsApp', datos.tel);
      if (datos.negocio) fd.set('Negocio', datos.negocio);
      fd.set('Perfil', encaja ? 'Encaja: dueño de un negocio de 2 a 30 personas' : 'Revisar: ' + rol + ', ' + personas);
      fd.set('Resultado', d.titulo);
      fd.set('Quiere lograr', metas().join(', '));
      fd.set('Etapa', ETAPAS[d.etapa].nombre + ' (' + d.suma + ' de 20)');
      fd.set('Por área', AREAS.map(function (a, i) { return a.corto + ' ' + v[i] + '/4'; }).join(', '));
      fd.set('Programa sugerido', PROGRAMAS[d.prog].nombre);
      PREGUNTAS.forEach(function (p, i) {
        var r = respuestas[i];
        fd.set((i + 1 < 10 ? '0' : '') + (i + 1) + '. ' + (p.clave || p.q), Array.isArray(r) ? r.join(', ') : (r || ''));
      });
      fd.set('Origen', 'Diagnóstico rápido de la web (' + (PAGINA === 'home' ? 'home' : 'link directo') + ')');
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (u) {
        var x = utm(u); if (x) fd.set(u, x);
      });
      return fd;
    }

    /* --- 4) Resultado: su problema, lo que quiere lograr, por dónde empezar y cómo lo ayudamos --- */
    function mostrarResultado(conFoco) {
      var v = valores(), d = diagnosticar(v);
      var m = metas();
      mostrar(res);
      $('rapido-hola').textContent = 'Listo, ' + primerNombre() + '. Esto es lo que más te frena hoy:';
      $('diag-titulo').textContent = d.titulo;
      $('diag-texto').textContent = d.dolor + (m.length ? ' Querés ' + lista(m.map(function (x) { return META_VOS[x] || minuscula(x); })) + ': para lograrlo, lo primero es resolver esto.' : '');
      $('diag-pasos').innerHTML = d.pasos.map(function (t) { return '<li>' + t + '</li>'; }).join('');
      var prog = PROGRAMAS[d.prog];
      /* El texto se reescribe entero: el link al programa se vuelve a sumar al final */
      $('rapido-ayuda').textContent = d.ayuda + ' ';
      linkProg.textContent = 'Conocé ' + (d.prog === 'sistemas' ? '' : 'el ') + prog.nombre;
      linkProg.href = prog.link;
      $('rapido-ayuda').appendChild(linkProg);
      /* El mensaje que manda la persona: corto y en primera persona */
      var msg = 'Hola, soy ' + datos.nombre + '. Hice el diagnóstico de la web y ' + d.frase + '. Quiero agendar la llamada de asesoría personalizada.';
      $('rueda-wa').href = waUrl(msg);
      $('resumen-vivo').textContent = 'Resultado: ' + d.titulo + '.';
      var aviso = $('rapido-aviso');
      aviso.textContent = 'Sin cargo. Te responde una persona del equipo.';
      if (!enviado) {
        enviado = true;
        try {
          fetch('https://formspree.io/f/mredepgv', { method: 'POST', body: paraEquipo(d, v), headers: { 'Accept': 'application/json' } })
            .then(function (r) { if (r.ok) aviso.textContent = 'Tu resultado ya le llegó a nuestro equipo. Sin cargo.'; })
            .catch(function () {});
        } catch (e) {}
      }
      ga('diagnostico_rapido', { pagina: PAGINA, resultado: d.titulo, etapa: ETAPAS[d.etapa].nombre, puntaje: d.suma });
      if (conFoco) $('diag-titulo').focus({ preventScroll: true });
      /* El resultado es más largo: se baja hasta el principio de la tarjeta para verlo entero */
      var arriba = tarjeta.getBoundingClientRect().top;
      if (arriba > 12 || arriba < 0) window.scrollTo({ top: scrollY + arriba - 12, behavior: reducir ? 'auto' : 'smooth' });
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
