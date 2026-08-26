/* ============================================================
   GUIA DE CARRIL — componente compartido
   Vanilla JS, sin dependencias. Sirve para las dos paginas.

   Uso: marcar el contenedor que scrollea con data-carril.
        <div class="video-testis" data-carril="Deslizá para ver los 4 videos">
   El valor del atributo es el texto de la guia. Si va vacío, usa el de
   por defecto.

   Inyecta arriba del carril una fila con el texto y dos flechas, y la
   muestra SOLO si el carril realmente scrollea (o sea, en mobile: en
   desktop la grilla entra entera y la guia queda oculta sola).
   ============================================================ */
(function () {
    'use strict';

    var TEXTO_POR_DEFECTO = 'Deslizá para ver más';

    // Inline y no Font Awesome ni lucide: este archivo corre en las dos
    // paginas y cada una usa una libreria de iconos distinta.
    var ICONO_MANO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>';
    var ICONO_IZQ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
    var ICONO_DER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

    function activar(carril) {
        var texto = carril.getAttribute('data-carril') || TEXTO_POR_DEFECTO;

        var guia = document.createElement('div');
        guia.className = 'carril-guia';
        guia.innerHTML =
            '<span class="carril-guia-txt">' + ICONO_MANO + '<span></span></span>' +
            '<div class="carril-guia-btns">' +
            '<button type="button" class="carril-btn" data-carril-dir="-1" aria-label="Anterior">' + ICONO_IZQ + '</button>' +
            '<button type="button" class="carril-btn" data-carril-dir="1" aria-label="Siguiente">' + ICONO_DER + '</button>' +
            '</div>';
        guia.querySelector('.carril-guia-txt span').textContent = texto;
        carril.parentNode.insertBefore(guia, carril);

        var atras = guia.querySelector('[data-carril-dir="-1"]');
        var adelante = guia.querySelector('[data-carril-dir="1"]');

        function scrollea() {
            return carril.scrollWidth > carril.clientWidth + 4;
        }

        function refrescar() {
            var hay = scrollea();
            guia.classList.toggle('es-visible', hay);
            if (!hay) return;
            var max = carril.scrollWidth - carril.clientWidth;
            atras.disabled = carril.scrollLeft <= 2;
            adelante.disabled = carril.scrollLeft >= max - 2;
        }

        // Un "paso" es el ancho de una tarjeta mas el hueco. Si no se puede
        // medir, se cae al 85% del ancho visible.
        function paso() {
            var item = carril.firstElementChild;
            if (!item) return Math.round(carril.clientWidth * 0.85);
            var gap = parseFloat(getComputedStyle(carril).columnGap) || 0;
            return Math.round(item.getBoundingClientRect().width + gap);
        }

        guia.addEventListener('click', function (e) {
            var b = e.target.closest('[data-carril-dir]');
            if (!b || b.disabled) return;
            var dir = parseInt(b.getAttribute('data-carril-dir'), 10);
            carril.scrollBy({ left: dir * paso(), behavior: 'smooth' });
        });

        carril.addEventListener('scroll', refrescar, { passive: true });
        window.addEventListener('resize', refrescar);
        // Las imagenes y videos entran con lazy load y cambian el scrollWidth.
        window.addEventListener('load', refrescar);
        refrescar();
    }

    function iniciar() {
        var carriles = document.querySelectorAll('[data-carril]');
        for (var i = 0; i < carriles.length; i++) activar(carriles[i]);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
