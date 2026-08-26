/* ============================================================
   MARTÍN TRONCOSO — Línea de tiempo como escena anclada
   GSAP + ScrollTrigger (ambos gratis, desde el CDN oficial).

   La sección se clava en pantalla y, a medida que se scrollea, cada
   etapa entra desde la derecha tapando a la anterior, hasta la última.

   PARA COMPLETAR: todo el contenido vive en el array HITOS de acá abajo.
   No hace falta tocar nada más.

   CADENCIA: la linea va cada 2 anios, no anio por anio. La unica excepcion
   es el salto 2013 -> 2016, porque los dos son fechas reales (el arranque
   como coach y la apertura de Fluir Coaching) y no se pueden mover.
   Al sumar hitos, respetar el paso de 2 anios.

   Cada hito:
     anio      texto del eje (string: sirve "2013" o "2016-2018")
     titulo    título corto del hito
     texto     2 o 3 líneas contando qué pasó
     media     { tipo: 'imagen' | 'video', src, poster, alt }
                 - 'imagen' -> src es la foto
                 - 'video'  -> src es el mp4 y poster la miniatura
                              (si src está vacío se dibuja la maqueta)
     pendiente true mientras la foto/video sea de muestra. Muestra el
               aviso "Material de muestra" sobre la imagen.
     borrador  true mientras el texto sea inventado. Muestra la chapa
               "Por completar". Sacar cuando el hito sea el real.
   ============================================================ */
