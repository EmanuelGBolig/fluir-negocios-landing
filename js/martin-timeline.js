/* ============================================================
   MARTÍN TRONCOSO — Línea de tiempo como escena anclada
   GSAP + ScrollTrigger (ambos gratis, desde el CDN oficial).

   La sección se clava en pantalla y, a medida que se scrollea, cada
   diapositiva entra desde la derecha tapando a la anterior.

   Las diapositivas salen del diseño de Canva "Foto: quitar gruas y ajustar
   brillo" (8 paginas, 1800x1200) y ocupan la mitad izquierda de la tarjeta.
   Van con object-fit contain sobre fondo azul: son 3:2 y esa mitad es mas
   cuadrada, asi que recortarlas arruinaria el collage.
   Sin año: el eje quedo como puntos de posicion.

   PARA ACTUALIZAR: reexportar del Canva y reemplazar los archivos de
   assets/timeline/ con el mismo nombre. Los .mp4 salen de exportar la
   pagina como MP4 (horizontal_1080p) y despues comprimir:
     ffmpeg -i entrada.mp4 -vf scale=1440:-2 -c:v libx264 -preset slow             -crf 27 -c:a aac -b:a 96k -movflags +faststart salida.mp4

   Cada hito:
     titulo   el titulo que se ve a la derecha de la diapositiva
     texto    2 o 3 lineas contando la etapa. PENDIENTE: lo completan
              Martin y el equipo; mientras tanto lleva borrador: true
     borrador true mientras el texto sea de relleno. Muestra la chapa
              "Por completar". Sacar cuando el texto sea el real.
     media    { tipo: 'imagen' | 'video', src, poster }
   ============================================================ */
