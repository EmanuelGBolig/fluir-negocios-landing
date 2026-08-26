/* ============================================================
   MARTÍN TRONCOSO — Línea de tiempo horizontal
   Vanilla JS, sin dependencias.

   PARA COMPLETAR: todo el contenido vive en el array HITOS de acá abajo.
   No hace falta tocar nada más.

   Cada hito:
     anio      texto del eje (string, para poder poner "2013" o "2016-2018")
     titulo    título corto del hito
     texto     2 o 3 líneas contando qué pasó
     media     { tipo: 'imagen' | 'video', src, poster, alt }
                 - tipo 'imagen'  -> src es la foto
                 - tipo 'video'   -> src es el mp4 y poster la miniatura
     pendiente true mientras la foto/video sea de muestra (muestra un aviso
               sobre la media). Sacar cuando se cargue el archivo real.
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
            // borrador: false — este hito es real (dato del propio Martín)
        },
        {
            anio: '2014',
            titulo: 'Los primeros entrenamientos',
            texto: 'Reemplazar por el hito real de este año: qué entrenamiento dio, con quién se formó o qué aprendió.',
            media: { tipo: 'imagen', src: '../assets/carousel/hero-3.webp', alt: 'Entrenamiento' },
            pendiente: true,
            borrador: true
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
    if (!raiz || !HITOS.length) return;

    var elAnios = raiz.querySelector('#tlAnios');
    var elCarril = raiz.querySelector('#tlCarril');
    var elAvance = raiz.querySelector('#tlAvance');
    var elPos = raiz.querySelector('#tlPos');
    var activo = 0;

    function esc(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function media(h) {
        var m = h.media || {};
        var aviso = h.pendiente
            ? '<span class="tl-media-aviso"><i data-lucide="image"></i> Material de muestra</span>'
            : '';

        // Video sin archivo todavía: se muestra la maqueta, no un <video> roto.
        if (m.tipo === 'video' && !m.src) {
            return '<div class="tl-media tl-media--video-vacio">' +
                (m.poster ? '<img src="' + esc(m.poster) + '" alt="' + esc(m.alt || '') + '" loading="lazy">' : '') +
                '<span class="tl-play" aria-hidden="true"><i data-lucide="play"></i></span>' +
                '<span class="tl-media-aviso"><i data-lucide="video"></i> Video pendiente</span>' +
                '</div>';
        }
        if (m.tipo === 'video') {
            return '<div class="tl-media">' +
                '<video class="tl-video" controls preload="none" playsinline' +
                (m.poster ? ' poster="' + esc(m.poster) + '"' : '') + '>' +
                '<source src="' + esc(m.src) + '" type="video/mp4">' +
                'Tu navegador no puede reproducir el video.' +
                '</video>' + aviso + '</div>';
        }
        return '<div class="tl-media">' +
            '<img src="' + esc(m.src) + '" alt="' + esc(m.alt || h.titulo) + '" loading="lazy">' +
            aviso + '</div>';
    }

    function pintar() {
        elAnios.innerHTML = HITOS.map(function (h, i) {
            return '<button type="button" class="tl-anio" role="tab" data-i="' + i + '" ' +
                'aria-selected="' + (i === 0) + '" aria-controls="tl-card-' + i + '">' +
                '<span class="tl-punto" aria-hidden="true"></span>' +
                '<span class="tl-anio-txt">' + esc(h.anio) + '</span></button>';
        }).join('');

        elCarril.innerHTML = HITOS.map(function (h, i) {
            return '<article class="tl-card" id="tl-card-' + i + '" data-i="' + i + '" role="tabpanel">' +
                media(h) +
                '<div class="tl-cuerpo">' +
                '<div class="tl-cuerpo-top">' +
                '<span class="tl-card-anio">' + esc(h.anio) + '</span>' +
                (h.borrador ? '<span class="tl-chapa">Por completar</span>' : '') +
                '</div>' +
                '<h4 class="tl-card-titulo">' + esc(h.titulo) + '</h4>' +
                '<p class="tl-card-texto">' + esc(h.texto) + '</p>' +
                '</div></article>';
        }).join('');

        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }

    function marcar(i) {
        activo = Math.max(0, Math.min(HITOS.length - 1, i));
        var btns = elAnios.querySelectorAll('.tl-anio');
        for (var k = 0; k < btns.length; k++) {
            var act = k === activo;
            btns[k].classList.toggle('es-activo', act);
            btns[k].classList.toggle('es-hecho', k < activo);
            btns[k].setAttribute('aria-selected', act);
        }
        var cards = elCarril.querySelectorAll('.tl-card');
        for (var c = 0; c < cards.length; c++) cards[c].classList.toggle('es-activo', c === activo);

        if (elAvance) {
            var pct = HITOS.length > 1 ? (activo / (HITOS.length - 1)) * 100 : 100;
            elAvance.style.width = pct + '%';
        }
        if (elPos) elPos.textContent = (activo + 1) + ' / ' + HITOS.length;

        var prev = raiz.querySelector('[data-dir="-1"]');
        var next = raiz.querySelector('[data-dir="1"]');
        if (prev) prev.disabled = activo === 0;
        if (next) next.disabled = activo === HITOS.length - 1;
    }

    function irA(i, suave) {
        var card = elCarril.querySelector('.tl-card[data-i="' + i + '"]');
        if (!card) return;
        // scrollLeft manual: scrollIntoView arrastraría toda la página.
        elCarril.scrollTo({ left: card.offsetLeft - elCarril.offsetLeft, behavior: suave === false ? 'auto' : 'smooth' });
        marcar(i);
    }

    pintar();
    marcar(0);

    elAnios.addEventListener('click', function (e) {
        var b = e.target.closest('.tl-anio');
        if (b) irA(parseInt(b.getAttribute('data-i'), 10));
    });

    raiz.addEventListener('click', function (e) {
        var n = e.target.closest('[data-dir]');
        if (n && !n.disabled) irA(activo + parseInt(n.getAttribute('data-dir'), 10));
    });

    // Sincronizar el eje cuando se scrollea el carril a mano (o con el trackpad).
    var t = null;
    elCarril.addEventListener('scroll', function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
            var cards = elCarril.querySelectorAll('.tl-card');
            var centro = elCarril.scrollLeft + elCarril.clientWidth / 2;
            var mejor = 0, dist = Infinity;
            for (var i = 0; i < cards.length; i++) {
                var c = cards[i];
                var d = Math.abs((c.offsetLeft - elCarril.offsetLeft) + c.offsetWidth / 2 - centro);
                if (d < dist) { dist = d; mejor = i; }
            }
            if (mejor !== activo) marcar(mejor);
        }, 90);
    }, { passive: true });

    elCarril.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); irA(activo + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); irA(activo - 1); }
    });

    // Al cambiar el ancho cambian las tarjetas: hay que volver a alinear,
    // si no el carril queda entre dos hitos.
    var rt = null;
    window.addEventListener('resize', function () {
        if (rt) clearTimeout(rt);
        rt = setTimeout(function () { irA(activo, false); }, 120);
    });

    // Arrastrar con el mouse, como en mobile.
    var arrastrando = false, x0 = 0, s0 = 0, movio = false;
    elCarril.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch') return; // el touch nativo ya funciona
        if (e.target.closest('video, button, a')) return;
        arrastrando = true; movio = false;
        x0 = e.clientX; s0 = elCarril.scrollLeft;
        elCarril.classList.add('es-arrastrando');
    });
    window.addEventListener('pointermove', function (e) {
        if (!arrastrando) return;
        var d = e.clientX - x0;
        if (Math.abs(d) > 3) movio = true;
        elCarril.scrollLeft = s0 - d;
    });
    window.addEventListener('pointerup', function () {
        if (!arrastrando) return;
        arrastrando = false;
        elCarril.classList.remove('es-arrastrando');
        if (movio) irA(activo);
    });
})();