(function () {
    'use strict';

    var HITOS = [
        {
            anio: '2013',
            titulo: 'El primer paso como coach',
            texto: 'Empieza a trabajar como coach en una empresa de coaching ontológico. El primer contacto con el oficio que después iba a convertirse en su profesión.',
            media: { tipo: 'imagen', src: '../assets/carousel/hero-2.webp', alt: 'Martín Troncoso en sus primeros años como coach' },
            pendiente: true
            // real: dato del propio Martín
        },
        {
            anio: '2016',
            titulo: 'Nace Fluir Coaching',
            texto: 'Abre Fluir Coaching sin saber nada de administración, marketing ni ventas. Solo con amor por el servicio. Los errores vinieron después, de todos los tamaños.',
            media: { tipo: 'imagen', src: '../assets/carousel/Fluir_foto-490.webp', alt: 'Los comienzos de Fluir Coaching' },
            pendiente: true
            // real: sale del "Sobre mí" de esta misma página
        },
        {
            anio: '2018',
            titulo: 'La primera sede',
            texto: 'Reemplazar por el hito real: cuándo fue la primera sede, dónde y qué significó dejar de trabajar en espacios prestados.',
            media: { tipo: 'imagen', src: '../assets/carousel/hero-4.webp', alt: 'La primera sede de Fluir' },
            pendiente: true,
            borrador: true
        },
        {
            anio: '2020',
            titulo: 'La primera graduación',
            texto: 'Reemplazar por el hito real: la primera camada que terminó el proceso completo y qué cambió a partir de ahí.',
            media: { tipo: 'video', src: '', poster: '../assets/carousel/hero-5.webp', alt: 'La primera graduación' },
            pendiente: true,
            borrador: true
        },
        {
            anio: '2022',
            titulo: 'El equipo crece',
            texto: 'Reemplazar por el hito real: cuándo dejó de estar solo, quiénes se sumaron y cómo cambió su rol al pasar de hacer a conducir.',
            media: { tipo: 'imagen', src: '../assets/carousel/hero-2.webp', alt: 'El equipo de Fluir' },
            pendiente: true,
            borrador: true
        },
        {
            anio: '2024',
            titulo: 'Nace Fluir Negocios',
            texto: 'Reemplazar por el hito real: en qué año arrancó Fluir Negocios y por qué hizo falta separarlo de Fluir Coaching.',
            media: { tipo: 'imagen', src: '../assets/carousel/hero-3.webp', alt: 'Fluir Negocios' },
            pendiente: true,
            borrador: true
        },
        {
            anio: '2026',
            titulo: 'Diez años de Fluir',
            texto: 'Hoy acompaña a dueños de negocios y emprendedores a hacer el mismo salto que hizo él: de dueño a líder. Con claridad, mejores decisiones y ganas de volver a disfrutar el negocio.',
            media: { tipo: 'imagen', src: '../assets/carousel/Fluir_foto-490.webp', alt: 'Martín Troncoso hoy' },
            pendiente: true
            // real: "Hoy, 10 años después" del "Sobre mí"
        }
    ];

    /* ------------------------------------------------------------
       De acá para abajo es la mecánica: no hace falta tocarla.
       ------------------------------------------------------------ */
    var raiz = document.getElementById('tl');
    if (!raiz || HITOS.length < 2) return;

    var elEscena = raiz.querySelector('#tlEscena');
    var elAnios = raiz.querySelector('#tlAnios');
    var elAvance = raiz.querySelector('#tlAvance');
    var elFijo = raiz.querySelector('.tl2-fijo');

    function esc(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function media(h) {
        var m = h.media || {};
        var aviso = h.pendiente
            ? '<span class="tl2-aviso"><i data-lucide="image"></i> Material de muestra</span>'
            : '';

        // Video sin archivo: se dibuja la maqueta, no un <video> que da 404.
        if (m.tipo === 'video' && !m.src) {
            return '<div class="tl2-media tl2-media--video-vacio">' +
                (m.poster ? '<img src="' + esc(m.poster) + '" alt="' + esc(m.alt || '') + '" loading="lazy">' : '') +
                '<span class="tl2-play" aria-hidden="true"><i data-lucide="play"></i></span>' +
                '<span class="tl2-aviso"><i data-lucide="video"></i> Video pendiente</span>' +
                '</div>';
        }
        if (m.tipo === 'video') {
            return '<div class="tl2-media">' +
                '<video class="tl2-video" controls preload="none" playsinline' +
                (m.poster ? ' poster="' + esc(m.poster) + '"' : '') + '>' +
                '<source src="' + esc(m.src) + '" type="video/mp4">' +
                'Tu navegador no puede reproducir el video.' +
                '</video>' + aviso + '</div>';
        }
        return '<div class="tl2-media">' +
            '<img src="' + esc(m.src) + '" alt="' + esc(m.alt || h.titulo) + '" loading="lazy">' +
            aviso + '</div>';
    }

    elEscena.innerHTML = HITOS.map(function (h, i) {
        return '<article class="tl2-etapa" data-i="' + i + '" style="z-index:' + (i + 1) + '">' +
            media(h) +
            '<div class="tl2-texto">' +
            '<div class="tl2-texto-top">' +
            '<span class="tl2-anio">' + esc(h.anio) + '</span>' +
            (h.borrador ? '<span class="tl2-chapa">Por completar</span>' : '') +
            '</div>' +
            '<h4 class="tl2-etapa-titulo">' + esc(h.titulo) + '</h4>' +
            '<p class="tl2-etapa-texto">' + esc(h.texto) + '</p>' +
            '</div>' +
            '<span class="tl2-etapa-tapa" aria-hidden="true"></span>' +
            '</article>';
    }).join('');

    elAnios.innerHTML = HITOS.map(function (h, i) {
        return '<button type="button" class="tl2-anio-btn" data-i="' + i + '" ' +
            'aria-label="Ir a ' + esc(h.anio) + ': ' + esc(h.titulo) + '">' +
            '<span class="tl2-punto" aria-hidden="true"></span>' +
            '<span class="tl2-anio-txt">' + esc(h.anio) + '</span></button>';
    }).join('');

    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();

    var botones = elAnios.querySelectorAll('.tl2-anio-btn');
    var etapas = elEscena.querySelectorAll('.tl2-etapa');
    var N = HITOS.length;

    var indiceActual = 0;

    function marcar(p) {
        var idx = Math.round(p * (N - 1));
        indiceActual = idx;
        for (var i = 0; i < botones.length; i++) {
            botones[i].classList.toggle('es-activo', i === idx);
            botones[i].classList.toggle('es-hecho', i < idx);
        }
        if (elAvance) elAvance.style.width = (p * 100).toFixed(2) + '%';
        raiz.classList.toggle('es-andando', p > 0.02);

        var atras = raiz.querySelector('[data-dir="-1"]');
        var adelante = raiz.querySelector('[data-dir="1"]');
        if (atras) atras.disabled = idx <= 0;
        if (adelante) adelante.disabled = idx >= N - 1;
    }

    var sinMovimiento = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sin GSAP o con movimiento reducido: el CSS ya deja las etapas
    // apiladas en vertical y legibles. No se anima nada.
    if (sinMovimiento || typeof window.gsap === 'undefined' || !window.ScrollTrigger) {
        raiz.classList.add('es-estatico');
        return;
    }

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    var ST = window.ScrollTrigger;

    // En mobile, mostrar/ocultar la barra de direcciones cambia el alto del
    // viewport y dispara un refresh que hace saltar el pin. Esto lo ignora.
    ST.config({ ignoreMobileResize: true });

    // Cuanto scroll ocupa pasar de una etapa a la siguiente.
    // Con 0.85 de pantalla por etapa el recorrido daba 5.9 pantallas: el 25%
    // de la pagina entera clavada, y se sentia trabada. Se acota a px fijos
    // para que en monitores altos no crezca al pedo.
    function pasoPx() {
        // clientWidth y no innerWidth, para que el corte caiga exacto en el
        // mismo punto que el @media (max-width: 860px) del CSS.
        if (document.documentElement.clientWidth <= 860) return 240;
        return Math.min(window.innerHeight * 0.45, 340);
    }

    var linea = gsap.timeline({
        scrollTrigger: {
            trigger: raiz,
            start: 'top top',
            end: function () { return '+=' + (N - 1) * pasoPx(); },
            pin: elFijo,
            pinSpacing: true,
            // scrub true y no un numero: sigue al scroll sin lag agregado.
            scrub: true,
            // Evita el salto al entrar al pin scrolleando rapido.
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) { marcar(self.progress); }
        }
    });

    // Cada etapa entra desde la derecha; la anterior retrocede un poco y se
    // oscurece, para que se lea como que queda tapada abajo.
    for (var i = 1; i < N; i++) {
        linea.fromTo(etapas[i],
            { xPercent: 100 },
            { xPercent: 0, ease: 'none', duration: 1 }, i - 1);
        linea.fromTo(etapas[i - 1],
            { xPercent: 0, scale: 1 },
            { xPercent: -14, scale: 0.94, ease: 'none', duration: 1 }, i - 1);
        linea.fromTo(etapas[i - 1].querySelector('.tl2-etapa-tapa'),
            { opacity: 0 },
            { opacity: 0.35, ease: 'none', duration: 1 }, i - 1);
    }

    marcar(0);

    /* Ir a una etapa. Como el recorrido lo maneja el scroll, "ir" es
       scrollear a la posicion que le corresponde a esa etapa dentro del pin. */
    function irAEtapa(i) {
        i = Math.max(0, Math.min(N - 1, i));
        var st = linea.scrollTrigger;
        if (!st) return;
        var destino = st.start + (st.end - st.start) * (i / (N - 1));
        window.scrollTo({ top: destino, behavior: 'smooth' });
        marcar(i / (N - 1));
    }

    elAnios.addEventListener('click', function (e) {
        var b = e.target.closest('.tl2-anio-btn');
        if (b) irAEtapa(parseInt(b.getAttribute('data-i'), 10));
    });

    raiz.addEventListener('click', function (e) {
        var f = e.target.closest('.tl2-flecha');
        if (f && !f.disabled) irAEtapa(indiceActual + parseInt(f.getAttribute('data-dir'), 10));
    });

    // Flechas del teclado cuando la seccion esta en pantalla.
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var r = raiz.getBoundingClientRect();
        if (r.top > 0 || r.bottom < window.innerHeight) return; // no esta clavada
        if (e.target.closest('input, textarea, select')) return;
        e.preventDefault();
        irAEtapa(indiceActual + (e.key === 'ArrowRight' ? 1 : -1));
    });

    // Las imágenes entran con lazy load y cambian el alto: hay que recalcular.
    window.addEventListener('load', function () { ST.refresh(); });
})();