(function () {
    'use strict';

    var BASE = '../assets/timeline/';

    var HITOS = [
        { titulo: 'Mis primeros entrenamientos como coach',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'imagen', src: BASE + 'slide-01.jpg' } },
        { titulo: 'Nace Fluir Coaching, mi primera empresa y su primera sede',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'imagen', src: BASE + 'slide-02.jpg' } },
        { titulo: 'Entrenamiento Senderos de Fuego a través de los años',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'imagen', src: BASE + 'slide-03.jpg' } },
        { titulo: 'Nos mudamos a una nueva y mejor sede',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'video', src: BASE + 'slide-04.mp4', poster: BASE + 'slide-04.jpg' } },
        { titulo: 'Contratación internacional: Quito, Ecuador',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'imagen', src: BASE + 'slide-05.jpg' } },
        { titulo: 'Sede actual',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'video', src: BASE + 'slide-06.mp4', poster: BASE + 'slide-06.jpg' } },
        { titulo: 'Tomando formación en empresas y negocios en España',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'video', src: BASE + 'slide-07.mp4', poster: BASE + 'slide-07.jpg' } },
        { titulo: 'Multiverso Fluir y Martín',
          texto: 'Completar con Martín: qué pasó en esta etapa, en dos o tres líneas.', borrador: true,
          media: { tipo: 'video', src: BASE + 'slide-08.mp4', poster: BASE + 'slide-08.jpg' } }
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
        if (m.tipo === 'video') {
            return '<video class="tl2-video" controls preload="none" playsinline' +
                (m.poster ? ' poster="' + esc(m.poster) + '"' : '') + '>' +
                '<source src="' + esc(m.src) + '" type="video/mp4">' +
                'Tu navegador no puede reproducir el video.' +
                '</video>';
        }
        return '<img src="' + esc(m.src) + '" alt="' + esc(h.titulo) + '" loading="lazy">';
    }

    var ICONO_EXPANDIR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>';

    elEscena.innerHTML = HITOS.map(function (h, i) {
        return '<article class="tl2-etapa" data-i="' + i + '" style="z-index:' + (i + 1) + '">' +
            '<div class="tl2-media">' + media(h) +
            '<button type="button" class="tl2-expandir" data-expandir="' + i + '" ' +
            'aria-label="Ampliar: ' + esc(h.titulo) + '">' + ICONO_EXPANDIR + '</button>' +
            '</div>' +
            '<div class="tl2-texto">' +
            (h.borrador ? '<div class="tl2-texto-top"><span class="tl2-chapa">Por completar</span></div>' : '') +
            '<h4 class="tl2-etapa-titulo">' + esc(h.titulo) + '</h4>' +
            '<p class="tl2-etapa-texto">' + esc(h.texto) + '</p>' +
            '</div>' +
            '<span class="tl2-etapa-tapa" aria-hidden="true"></span>' +
            '</article>';
    }).join('');

    /* Sin años: la diapositiva ya dice "01 / 08" en su pie, asi que el eje
       queda como puntos de posicion. */
    elAnios.innerHTML = HITOS.map(function (h, i) {
        return '<button type="button" class="tl2-anio-btn" data-i="' + i + '" ' +
            'aria-label="Ir a la diapositiva ' + (i + 1) + ' de ' + HITOS.length + ': ' + esc(h.titulo) + '">' +
            '<span class="tl2-punto" aria-hidden="true"></span></button>';
    }).join('');

    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();

    var botones = elAnios.querySelectorAll('.tl2-anio-btn');
    var etapas = elEscena.querySelectorAll('.tl2-etapa');
    var N = HITOS.length;

    var indiceActual = 0;

    /* El video de la etapa activa arranca solo y en silencio; los demas se
       pausan y vuelven al principio. muted es obligatorio: sin eso el
       navegador bloquea el autoplay y play() rechaza la promesa. */
    function sincronizarVideos(idx) {
        var vids = elEscena.querySelectorAll('video');
        for (var i = 0; i < vids.length; i++) {
            var v = vids[i];
            var suEtapa = parseInt(v.parentNode.parentNode.getAttribute('data-i'), 10);
            if (suEtapa === idx) {
                v.muted = true;
                var pr = v.play();
                // Si el navegador lo bloquea igual, no tiene que romper nada.
                if (pr && pr.catch) pr.catch(function () { });
            } else {
                // Rebobinar siempre, no solo si venia reproduciendo: si quedo
                // pausado a mitad, al volver a la etapa arrancaria por ahi.
                if (!v.paused) v.pause();
                if (v.currentTime !== 0) v.currentTime = 0;
            }
        }
    }

    function pausarTodos() {
        var vids = elEscena.querySelectorAll('video');
        for (var i = 0; i < vids.length; i++) if (!vids[i].paused) vids[i].pause();
    }

    function marcar(p) {
        var idx = Math.round(p * (N - 1));
        // marcar() corre en cada cuadro del scroll: solo tocar los videos
        // cuando de verdad cambio la etapa.
        if (idx !== indiceActual) sincronizarVideos(idx);
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
            onUpdate: function (self) { marcar(self.progress); },
            onToggle: function (self) {
                if (self.isActive) sincronizarVideos(indiceActual);
                else pausarTodos();
            }
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

    /* ------------------------------------------------------------
       Ampliar la diapositiva
       Las placas son 1800x1200 y en la tarjeta se ven a menos de la mitad:
       el detalle de las fotos no se lee. Al ampliar se muestran a pantalla
       completa, respetando el 3:2.
       ------------------------------------------------------------ */
    var lupa = document.createElement('div');
    lupa.className = 'tl2-lupa';
    lupa.setAttribute('role', 'dialog');
    lupa.setAttribute('aria-modal', 'true');
    lupa.innerHTML =
        '<button type="button" class="tl2-lupa-cerrar" aria-label="Cerrar">&times;</button>' +
        '<figure class="tl2-lupa-caja"></figure>' +
        '<figcaption class="tl2-lupa-pie"></figcaption>';
    document.body.appendChild(lupa);

    var lupaCaja = lupa.querySelector('.tl2-lupa-caja');
    var lupaPie = lupa.querySelector('.tl2-lupa-pie');

    function abrirLupa(i) {
        var h = HITOS[i];
        if (!h) return;
        var m = h.media || {};
        // El video de la tarjeta se pausa: no pueden sonar los dos.
        pausarTodos();
        lupaCaja.innerHTML = (m.tipo === 'video')
            ? '<video controls autoplay playsinline preload="metadata"' +
              (m.poster ? ' poster="' + esc(m.poster) + '"' : '') + '>' +
              '<source src="' + esc(m.src) + '" type="video/mp4"></video>'
            : '<img src="' + esc(m.src) + '" alt="' + esc(h.titulo) + '">';
        lupaPie.textContent = h.titulo;
        lupa.classList.add('es-visible');
        document.body.style.overflow = 'hidden';
        lupa.querySelector('.tl2-lupa-cerrar').focus();
    }

    function cerrarLupa() {
        lupa.classList.remove('es-visible');
        // Vaciar corta el audio del video ampliado.
        lupaCaja.innerHTML = '';
        document.body.style.overflow = '';
        sincronizarVideos(indiceActual);
    }

    elEscena.addEventListener('click', function (e) {
        var b = e.target.closest('[data-expandir]');
        if (b) { abrirLupa(parseInt(b.getAttribute('data-expandir'), 10)); return; }
        // La imagen tambien amplia; el video no, porque el click es de sus
        // propios controles.
        var img = e.target.closest('.tl2-media img');
        if (img) {
            var et = img.closest('.tl2-etapa');
            if (et) abrirLupa(parseInt(et.getAttribute('data-i'), 10));
        }
    });

    lupa.addEventListener('click', function (e) {
        if (e.target === lupa || e.target.closest('.tl2-lupa-cerrar')) cerrarLupa();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lupa.classList.contains('es-visible')) cerrarLupa();
    });
})();
