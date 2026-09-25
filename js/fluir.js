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
})();
