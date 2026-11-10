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

# Fotos de la portada según el anuncio. La de "base" carga primero; las otras solo si toca.
FOTOS = {
    'base': ('distribuidora-martin', (360, 540, 720), 720, 900, '50% 28%',
             'Vanesa Ruiz Díaz en el depósito de Distribuidora Martín, junto a una asesora de Fluir'),
    'plata': ('rectificadora-mauro', (360, 540, 720), 720, 900, '30% 45%',
              'Mauro Marin, dueño de una rectificadora, conversa con Martín Troncoso en la puerta de su taller'),
    'equipo': ('concesionaria-checars', (360, 540, 720), 720, 900, '50% 32%',
               'Facundo Palacios y Martín Troncoso en el salón de Checars, su concesionaria'),
    'grupo': ('mesa-duenos-v', (360, 540), 546, 682, '50% 40%',
              'Dueños de negocios trabajando alrededor de una mesa'),
}

TEXTOS = {
    'vos': dict(
        archivo='diagnostico/index.html', pre='../', lang='es-AR', pagina='diagnostico', locale='es_AR',
        canonical='https://fluirnegocios.com/diagnostico/',
        titulo='Conversación de diagnóstico sin cargo | Fluir Negocios',
        descripcion='Una conversación sin cargo para encontrar qué frena tu negocio y por dónde empezar. Para dueños de negocios de 2 a 30 personas.',
        og_titulo='Encontrá qué frena tu negocio y por dónde empezar',
        og_desc='Conversación de diagnóstico sin cargo, por WhatsApp. Fluir Negocios, Mar del Plata.',
        ante='Diagnóstico sin cargo',
        h1={'base': 'Encontrá qué frena tu negocio y por dónde empezar',
            'plata': 'Vendés. Ahora sabé cuánto te queda',
            'equipo': 'Si mañana no venís, ¿qué se frena primero?',
            'grupo': 'Cuatro dueños, ocho semanas, una mesa'},
        bajada={'base': 'Una conversación con alguien de nuestro equipo, para dueños de negocios de 2 a 30 personas.',
                'plata': 'Ordenamos con vos los números del negocio: cuánto ganás, a dónde se va la plata y cuál es tu sueldo.',
                'equipo': 'Armamos con vos encargados, procesos y acuerdos claros, para que el negocio siga andando cuando no estás.',
                'grupo': 'El P·A·C es un programa grupal: mandos y delegación, caja y márgenes, ventas y canales, y escala. Online o presencial en Mar del Plata.'},
        chip={'base': 'Vanesa Ruiz Díaz · Distribuidora Martín', 'plata': 'Mauro Marin · Tapas de Cilindros',
              'equipo': 'Facundo Palacios · Checars', 'grupo': 'Dueños trabajando en grupo'},
        boton='Quiero mi diagnóstico', nota='Por WhatsApp. Te responde una persona del equipo.',
        trabajamos='Trabajamos con',
        pasos_titulo='Qué pasa después de tocar el botón',
        chat_sub='WhatsApp · 223 529-5052', chat_msj='Hola, quiero mi diagnóstico.', chat_tu='Tu mensaje',
        chat_resp='Te responde una persona del equipo',
        pasos=[('Se abre WhatsApp con tu mensaje', 'Lo mandás y listo. Del otro lado hay una persona, no un bot.'),
               ('Coordinamos la conversación', 'Por videollamada o en nuestra oficina de Mar del Plata, cuando te quede cómodo.'),
               ('Te vas con el freno identificado', 'Y con el primer paso para destrabarlo. Si tiene sentido seguir, te pasamos una Propuesta de Acompañamiento con acuerdos claros.')],
        casos_titulo='Negocios como el tuyo, con sus números',
        casos=[('Rectificadora', 'rectificadora-mauro', '27', 'trabajos por mes', 'es lo que necesita para no perder plata. El dueño lo sabe, cobra sueldo fijo y armó un fondo de emergencia de 3 meses.'),
               ('Concesionaria', 'concesionaria-checars', '2', 'semanas de vacaciones', 'se tomó el dueño. La administración siguió funcionando.'),
               ('Distribuidora familiar', None, '3 a 4', 'horas por día', 'recuperó el dueño. Los precios los define una administrativa, con márgenes escritos.')],
        equipo_titulo='Te responde alguien de este equipo',
        equipo_texto='<b>Antonela, Martín y Vanesa</b>Más de 10 años acompañando dueños desde Mar del Plata.',
        faq=[('¿Tiene costo?', 'No. La conversación de diagnóstico es sin cargo.'),
             ('¿Y si no es para mí?', 'Si no te sirve lo que hacemos, te lo decimos. Igual te llevás claro dónde está el freno.'),
             ('¿Es solo para Mar del Plata?', 'No. Acompañamos negocios de Argentina y del resto de Latinoamérica por videollamada.')],
        cierre='Contanos cómo está tu negocio', cierre_texto='Un mensaje alcanza para empezar.',
        cierre_nota='Sin cargo, por WhatsApp.',
        pie='Fluir Negocios · Catamarca 2930, Mar del Plata',
        ver='Ver testimonio',
    ),
    'tu': dict(
        archivo='diagnostico/tu/index.html', pre='../../', lang='es-419', pagina='diagnostico-tu', locale='es_LA',
        canonical='https://fluirnegocios.com/diagnostico/tu/',
        titulo='Conversación de diagnóstico sin costo | Fluir Negocios',
        descripcion='Una conversación sin costo para descubrir qué frena tu negocio y por dónde empezar. Para dueños de negocios de 2 a 30 personas.',
        og_titulo='Descubre qué frena tu negocio y por dónde empezar',
        og_desc='Conversación de diagnóstico sin costo, por WhatsApp. Fluir Negocios, Mar del Plata, Argentina.',
        ante='Diagnóstico sin costo',
        h1={'base': 'Descubre qué frena tu negocio y por dónde empezar',
            'plata': 'Vendes. Ahora descubre cuánto te queda',
            'equipo': 'Si mañana no vienes, ¿qué se detiene primero?',
            'grupo': 'Cuatro dueños, ocho semanas, una mesa'},
        bajada={'base': 'Una conversación con alguien de nuestro equipo, para dueños de negocios de 2 a 30 personas.',
                'plata': 'Ordenamos contigo los números del negocio: cuánto ganas, a dónde se va el dinero y cuál es tu sueldo.',
                'equipo': 'Armamos contigo encargados, procesos y acuerdos claros, para que el negocio siga funcionando cuando no estás.',
                'grupo': 'El P·A·C es un programa grupal: mandos y delegación, caja y márgenes, ventas y canales, y escala. En línea o presencial en Mar del Plata, Argentina.'},
        chip={'base': 'Vanesa Ruiz Díaz · Distribuidora Martín', 'plata': 'Mauro Marin · Tapas de Cilindros',
              'equipo': 'Facundo Palacios · Checars', 'grupo': 'Dueños trabajando en grupo'},
        boton='Quiero mi diagnóstico', nota='Por WhatsApp. Te responde una persona del equipo.',
        trabajamos='Trabajamos con',
        pasos_titulo='Qué pasa después de tocar el botón',
        chat_sub='WhatsApp · +54 9 223 529-5052', chat_msj='Hola, quiero mi diagnóstico.', chat_tu='Tu mensaje',
        chat_resp='Te responde una persona del equipo',
        pasos=[('Se abre WhatsApp con tu mensaje', 'Lo envías y listo. Del otro lado hay una persona, no un bot.'),
               ('Coordinamos la conversación', 'Por videollamada, en el horario que te acomode.'),
               ('Te vas con el freno identificado', 'Y con el primer paso para destrabarlo. Si tiene sentido seguir, te enviamos una Propuesta de Acompañamiento con acuerdos claros.')],
        casos_titulo='Negocios como el tuyo, con sus números',
        casos=[('Rectificadora', 'rectificadora-mauro', '27', 'trabajos por mes', 'es lo que necesita para no perder dinero. El dueño lo sabe, cobra sueldo fijo y armó un fondo de emergencia de 3 meses.'),
               ('Concesionaria', 'concesionaria-checars', '2', 'semanas de vacaciones', 'se tomó el dueño. La administración siguió funcionando.'),
               ('Distribuidora familiar', None, '3 a 4', 'horas por día', 'recuperó el dueño. Los precios los define una administrativa, con márgenes escritos.')],
        equipo_titulo='Te responde alguien de este equipo',
        equipo_texto='<b>Antonela, Martín y Vanesa</b>Más de 10 años acompañando dueños, desde Mar del Plata, Argentina.',
        faq=[('¿Tiene costo?', 'No. La conversación de diagnóstico es sin costo.'),
             ('¿Y si no es para mí?', 'Si no te sirve lo que hacemos, te lo decimos. Igual te llevas claro dónde está el freno.'),
             ('¿Trabajan con negocios fuera de Argentina?', 'Sí. Acompañamos negocios de toda Latinoamérica por videollamada.')],
        cierre='Cuéntanos cómo está tu negocio', cierre_texto='Un mensaje alcanza para empezar.',
        cierre_nota='Sin costo, por WhatsApp.',
        pie='Fluir Negocios · Mar del Plata, Argentina',
        ver='Ver testimonio',
    ),
}


