"""Arma la página de campaña en sus dos versiones desde una sola plantilla:
diagnostico/index.html (vos, Argentina) y diagnostico/tu/index.html (tú, resto de Latinoamérica).

La medición (píxel, GA4, GTM) y los íconos se copian de index.html, así quedan iguales en todo el sitio.
Después de correrlo, correr también herramientas/css-critico.py.

Uso, desde la raíz del repo:  python herramientas/diagnostico.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
HOME = (RAIZ / 'index.html').read_text(encoding='utf-8')
MEDICION = re.search(r'<!-- Medición:.*?</noscript>\n', HOME, re.S).group(0)
ICONOS = re.search(r'<svg width="0" height="0".*?</svg>\n', HOME, re.S).group(0)
VERSION = re.search(r'fluir\.css\?v=(\d+)', HOME).group(1)
WA = 'https://wa.me/5492235295052?text=Hola%2C%20quiero%20mi%20diagn%C3%B3stico.'
FUENTES = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Ubuntu:ital,wght@0,400;0,700;1,400&display=swap'

TEXTOS = {
    'vos': dict(
        archivo='diagnostico/index.html', pre='../', lang='es-AR', pagina='diagnostico', locale='es_AR',
        canonical='https://fluirnegocios.com/diagnostico/',
        titulo='Conversación de diagnóstico sin cargo | Fluir Negocios',
        descripcion='Una conversación sin cargo para encontrar qué frena tu negocio y por dónde empezar. Para dueños de negocios de 2 a 30 personas.',
        og_titulo='Encontrá qué frena tu negocio y por dónde empezar',
        og_desc='Conversación de diagnóstico sin cargo, por WhatsApp. Fluir Negocios, Mar del Plata.',
        h1={'base': 'Encontrá qué frena tu negocio y por dónde empezar',
            'plata': 'Vendés. Ahora sabé cuánto te queda',
            'equipo': 'Si mañana no venís, ¿qué se frena primero?',
            'grupo': 'Cuatro dueños, ocho semanas, una mesa'},
        bajada={'base': 'Una conversación sin cargo con alguien de nuestro equipo, para dueños de negocios de 2 a 30 personas.',
                'plata': 'Ordenamos con vos los números del negocio: cuánto ganás, a dónde se va la plata y cuál es tu sueldo.',
                'equipo': 'Armamos con vos encargados, procesos y acuerdos claros, para que el negocio siga andando cuando no estás.',
                'grupo': 'El P·A·C es un programa grupal: mandos y delegación, caja y márgenes, ventas y canales, y escala. Online o presencial en Mar del Plata.'},
        boton='Quiero mi diagnóstico', nota='Sin cargo. Te responde una persona del equipo, no un bot.',
        chat_sub='Te responde alguien del equipo', chat_msj='Hola, quiero mi diagnóstico.',
        chat_resp='¡Hola! ¿A qué se dedica tu negocio?',
        chat_toca='Tocá y mandá el tuyo', chat_clic='Hacé clic y mandá el tuyo',
        chat_aria='. Abre WhatsApp con el mensaje “Hola, quiero mi diagnóstico.”',
        desliza='Deslizá',
        prueba='<b>Más de 100 negocios</b> acompañados en más de 10 años.',
        pasos_titulo='Qué pasa después de tocar el botón',
        pasos=[('Se abre WhatsApp con tu mensaje', 'Lo mandás y listo. Del otro lado hay una persona, no un bot.'),
               ('Coordinamos la conversación', 'Por videollamada o en nuestra oficina de Mar del Plata, cuando te quede cómodo.'),
               ('Te vas con el freno identificado', 'Y con el primer paso para destrabarlo. Si tiene sentido seguir, te pasamos una Propuesta de Acompañamiento con acuerdos claros.')],
        casos_titulo='Negocios como el tuyo, con sus números',
        casos=[('Rectificadora', '27', 'trabajos por mes', 'Es lo que necesita para no perder plata. El dueño lo sabe, cobra sueldo fijo y armó un fondo de emergencia de 3 meses.'),
               ('Concesionaria', '2', 'semanas de vacaciones', 'Se las tomó el dueño, y la administración siguió funcionando.'),
               ('Distribuidora familiar', '3 a 4', 'horas por día', 'Las recuperó el dueño. Los precios los define una administrativa, con márgenes escritos.')],
        equipo_titulo='Te responde alguien de este equipo',
        equipo=[('antonela', 'Antonela Dello Russo', 'Finanzas, KPIs y área comercial'),
                ('martin', 'Martín Troncoso', 'Equipos y delegación'),
                ('vanesa', 'Vanesa Chiesa', 'Estructura y organización')],
        faq=[('¿Tiene costo?', 'No. La conversación de diagnóstico es sin cargo.'),
             ('¿Y si no es para mí?', 'Si no te sirve lo que hacemos, te lo decimos. Igual te llevás claro dónde está el freno.'),
             ('¿Es solo para Mar del Plata?', 'No. Acompañamos negocios de Argentina y del resto de Latinoamérica por videollamada.')],
        cierre='Contanos cómo está tu negocio', cierre_texto='Un mensaje alcanza para empezar.',
        cierre_nota='Sin cargo, por WhatsApp.',
        pie='Fluir Negocios · Catamarca 2930, Mar del Plata',
    ),
    'tu': dict(
        archivo='diagnostico/tu/index.html', pre='../../', lang='es-419', pagina='diagnostico-tu', locale='es_LA',
        canonical='https://fluirnegocios.com/diagnostico/tu/',
        titulo='Conversación de diagnóstico sin costo | Fluir Negocios',
        descripcion='Una conversación sin costo para descubrir qué frena tu negocio y por dónde empezar. Para dueños de negocios de 2 a 30 personas.',
        og_titulo='Descubre qué frena tu negocio y por dónde empezar',
        og_desc='Conversación de diagnóstico sin costo, por WhatsApp. Fluir Negocios, Mar del Plata, Argentina.',
        h1={'base': 'Descubre qué frena tu negocio y por dónde empezar',
            'plata': 'Vendes. Ahora descubre cuánto te queda',
            'equipo': 'Si mañana no vienes, ¿qué se detiene primero?',
            'grupo': 'Cuatro dueños, ocho semanas, una mesa'},
        bajada={'base': 'Una conversación sin costo con alguien de nuestro equipo, para dueños de negocios de 2 a 30 personas.',
                'plata': 'Ordenamos contigo los números del negocio: cuánto ganas, a dónde se va el dinero y cuál es tu sueldo.',
                'equipo': 'Armamos contigo encargados, procesos y acuerdos claros, para que el negocio siga funcionando cuando no estás.',
                'grupo': 'El P·A·C es un programa grupal: mandos y delegación, caja y márgenes, ventas y canales, y escala. En línea o presencial en Mar del Plata, Argentina.'},
        boton='Quiero mi diagnóstico', nota='Sin costo. Te responde una persona del equipo, no un bot.',
        chat_sub='Te responde alguien del equipo', chat_msj='Hola, quiero mi diagnóstico.',
        chat_resp='¡Hola! ¿A qué se dedica tu negocio?',
        chat_toca='Toca y envía el tuyo', chat_clic='Haz clic y envía el tuyo',
        chat_aria='. Abre WhatsApp con el mensaje “Hola, quiero mi diagnóstico.”',
        desliza='Desliza',
        prueba='<b>Más de 100 negocios</b> acompañados en más de 10 años.',
        pasos_titulo='Qué pasa después de tocar el botón',
        pasos=[('Se abre WhatsApp con tu mensaje', 'Lo envías y listo. Del otro lado hay una persona, no un bot.'),
               ('Coordinamos la conversación', 'Por videollamada, en el horario que te acomode.'),
               ('Te vas con el freno identificado', 'Y con el primer paso para destrabarlo. Si tiene sentido seguir, te enviamos una Propuesta de Acompañamiento con acuerdos claros.')],
        casos_titulo='Negocios como el tuyo, con sus números',
        casos=[('Rectificadora', '27', 'trabajos por mes', 'Es lo que necesita para no perder dinero. El dueño lo sabe, cobra sueldo fijo y armó un fondo de emergencia de 3 meses.'),
               ('Concesionaria', '2', 'semanas de vacaciones', 'Se las tomó el dueño, y la administración siguió funcionando.'),
               ('Distribuidora familiar', '3 a 4', 'horas por día', 'Las recuperó el dueño. Los precios los define una administrativa, con márgenes escritos.')],
        equipo_titulo='Te responde alguien de este equipo',
        equipo=[('antonela', 'Antonela Dello Russo', 'Finanzas, KPIs y área comercial'),
                ('martin', 'Martín Troncoso', 'Equipos y delegación'),
                ('vanesa', 'Vanesa Chiesa', 'Estructura y organización')],
        faq=[('¿Tiene costo?', 'No. La conversación de diagnóstico es sin costo.'),
             ('¿Y si no es para mí?', 'Si no te sirve lo que hacemos, te lo decimos. Igual te llevas claro dónde está el freno.'),
             ('¿Trabajan con negocios fuera de Argentina?', 'Sí. Acompañamos negocios de toda Latinoamérica por videollamada.')],
        cierre='Cuéntanos cómo está tu negocio', cierre_texto='Un mensaje alcanza para empezar.',
        cierre_nota='Sin costo, por WhatsApp.',
        pie='Fluir Negocios · Mar del Plata, Argentina',
    ),
}


def boton(cta, texto, clase='boton'):
    return (f'<a class="{clase}" href="{WA}" data-wa data-cta="{cta}" target="_blank" rel="noopener">'
            f'<svg aria-hidden="true"><use href="#i-wa"/></svg>{texto}</a>')


# Dibujo chico de cada caso (decorativo; el dato está escrito al lado), en el mismo orden que t['casos']
def dibujo(tipo):
    if tipo == 'trabajos':      # 27 trabajos en el mes
        celdas = [(True, k) for k in range(27)]
    elif tipo == 'vacaciones':  # un mes de 4 semanas, con 2 semanas de vacaciones
        celdas = [(7 <= k < 21, k - 7) for k in range(28)]
    else:                       # las 24 horas del día, 3 a 4 recuperadas
        celdas = [(k < 4, k) for k in range(24)]
    partes = []
    for k, (on, i) in enumerate(celdas):
        if not on:
            partes.append('<i></i>')
        else:
            clase = 'on medio' if tipo == 'horas' and k == 3 else 'on'
            partes.append(f'<i class="{clase}" style="--i:{i}"></i>')
    return f'<span class="dg-viz dg-viz--{tipo}" aria-hidden="true">{"".join(partes)}</span>'


DIBUJOS = ['trabajos', 'vacaciones', 'horas']
ENVIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/></svg>'
FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def pagina(t):
    pre = t['pre']
    h1 = '\n'.join(f'            <span data-variante="{k}">{v}</span>' for k, v in t['h1'].items())
    bajadas = '\n'.join(f'          <p class="bajada" data-variante="{k}">{v}</p>' for k, v in t['bajada'].items())
    pasos = '\n'.join(f'          <li class="paso">\n            <h3>{a}</h3>\n            <p>{b}</p>\n          </li>' for a, b in t['pasos'])
    casos = '\n'.join(f'''        <li class="dg-caso">
          <p class="dg-caso__rubro">{r}</p>
          {dibujo(d)}
          <p class="dg-caso__dato"><b>{n}</b><span>{u}</span></p>
          <p>{x}</p>
        </li>''' for (r, n, u, x), d in zip(t['casos'], DIBUJOS))
    caras = ''.join(f'<img src="{pre}assets/img/equipo-{k}-240.webp" width="240" height="360" alt="">' for k, _, _ in t['equipo'])
    equipo = '\n'.join(f'''        <figure>
          <img src="{pre}assets/img/equipo-{k}-240.webp" srcset="{pre}assets/img/equipo-{k}-240.webp 240w, {pre}assets/img/equipo-{k}-453.webp 453w" sizes="(min-width: 720px) 200px, 30vw" width="453" height="680" alt="{nombre}" loading="lazy" decoding="async">
          <figcaption><b>{nombre}</b>{rol}</figcaption>
        </figure>''' for k, nombre, rol in t['equipo'])
    faq = '\n'.join(f'          <details>\n            <summary>{q}</summary>\n            <p>{a}</p>\n          </details>' for q, a in t['faq'])

    return f'''<!DOCTYPE html>
<html lang="{t['lang']}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Archivo generado por herramientas/diagnostico.py: los cambios van en ese script -->

<script>
  /* Titular según el anuncio, antes del primer dibujo: ?h=plata|equipo|grupo o esa palabra en utm_content */
  (function () {{
    try {{
      var q = new URLSearchParams(location.search), v = ['plata', 'equipo', 'grupo'], h = (q.get('h') || '').toLowerCase();
      if (v.indexOf(h) < 0) {{ var c = (q.get('utm_content') || '').toLowerCase(); h = v.filter(function (p) {{ return c.indexOf(p) > -1; }})[0] || ''; }}
      if (h) document.documentElement.setAttribute('data-h', h);
      /* Movimiento solo si la persona no pidió menos: la tarjeta arranca vacía y se escribe sola */
      if ('IntersectionObserver' in window && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {{
        document.documentElement.classList.add('dg-anima');
      }}
    }} catch (e) {{}}
  }})();
</script>
{MEDICION}
<script>
  if (location.protocol === 'http:' && /(^|\\.)fluirnegocios\\.com$/.test(location.hostname)) {{
    location.replace(location.href.replace(/^http:/, 'https:'));
  }}
</script>
<!-- Página de campaña (Meta Ads): no se indexa ni va en el sitemap -->
<meta name="robots" content="noindex">
<title>{t['titulo']}</title>
<meta name="description" content="{t['descripcion']}">
<link rel="canonical" href="{t['canonical']}">
<meta name="theme-color" content="#FFFFFF">
<meta property="og:title" content="{t['og_titulo']}">
<meta property="og:description" content="{t['og_desc']}">
<meta property="og:image" content="https://fluirnegocios.com/assets/og/og-home-v3.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta property="og:url" content="{t['canonical']}">
<meta property="og:locale" content="{t['locale']}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{pre}assets/logos/favicon.png" type="image/png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FUENTES}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="{FUENTES}"></noscript>
<style id="css-critico"></style>
<link rel="preload" href="{pre}assets/css/fluir.css?v={VERSION}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{pre}assets/css/fluir.css?v={VERSION}"></noscript>
</head>
<body class="campana dg" data-pagina="{t['pagina']}" data-wa-mensaje="Hola, quiero mi diagnóstico.">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W9R963MW" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

{ICONOS}
<!-- Sin menú ni links: la única acción es pedir el diagnóstico por WhatsApp -->
<header class="dg-cabecera">
  <div class="contenedor"><img src="{pre}assets/logos/logo-340.webp" alt="Fluir Negocios" width="340" height="132"></div>
</header>

<main>

  <section class="dg-portada" aria-labelledby="titulo" data-variantes>
    <div class="contenedor dg-portada__grilla">
      <div class="dg-texto">
        <h1 id="titulo">
{h1}
        </h1>
{bajadas}
        <div class="dg-accion" data-oculta-barra>
          {boton('portada', t['boton'])}
          <p class="nota">{t['nota']}</p>
        </div>
      </div>

      <div class="dg-escena">
        <figure class="dg-escena__foto">
          <img src="{pre}assets/img/mesa-duenos-894.webp" srcset="{pre}assets/img/mesa-duenos-480.webp 480w, {pre}assets/img/mesa-duenos-894.webp 894w" sizes="(min-width: 1024px) 560px, 92vw" width="894" height="682" alt="Dueños de negocios trabajando alrededor de una mesa con cuadernos y planillas" fetchpriority="high">
        </figure>
        <!-- La tarjeta es un botón más: abre WhatsApp con el mensaje (Schedule: {t['pagina']}-tarjeta) -->
        <a class="dg-chat" href="{WA}" data-wa data-cta="tarjeta" target="_blank" rel="noopener">
          <span class="dg-chat__barra" aria-hidden="true">
            <span class="dg-caras">{caras}</span>
            <span><b>Fluir Negocios</b><small>{t['chat_sub']}</small></span>
          </span>
          <span class="dg-chat__cuerpo" aria-hidden="true">
            <span class="dg-chat__mia">{t['chat_msj']}<small>✓✓</small></span>
            <span class="dg-chat__lugar">
              <span class="dg-chat__escribe"><i></i><i></i><i></i></span>
              <span class="dg-chat__suya">{t['chat_resp']}</span>
            </span>
          </span>
          <span class="dg-chat__redactar">
            <span class="dg-chat__campo"><span class="dg-chat__tipeo" data-texto="{t['chat_msj']}" aria-hidden="true"></span><span class="dg-chat__guia"><span class="toca">{t['chat_toca']}</span><span class="clic">{t['chat_clic']}</span><span class="solo-lector">{t['chat_aria']}</span></span></span>
            <span class="dg-chat__enviar">{ENVIAR}</span>
          </span>
        </a>
      </div>

      <div class="dg-prueba">
        <p>{t['prueba']}</p>
        <div class="dg-logos">
          <img src="{pre}assets/clients/logo-grido.webp" alt="Grido" width="267" height="182">
          <img src="{pre}assets/clients/logo-sheraton.webp" alt="Sheraton" width="227" height="190">
          <img src="{pre}assets/clients/logo-musso.webp" alt="Musso" width="247" height="135">
          <img src="{pre}assets/clients/logo-elecsur.webp" alt="Elecsur" width="297" height="113">
        </div>
      </div>
    </div>
  </section>

  <section class="dg-bloque dg-bloque--gris dg-pasos" aria-labelledby="titulo-pasos">
    <div class="contenedor">
      <h2 id="titulo-pasos">{t['pasos_titulo']}</h2>
      <ol class="pasos" role="list">
{pasos}
      </ol>
      <div class="dg-pasos__accion" data-oculta-barra>
        {boton('pasos', t['boton'])}
      </div>
    </div>
  </section>

  <section class="dg-bloque" aria-labelledby="titulo-casos">
    <div class="contenedor">
      <h2 id="titulo-casos">{t['casos_titulo']}</h2>
      <p class="dg-desliza" aria-hidden="true">{t['desliza']}{FLECHA}</p>
      <ul class="dg-casos deslizable" role="list">
{casos}
      </ul>
      <figure class="dg-testimonio">
        <div class="video" data-pantalla>
          <img src="{pre}assets/video/testimonio-mauro-marin-poster-270.webp" srcset="{pre}assets/video/testimonio-mauro-marin-poster-270.webp 270w, {pre}assets/video/testimonio-mauro-marin-poster.webp 540w" sizes="(min-width: 720px) 150px, 118px" width="540" height="960" alt="Mauro Marin frente a su rectificadora" loading="lazy" decoding="async">
          <video src="{pre}assets/video/testimonio-mauro-marin.mp4" preload="none" playsinline hidden width="540" height="960" aria-label="Testimonio de Mauro Marin, Tapas de Cilindros"></video>
          <button class="video__play" type="button" aria-label="Ver el testimonio de Mauro Marin"><span class="icono"><svg aria-hidden="true"><use href="#i-play"/></svg></span><span class="texto">Ver testimonio</span></button>
        </div>
        <blockquote>
          <p>“El taller tiene su plata. Yo pensaba que era mía.”</p>
          <footer><b>Mauro Marin</b> · Tapas de Cilindros, rectificadora</footer>
        </blockquote>
      </figure>
    </div>
  </section>

  <section class="dg-bloque dg-bloque--gris" aria-labelledby="titulo-equipo">
    <div class="contenedor">
      <h2 id="titulo-equipo">{t['equipo_titulo']}</h2>
      <div class="dg-equipo-grilla">
        <div class="dg-equipo">
{equipo}
        </div>
        <div class="faq">
{faq}
        </div>
      </div>
    </div>
  </section>

  <section class="dg-cierre" aria-labelledby="titulo-cierre" data-oculta-barra>
    <div class="contenedor">
      <h2 id="titulo-cierre">{t['cierre']}</h2>
      <p class="bajada">{t['cierre_texto']}</p>
      {boton('cierre', t['boton'], 'boton boton--claro')}
      <p class="nota">{t['cierre_nota']}</p>
    </div>
  </section>

</main>

<footer class="dg-pie">
  <div class="contenedor"><p>{t['pie']}</p></div>
</footer>

<div class="barra-inferior" aria-hidden="true">
  <a class="boton" href="{WA}" data-wa data-cta="barra" target="_blank" rel="noopener" tabindex="-1"><svg aria-hidden="true"><use href="#i-wa"/></svg>{t['boton']}</a>
</div>

<script src="{pre}assets/js/fluir.js?v={VERSION}" defer></script>
</body>
</html>
'''


def main():
    for t in TEXTOS.values():
        (RAIZ / t['archivo']).write_text(pagina(t), encoding='utf-8')
        print('ok', t['archivo'])


if __name__ == '__main__':
    main()
