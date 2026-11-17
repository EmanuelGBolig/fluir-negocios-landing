"""Diagnóstico rápido: una sola fuente para la tarjeta del formulario.

- Arma la página propia, diagnostico-rapido/index.html: el link directo para mandar por WhatsApp o Instagram.
- Actualiza la misma tarjeta dentro de la home (index.html, sección #rueda, entre <!-- rapido:inicio --> y <!-- rapido:fin -->).

La medición (píxel, GA4, GTM) y los íconos se copian de index.html, así quedan iguales en todo el sitio.
El comportamiento (pasos, resultado, envío a Formspree y mensaje de WhatsApp) está en assets/js/fluir.js.
Después de correrlo, correr también herramientas/css-critico.py.

Uso, desde la raíz del repo:  python herramientas/rapido.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
WA = 'https://wa.me/5492235295052?text=Hola%2C%20quiero%20mi%20diagn%C3%B3stico.'
FUENTES = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Ubuntu:ital,wght@0,400;0,700;1,400&display=swap'
URL = 'https://fluirnegocios.com/diagnostico-rapido/'

TITULO = '¿Qué está frenando tu negocio?'
BAJADA = 'Preguntas de un toque, en dos minutos. Al final ves qué área te frena más y por dónde empezar.'


def tarjeta(nivel):
    """La tarjeta completa: datos, preguntas (las arma fluir.js) y resultado. nivel = etiqueta de los títulos internos."""
    return f'''<div class="rapido__tarjeta tarjeta" id="rapido">
        <form class="rapido__intro" id="rapido-intro" novalidate>
          <{nivel} class="rapido__titulo">Dos minutos para ver dónde se frena tu negocio</{nivel}>
          <p>Es nuestro Punto de Partida en versión rápida: 13 preguntas de un toque.</p>
          <ul class="rapido__beneficios" role="list">
            <li>Ves qué área te frena más y en qué etapa está tu negocio.</li>
            <li>Te llevás dos pasos concretos para empezar.</li>
            <li>Si después hablamos, la llamada va directo a lo que hay que hacer.</li>
          </ul>
          <div class="campo">
            <label for="rapido-nombre">Para empezar, ¿cómo te llamás?</label>
            <input id="rapido-nombre" name="nombre" type="text" autocomplete="given-name" required aria-describedby="rapido-error-intro">
          </div>
          <p class="rapido__error" id="rapido-error-intro" role="alert" hidden></p>
          <button class="boton boton--ancho" type="submit">Empezar el diagnóstico</button>
        </form>

        <!-- fluir.js muestra las preguntas de a una -->
        <div class="rapido__preguntas" id="rapido-preguntas" hidden></div>

        <form class="rapido__datos" id="rapido-datos" novalidate hidden>
          <{nivel} class="rapido__titulo" id="rapido-datos-titulo" tabindex="-1">Tu resultado está listo</{nivel}>
          <p>Dejanos tu email: tu resultado le llega también a nuestro equipo y, cuando hablemos, vamos directo a lo que hay que hacer.</p>
          <div class="rapido__campos">
            <div class="campo rapido__campo-ancho">
              <label for="rapido-email">Tu email</label>
              <input id="rapido-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="rapido-error">
            </div>
            <div class="campo">
              <label for="rapido-tel">Tu WhatsApp <span>(opcional)</span></label>
              <input id="rapido-tel" name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" aria-describedby="rapido-error">
            </div>
            <div class="campo">
              <label for="rapido-negocio">Tu negocio <span>(opcional)</span></label>
              <input id="rapido-negocio" name="negocio" type="text" autocomplete="organization" placeholder="Nombre o rubro">
            </div>
          </div>
          <p class="rapido__error" id="rapido-error" role="alert" hidden></p>
          <button class="boton boton--ancho" type="submit">Ver mi resultado</button>
          <p class="nota">Tus datos le llegan solo a nuestro equipo.</p>
        </form>

        <div class="rapido__resultado" id="rapido-resultado" hidden>
          <p class="solo-lector" aria-live="polite" id="resumen-vivo"></p>
          <p class="rapido__etapa" id="etapa-nombre"></p>
          <{nivel} class="rapido__titulo" id="diag-titulo" tabindex="-1"></{nivel}>
          <p id="diag-texto"></p>
          <ul class="rapido__areas" id="rapido-areas" role="list"></ul>
          <p class="diagnostico__subtitulo">Por dónde empezar</p>
          <ol class="diagnostico__pasos" id="diag-pasos"></ol>
          <div class="diagnostico__programa">
            <span class="nota">Te conviene</span>
            <a id="diag-prog" href="/pages/mar.html">M·A·R, acompañamiento 1 a 1 o grupal</a>
          </div>
          <a class="boton boton--ancho" id="rueda-wa" href="{WA}" data-cta="test" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Agendar mi llamada por WhatsApp</a>
          <p class="nota rapido__aviso" id="rapido-aviso">Sin cargo. Te responde una persona del equipo, no un bot.</p>
          <button class="rapido__otra" type="button" id="rapido-otra">Hacerlo de nuevo</button>
        </div>
      </div>'''


def pagina(home):
    medicion = re.search(r'<!-- Medición:.*?</noscript>\n', home, re.S).group(0)
    iconos = re.search(r'<svg width="0" height="0".*?</svg>\n', home, re.S).group(0)
    version = re.search(r'fluir\.css\?v=(\d+)', home).group(1)
    caras = ''.join(f'<img src="../assets/img/equipo-{k}-240.webp" width="240" height="360" alt="">' for k in ('antonela', 'martin', 'vanesa'))
    return f'''<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Archivo generado por herramientas/rapido.py: los cambios van en ese script -->
{medicion}
<script>
  if (location.protocol === 'http:' && /(^|\\.)fluirnegocios\\.com$/.test(location.hostname)) {{
    location.replace(location.href.replace(/^http:/, 'https:'));
  }}
</script>
<!-- Link directo del diagnóstico rápido (para mandar por WhatsApp o Instagram): no se indexa ni va en el sitemap -->
<meta name="robots" content="noindex">
<title>Diagnóstico rápido: ¿qué está frenando tu negocio? | Fluir Negocios</title>
<meta name="description" content="{BAJADA}">
<link rel="canonical" href="{URL}">
<meta name="theme-color" content="#0A1F3A">
<meta property="og:title" content="Diagnóstico rápido: ¿qué está frenando tu negocio?">
<meta property="og:description" content="Preguntas de un toque, en dos minutos. Ves qué área te frena más y por dónde empezar.">
<meta property="og:image" content="https://fluirnegocios.com/assets/og/og-diagnostico-rapido.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta property="og:url" content="{URL}">
<meta property="og:locale" content="es_AR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../assets/logos/favicon.png" type="image/png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FUENTES}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="{FUENTES}"></noscript>
<style id="css-critico"></style>
<link rel="preload" href="../assets/css/fluir.css?v={version}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="../assets/css/fluir.css?v={version}"></noscript>
</head>
<body class="campana rapido-pagina" data-pagina="diagnostico-rapido">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W9R963MW" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

{iconos}
<header class="dg-cabecera">
  <div class="contenedor"><img src="../assets/logos/logo-340.webp" alt="Fluir Negocios" width="340" height="132"></div>
</header>

<main>
  <section class="rueda oscuro rapido-pagina__bloque" id="rueda" aria-labelledby="titulo-rueda">
    <div class="contenedor rapido">
      <div class="cabeza rapido__cabeza">
        <p class="antetitulo">Diagnóstico rápido</p>
        <h1 id="titulo-rueda">{TITULO}</h1>
        <p class="bajada">{BAJADA}</p>
        <p class="rapido__equipo"><span class="dg-caras" aria-hidden="true">{caras}</span>Tu resultado lo lee alguien de nuestro equipo.</p>
      </div>

      {tarjeta('h2')}
    </div>
  </section>
</main>

<footer class="dg-pie">
  <div class="contenedor"><p>Fluir Negocios · Catamarca 2930, Mar del Plata · <a href="/">fluirnegocios.com</a></p></div>
</footer>

<script src="../assets/js/fluir.js?v={version}" defer></script>
</body>
</html>
'''


def main():
    ruta_home = RAIZ / 'index.html'
    home = ruta_home.read_text(encoding='utf-8')
    bloque = '<!-- rapido:inicio -->\n      ' + tarjeta('h3') + '\n      <!-- rapido:fin -->'
    if '<!-- rapido:inicio -->' in home:
        home = re.sub(r'<!-- rapido:inicio -->.*?<!-- rapido:fin -->', lambda m: bloque, home, flags=re.S)
    else:
        a = home.index('<div class="rapido__tarjeta tarjeta">')
        b = home.index('\n    </div>\n  </section>', a)
        home = home[:a] + bloque + home[b:]
    home = re.sub(r'(<h2 id="titulo-rueda">.*?</h2>\n\s*<p class="bajada">).*?(</p>)', lambda m: m.group(1) + BAJADA + m.group(2), home, flags=re.S)
    ruta_home.write_text(home, encoding='utf-8')
    print('ok index.html (tarjeta del diagnóstico rápido)')
    destino = RAIZ / 'diagnostico-rapido' / 'index.html'
    destino.parent.mkdir(exist_ok=True)
    destino.write_text(pagina(home), encoding='utf-8')
    print('ok', destino.relative_to(RAIZ))


if __name__ == '__main__':
    main()