def srcset(pre, nombre, anchos):
    return ', '.join(f'{pre}assets/img/{nombre}-{w}.webp {w}w' for w in anchos)


def boton(cta, texto, clase='boton boton--claro'):
    return (f'<a class="{clase}" href="{WA}" data-wa data-cta="{cta}" target="_blank" rel="noopener">'
            f'<svg aria-hidden="true"><use href="#i-wa"/></svg>{texto}</a>')


def pagina(t):
    pre = t['pre']
    # Foto de portada: base y plata comparten lugar si fuera la misma; acá son distintas
    fotos = []
    for clave, (nombre, anchos, w, h, pos, alt) in FOTOS.items():
        carga = ' fetchpriority="high"' if clave == 'base' else ' loading="lazy" decoding="async"'
        fotos.append(
            f'''    <figure class="cp-foto" data-variante="{clave}">
      <img src="{pre}assets/img/{nombre}-{anchos[1]}.webp" srcset="{srcset(pre, nombre, anchos)}" sizes="(min-width: 1024px) 50vw, 100vw" width="{w}" height="{h}" alt="{alt}" style="object-position: {pos}"{carga}>
      <figcaption>{t['chip'][clave]}</figcaption>
    </figure>''')
    h1 = '\n'.join(f'          <span data-variante="{k}">{v}</span>' for k, v in t['h1'].items())
    bajadas = '\n'.join(f'        <p class="bajada" data-variante="{k}">{v}</p>' for k, v in t['bajada'].items())
    pasos = '\n'.join(f'          <li class="paso">\n            <h3>{a}</h3>\n            <p>{b}</p>\n          </li>' for a, b in t['pasos'])
    casos = []
    for rubro, foto, num, unidad, texto in t['casos']:
        img = (f'<img src="{pre}assets/img/{foto}-540.webp" srcset="{srcset(pre, foto, (360, 540, 720))}" sizes="(min-width: 720px) 280px, 82vw" width="720" height="900" alt="" loading="lazy" decoding="async">'
               if foto else '')
        clase = 'cp-caso' if foto else 'cp-caso cp-caso--sin-foto'
        casos.append(f'''        <article class="{clase}">
          {img}
          <p class="cp-caso__rubro">{rubro}</p>
          <p class="cp-caso__numero">{num}</p>
          <p class="cp-caso__unidad">{unidad}</p>
          <p>{texto}</p>
        </article>''')
    faq = '\n'.join(f'        <details>\n          <summary>{q}</summary>\n          <p>{a}</p>\n        </details>' for q, a in t['faq'])
    avatares = ''.join(f'<img src="{pre}assets/img/equipo-{n}-240.webp" width="240" height="360" alt="" loading="lazy" decoding="async">' for n in ('antonela', 'martin', 'vanesa'))
    # Para las variantes, se precarga su foto (la de "base" ya está en el HTML con prioridad alta)
    preload_js = '{ ' + ', '.join(f"{k}: ['{v[0]}', [{', '.join(str(w) for w in v[1])}]]" for k, v in FOTOS.items() if k != 'base') + ' }'


    return f'''<!DOCTYPE html>
<html lang="{t['lang']}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Archivo generado por herramientas/diagnostico.py: los cambios van en ese script -->

<script>
  /* Titular y foto según el anuncio, antes del primer dibujo: ?h=plata|equipo|grupo o esa palabra en utm_content */
  (function () {{
    try {{
      var q = new URLSearchParams(location.search), v = ['plata', 'equipo', 'grupo'], h = (q.get('h') || '').toLowerCase();
      if (v.indexOf(h) < 0) {{ var c = (q.get('utm_content') || '').toLowerCase(); h = v.filter(function (p) {{ return c.indexOf(p) > -1; }})[0] || ''; }}
      if (!h) return;
      document.documentElement.setAttribute('data-h', h);
      var f = {preload_js}[h];
      if (f) {{
        var l = document.createElement('link'); l.rel = 'preload'; l.as = 'image';
        l.setAttribute('imagesrcset', f[1].map(function (w) {{ return '{pre}assets/img/' + f[0] + '-' + w + '.webp ' + w + 'w'; }}).join(', '));
        l.setAttribute('imagesizes', '(min-width: 1024px) 50vw, 100vw');
        document.head.appendChild(l);
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
<meta name="theme-color" content="#0A1F3A">
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
<body class="campana cp" data-pagina="{t['pagina']}" data-wa-mensaje="Hola, quiero mi diagnóstico.">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W9R963MW" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

{ICONOS}
<!-- Sin menú ni links: la única acción es pedir el diagnóstico por WhatsApp -->
<main>

  <section class="cp-portada" aria-labelledby="titulo" data-variantes>
    <span class="cp-marca"><img src="{pre}assets/logos/logo-340.webp" alt="Fluir Negocios" width="340" height="132"></span>
{chr(10).join(fotos)}
    <div class="cp-panel">
      <p class="antetitulo">{t['ante']}</p>
      <h1 id="titulo">
{h1}
      </h1>
{bajadas}
      <div class="portada__accion" data-oculta-barra>
        {boton('portada', t['boton'])}
        <p class="nota">{t['nota']}</p>
      </div>
      <div class="cp-prueba">
        <div class="cp-cifras">
          <p><b>+10</b><span>años acompañando dueños</span></p>
          <p><b>+100</b><span>negocios acompañados</span></p>
        </div>
        <div class="cp-logos">
          <span>{t['trabajamos']}</span>
          <img src="{pre}assets/clients/marquee/logo-grido.webp" alt="Grido" width="505" height="256">
          <img src="{pre}assets/clients/marquee/logo-sheraton.webp" alt="Sheraton" width="309" height="256">
          <img src="{pre}assets/clients/marquee/logo-crea.webp" alt="CREA" width="148" height="104">
          <img src="{pre}assets/clients/marquee/checars-logo.webp" alt="Checars" width="361" height="256">
        </div>
      </div>
    </div>
  </section>

  <section class="cp-bloque cp-bloque--gris" aria-labelledby="titulo-pasos">
    <div class="contenedor">
      <h2 id="titulo-pasos">{t['pasos_titulo']}</h2>
      <div class="cp-pasos-grilla">
        <figure class="cp-chat" aria-label="Ejemplo del mensaje que se envía por WhatsApp">
          <div class="cp-chat__barra">
            <span class="cp-avatares">{avatares}</span>
            <span><b>Fluir Negocios</b><small>{t['chat_sub']}</small></span>
          </div>
          <div class="cp-chat__cuerpo">
            <p class="cp-burbuja">{t['chat_msj']}<small>{t['chat_tu']} ✓✓</small></p>
            <p class="cp-escribiendo"><span class="cp-puntitos" aria-hidden="true"><i></i><i></i><i></i></span><span>{t['chat_resp']}</span></p>
          </div>
        </figure>
        <ol class="pasos cp-pasos" role="list">
{pasos}
        </ol>
      </div>
    </div>
  </section>

  <section class="cp-bloque" aria-labelledby="titulo-casos">
    <div class="contenedor">
      <h2 id="titulo-casos">{t['casos_titulo']}</h2>
      <div class="cp-testimonio-grilla">
        <div class="cp-casos deslizable">
{chr(10).join(casos)}
        </div>
        <figure class="video cp-historia">
          <img src="{pre}assets/video/testimonio-mauro-marin-poster.webp" srcset="{pre}assets/video/testimonio-mauro-marin-poster-270.webp 270w, {pre}assets/video/testimonio-mauro-marin-poster.webp 540w" sizes="(min-width: 720px) 420px, 90vw" width="540" height="960" alt="Mauro Marin frente a su rectificadora" loading="lazy" decoding="async">
          <video src="{pre}assets/video/testimonio-mauro-marin.mp4" preload="none" playsinline hidden width="540" height="960" aria-label="Testimonio de Mauro Marin, Tapas de Cilindros"></video>
          <div class="cp-historia__barras" aria-hidden="true"><i></i><i></i><i></i></div>
          <button class="video__play" type="button"><span class="icono"><svg aria-hidden="true"><use href="#i-play"/></svg></span><span class="texto">{t['ver']} <span class="video__duracion">2 min</span></span></button>
          <blockquote>
            <p>“El taller tiene su plata. Yo pensaba que era mía.”</p>
            <footer><b>Mauro Marin</b> · Tapas de Cilindros, rectificadora</footer>
          </blockquote>
        </figure>
      </div>
    </div>
  </section>

  <section class="cp-bloque cp-bloque--gris" aria-labelledby="titulo-equipo">
    <div class="contenedor">
      <h2 id="titulo-equipo">{t['equipo_titulo']}</h2>
      <div class="cp-equipo">
        <span class="cp-avatares">{avatares}</span>
        <p>{t['equipo_texto']}</p>
      </div>
      <div class="faq">
{faq}
      </div>
    </div>
  </section>

  <section class="cp-cierre" aria-labelledby="titulo-cierre" data-oculta-barra>
    <img src="{pre}assets/img/salon-martin-800.webp" srcset="{pre}assets/img/salon-martin-480.webp 480w, {pre}assets/img/salon-martin-800.webp 800w, {pre}assets/img/salon-martin-1200.webp 1200w" sizes="100vw" width="1200" height="688" alt="" loading="lazy" decoding="async">
    <div class="contenedor">
      <h2 id="titulo-cierre">{t['cierre']}</h2>
      <p class="bajada">{t['cierre_texto']}</p>
      {boton('cierre', t['boton'])}
      <p class="nota">{t['cierre_nota']}</p>
    </div>
  </section>

</main>

<footer class="cp-pie">
  <p>{t['pie']}</p>
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
