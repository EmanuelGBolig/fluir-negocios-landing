/* ============================================================
   MARTÍN TRONCOSO — Línea de tiempo
   GSAP (gratis, desde el CDN oficial). NO usa ScrollTrigger.

   Cada diapositiva entra desde la derecha tapando a la anterior. Se avanza
   con las flechas de los costados, con los puntos de abajo o con las
   flechas del teclado: la seccion NO secuestra el scroll de la pagina.

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
     epoca    el periodo, arriba del titulo
     titulo   el titulo que se ve a la derecha de la diapositiva
     texto    array: un parrafo por elemento
     cierre   opcional, una linea final destacada (solo la usa la ultima)
     media    { tipo: 'imagen' | 'video', src, poster }
   ============================================================ */
(function () {
    'use strict';

    var BASE = '../assets/timeline/';

    /* Contenido aprobado, de Textos-Trayectoria-Web.md (audio de Martin del
       27/08/2026, datos confirmados por el). Los titulos NO son los del
       Canva: son los de la web, que Martin reescribio. */
    var HITOS = [
        {
            epoca: '2013',
            titulo: 'Mis primeros entrenamientos como coach',
            texto: [
                'Antes de entrenar a alguien, me entrené a mí. En 2013 arranqué mi propio camino de desarrollo personal y, casi en paralelo, mi formación como coach y entrenador.',
                'No empecé para enseñar: empecé porque necesitaba cambiar algo mío. Todo lo que hago hoy salió de esa decisión.'
            ],
            media: { tipo: 'imagen', src: BASE + 'slide-01.jpg' }
        },
        {
            epoca: '2016',
            titulo: 'Mi primera empresa y mi primera sede',
            texto: [
                'Abrí Fluir Coaching sin saber nada de administración, logística ni ventas. Solo con mucho amor por el servicio y ganas de hacer que suceda.',
                'Ahí se me empezó a forjar el carácter de líder y de emprendedor: fue el primer lugar donde mis decisiones generaron resultados reales, en mi economía y en la de otras personas.'
            ],
            media: { tipo: 'imagen', src: BASE + 'slide-02.jpg' }
        },
        {
            epoca: '2017 – hoy',
            titulo: 'Senderos de Fuego',
            texto: [
                'Es mi versión propia del Fire Walking, una práctica milenaria que distintas culturas usan para entrenar el enfoque, la concentración, la valentía y la osadía.',
                'Yo la llevé a la superación personal: entrenar la determinación para ir por los objetivos atravesando el miedo, no esperando a que se vaya. Doce ediciones después, sigue siendo la prueba más física de algo que repito siempre: la práctica por encima de la teoría.'
            ],
            media: { tipo: 'imagen', src: BASE + 'slide-03.jpg' }
        },
        {
            epoca: '2022',
            titulo: 'Nos mudamos, y dejé de estar solo',
            texto: [
                'Nos fuimos a una sede mejor y aprovechamos para renovar todo: la imagen de marca, los servicios, la forma de trabajar.',
                'Pero el salto más grande no fue el edificio: fue asociarme con Antonella, mi pareja. La marca creció el día que dejé de sostenerla solo.'
            ],
            media: { tipo: 'video', src: BASE + 'slide-04.mp4', poster: BASE + 'slide-04.jpg' }
        },
        {
            epoca: '2024 · Quito, Ecuador',
            titulo: 'Mi primera contratación internacional',
            texto: [
                'Me contrataron para llevar mis entrenamientos a Quito y dicté dos ediciones, en febrero y marzo, junto al instituto GA Training.',
                'Volví con una alianza estratégica, más de 10 coaches profesionales formados en conjunto y gente maravillosa del otro lado. El trabajo bien hecho se entiende en cualquier país.'
            ],
            media: { tipo: 'imagen', src: BASE + 'slide-05.jpg' }
        },
        {
            epoca: 'Agosto 2024',
            titulo: 'Triplicamos todo',
            texto: [
                'Inauguramos la sede en la que estamos hoy y triplicamos el tamaño: el equipo, la estructura, el edificio y la cantidad de gente que podemos recibir.',
                'Fue el salto de calidad que veníamos preparando hace años, y también el más exigente. Crecer en serio se ve menos en la foto de la inauguración que en todo lo que hubo que ordenar antes.'
            ],
            media: { tipo: 'video', src: BASE + 'slide-06.mp4', poster: BASE + 'slide-06.jpg' }
        },
        {
            epoca: '2025 · España',
            titulo: 'Formación en empresas y negocios',
            texto: [
                'En 2025 viajamos a España a hacer una formación de tres días en empresas y negocios, para crecer como empresario y como mentor de otros empresarios.',
                'El que enseña también se sienta a aprender. Si dejo de entrenarme, me quedo sin nada con qué entrenar a otro.'
            ],
            media: { tipo: 'video', src: BASE + 'slide-07.mp4', poster: BASE + 'slide-07.jpg' }
        },
        {
            epoca: '2024 – hoy',
            titulo: 'Ya no es un instituto: son tres equipos',
            texto: [
                'Hoy trabajamos juntos Fluir Coaching, el instituto; Fluir Negocios y Empresas, la consultora; y Fluir Marketing, la agencia de comunicación y publicidad.',
                'Tres puertas distintas para lo mismo: que una persona y su negocio crezcan de verdad, acompañados en todo lo que necesiten.'
            ],
            cierre: 'De dueño a líder. Hacer que suceda.',
            media: { tipo: 'video', src: BASE + 'slide-08.mp4', poster: BASE + 'slide-08.jpg' }
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
            (h.epoca ? '<span class="tl2-epoca">' + esc(h.epoca) + '</span>' : '') +
            '<h4 class="tl2-etapa-titulo">' + esc(h.titulo) + '</h4>' +
            [].concat(h.texto).map(function (par) {
                return '<p class="tl2-etapa-texto">' + esc(par) + '</p>';
            }).join('') +
            (h.cierre ? '<p class="tl2-cierre">' + esc(h.cierre) + '</p>' : '') +
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
    if (sinMovimiento || typeof window.gsap === 'undefined') {
        raiz.classList.add('es-estatico');
        return;
    }

    var gsap = window.gsap;

    /* La linea NO la maneja el scroll.
       Antes esta seccion se clavaba en pantalla y avanzaba con la rueda:
       secuestrar el scroll confunde (la pagina parece trabada) y se peleaba
       con el navbar fijo y con el alto cambiante del navegador en mobile.
       Ahora la timeline arranca pausada y solo se mueve cuando la persona
       toca una flecha, un punto o usa las flechas del teclado. */
    var linea = gsap.timeline({ paused: true });

    // Cada etapa entra desde la derecha; la anterior retrocede un poco y se
    // oscurece, para que se lea como que queda tapada abajo.
    for (var i = 1; i < N; i++) {
        // Esta si tiene que pintar su estado inicial al construirse: es la
        // que deja las etapas 1..N-1 estacionadas a la derecha.
        linea.fromTo(etapas[i],
            { xPercent: 100 },
            { xPercent: 0, ease: 'none', duration: 1 }, i - 1);

        /* immediateRender: false es obligatorio en las dos de abajo.
           Sin eso, el fromTo de "tapado" de la etapa i-1 (que arranca en
           xPercent 0) se renderiza al construir la timeline y pisa el
           xPercent 100 que le habia puesto su propio tween de entrada:
           quedaban las 8 etapas encimadas en x=0. Con ScrollTrigger no se
           notaba porque forzaba un render en el cuadro 0. */
        linea.fromTo(etapas[i - 1],
            { xPercent: 0, scale: 1 },
            { xPercent: -14, scale: 0.94, ease: 'none', duration: 1, immediateRender: false }, i - 1);
        linea.fromTo(etapas[i - 1].querySelector('.tl2-etapa-tapa'),
            { opacity: 0 },
            { opacity: 0.35, ease: 'none', duration: 1, immediateRender: false }, i - 1);
    }

    linea.pause(0);
    marcar(0);
    sincronizarVideos(0);

    /* Ir a una etapa: se lleva la cabeza de la timeline hasta el segundo que
       le corresponde. Cada tramo dura 1, asi que la etapa i vive en i. */
    var yendo = false;
    function irAEtapa(i) {
        i = Math.max(0, Math.min(N - 1, i));
        if (i === indiceActual && linea.time() === i) return;
        yendo = true;
        marcar(i / (N - 1));
        linea.tweenTo(i, {
            duration: 0.55,
            ease: 'power2.inOut',
            onComplete: function () {
                yendo = false;
                sincronizarVideos(i);
            }
        });
    }

    elAnios.addEventListener('click', function (e) {
        var b = e.target.closest('.tl2-anio-btn');
        if (b) irAEtapa(parseInt(b.getAttribute('data-i'), 10));
    });

    raiz.addEventListener('click', function (e) {
        var f = e.target.closest('.tl2-flecha');
        if (f && !f.disabled) irAEtapa(indiceActual + parseInt(f.getAttribute('data-dir'), 10));
    });

    // Flechas del teclado cuando la seccion esta a la vista.
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        if (e.target.closest('input, textarea, select')) return;
        var r = raiz.getBoundingClientRect();
        var visible = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.25;
        if (!visible) return;
        e.preventDefault();
        irAEtapa(indiceActual + (e.key === 'ArrowRight' ? 1 : -1));
    });

    /* Nada de videos sonando cuando la seccion no esta a la vista. */
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entradas) {
            for (var k = 0; k < entradas.length; k++) {
                if (entradas[k].isIntersecting) sincronizarVideos(indiceActual);
                else pausarTodos();
            }
        }, { threshold: 0.25 }).observe(raiz);
    }


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
