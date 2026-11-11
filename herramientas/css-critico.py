"""CSS crítico: copia en cada página las reglas de assets/css/fluir.css que dibujan la
primera pantalla, para que el primer contenido aparezca sin esperar al archivo completo.

El archivo completo se sigue cargando (sin bloquear) y trae las mismas reglas, así que si
alguien cambia fluir.css y se olvida de correr esto, solo cambia el primer instante.

Uso, desde la raíz del repo:  python herramientas/css-critico.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CSS = RAIZ / 'assets' / 'css' / 'fluir.css'
PAGINAS = ['index.html', 'diagnostico/index.html', 'diagnostico/tu/index.html',
           'pages/mar.html', 'pages/pac.html', 'pages/cde.html', 'pages/sistemas.html', '404.html']

# Selectores que aparecen en la primera pantalla (celular y escritorio)
CRITICOS = re.compile(r'''^(
  :root | \*|\*::before|\*::after | html | body | img|img,\s*video | a | h1|h2|h3 | h1,\s*h2 | button | \[hidden\]
  | ul\[role | :focus-visible | \.oscuro | \.solo-lector | \.saltar
  | \.titular | \.bajada | \.antetitulo | \.nota | \.enlace | \.cita
  | \.contenedor | \.bloque | \.cabeza
  | \.boton | \.cabecera | \.marca | \.menu
  | \.portada | \.cifras | \.cifra | \.mosaico
  | \.clientes | \.logos
  | \.barra-inferior | \.con-barra
  | \.campana | \.dg-cabecera | \.dg-portada | \.dg-texto | \.dg-accion | \.dg-escena | \.dg-chat | \.dg-caras | \.dg-prueba | \.dg-logos | html | \.programa-cabeza | \.ficha | \.portada__foto | \.portada__visual
)''', re.X)


def bloques(css):
    """Devuelve (prelude, cuerpo) de cada regla de primer nivel; las @media traen cuerpo anidado."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    i, n, out = 0, len(css), []
    while i < n:
        j = css.find('{', i)
        if j < 0:
            break
        prelude = css[i:j].strip()
        depth, k = 1, j + 1
        while depth and k < n:
            depth += {'{': 1, '}': -1}.get(css[k], 0)
            k += 1
        out.append((prelude, css[j + 1:k - 1]))
        i = k
    return out


def critico(css):
    partes = []
    for prelude, cuerpo in bloques(css):
        if prelude.startswith('@font-face'):
            partes.append(f'{prelude}{{{cuerpo.strip()}}}')
        elif prelude.startswith('@media'):
            internas = [f'{p}{{{c.strip()}}}' for p, c in bloques(cuerpo) if es_critico(p)]
            if internas:
                partes.append(f'{prelude}{{{"".join(internas)}}}')
        elif not prelude.startswith('@') and es_critico(prelude):
            partes.append(f'{prelude}{{{cuerpo.strip()}}}')
    texto = ''.join(partes)
    texto = re.sub(r'\s+', ' ', texto)
    texto = re.sub(r'\s*([{};:,>])\s*', r'\1', texto)
    return texto.replace(';}', '}')


def es_critico(prelude):
    return all(CRITICOS.match(s.strip()) for s in prelude.split(',') if s.strip()) or \
        any(CRITICOS.match(s.strip()) for s in prelude.split(','))


def main():
    estilo = critico(CSS.read_text(encoding='utf-8'))
    for rel in PAGINAS:
        p = RAIZ / rel
        html = p.read_text(encoding='utf-8')
        nuevo = f'<style id="css-critico">{estilo}</style>'
        if 'id="css-critico"' in html:
            html = re.sub(r'<style id="css-critico">.*?</style>', lambda m: nuevo, html, flags=re.S)
        else:
            raise SystemExit(f'{rel}: falta el marcador <style id="css-critico"></style>')
        p.write_text(html, encoding='utf-8')
        print(f'{rel}: {len(estilo)} caracteres de CSS crítico')


if __name__ == '__main__':
    main()
