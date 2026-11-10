# Rediseño web 2026 · notas

Rama `rediseno-web`, 10 de noviembre de 2026. Con tu aprobación, se publicó el mismo día: merge a `master`, que es la rama que publica GitHub Pages.

## Antes de empezar: el boceto no estaba

La carpeta `_boceto/` no está en ninguna rama de GitHub ni en la PC.
- Con tu OK, reconstruí la estructura y los textos con estas fuentes:
  - la home en vivo;
  - la lógica del test que ya corría en la home;
  - los documentos de la carpeta del proyecto (tono, programas, casos y frases de testimonios);
  - tu brief.
- Al no existir, no hay nada que borrar antes del merge.
- Si aparece el boceto, conviene comparar los textos: los marcados como "validados" en el brief los rearmé yo.

## Qué cambió

### Sistema nuevo
- **Archivos nuevos:**
  - `assets/css/fluir.css`: celular primero, con tokens de color y las tipografías de marca.
  - `assets/js/fluir.js`: arma WhatsApp, mide los eventos, cambia el titular según el anuncio, maneja la barra inferior, los videos, la guía y el test.
- **Las páginas viejas no se tocaron:** `css/fluir.css` y `js/fluir.js` siguen como estaban para las páginas de programas.
- **Tipografías:**
  - Ubuntu Bold en titulares, Ubuntu en bajadas y Ubuntu itálica en citas.
  - Montserrat en el cuerpo (17 px, interlineado 1,4) y Montserrat Bold en encabezados internos.
  - Las fuentes de respaldo están calibradas contra el ancho real de cada tipografía, así el texto no salta cuando cargan.
- **Color:**
  - Sobre fondo claro, el acento es zafiro.
  - Sobre navy, el botón es blanco con texto navy, y nada azul va sobre navy: el radar del test está en una tarjeta blanca.
  - Los gradientes de programa aparecen solo en el bloque de título.
  - En P·A·C y C·D·E el texto va sobre el extremo zafiro del gradiente, para cumplir el contraste AA.
- **Movimiento:** dos momentos, y los dos respetan `prefers-reduced-motion`.
  - El radar del test se transforma de una forma a otra.
  - Las barras del tablero de ejemplo se arman al entrar en pantalla.

### Home (`index.html`)
- **Orden de secciones:**
  1. Portada: titular, una acción y fotos reales de tres negocios clientes.
  2. Logos de clientes.
  3. Lo que cambia: los cinco dolores contados desde lo que gana el dueño.
  4. Las tres herramientas en HTML, con datos marcados como "Ejemplo": caja proyectada, tablero de cinco números y estado de resultados.
  5. Casos con número y tres testimonios en video.
  6. Test de 1 minuto.
  7. Qué pasa cuando nos escribís, en tres pasos.
  8. Programas.
  9. Equipo.
  10. Guía gratis.
  11. Preguntas frecuentes.
  12. Contacto.
- Se mantienen las anclas `#rueda`, `#quienes-somos`, `#programas`, `#casos`, `#faq` y `#contacto`.
- **Test:**
  - La lógica es la misma.
  - Las barras ahora son botones de nivel tocables de 48 px. Se pueden usar con teclado y funcionan con lector de pantalla.
  - El radar, la etapa y el resultado se actualizan en vivo.
- **Cambios de texto en el test:**
  - Los títulos del resultado van sin punto final.
  - "Reunión semanal de 30 minutos" pasó a "reunión semanal corta", por la regla de tiempos.
  - El mensaje a WhatsApp ahora arranca con "Hola, quiero mi diagnóstico." y sigue con la etapa, el resultado y los cinco puntajes.
- **Guía:**
  - Pide nombre y email, envía a Formspree, dispara el evento Lead y descarga el PDF.
  - La tapa está hecha en HTML con el sistema nuevo, porque no había cómo renderizar el PDF sin instalar nada.
- **Schema.org:**
  - ProfessionalService sin "PyMEs" y sin el bloque `parentOrganization`, que nombraba a Fluir Empresas y fluirempresas.com.
  - FAQPage con las mismas seis preguntas que se ven en la página.
- **Ya no aparecen:** "PyMEs", "45 minutos", el horario del P·A·C (18:30 a 19:50) y el plazo "entre la segunda y la cuarta semana", que no está entre los números verificados.

### Página de campaña (`diagnostico/index.html`)
- **Una sola acción:**
  - No tiene menú ni links.
  - El logo no es link.
  - Todos los `<a>` van a WhatsApp, y la prueba automática lo verifica.
- **Indexación:** lleva `noindex` y no entra en el sitemap.
- **Largo:** ocupa 4 pantallas de celular a 390 px (3.387 px de alto).
- **Orden:** portada con titular según el anuncio, qué pasa después en tres pasos, tres números con el testimonio de Mauro, quién responde con tres preguntas y el cierre.
- **Titular:** cambia con `?h=plata|equipo|grupo` o con esa palabra dentro de `utm_content`. Con `grupo` también cambia una foto: entra la mesa de dueños.
- **Versión en tú:** `diagnostico/tu/index.html`, para México, Colombia, Chile y Perú.
  - Dice "sin costo", "dinero" y "en línea".
  - Saca la oficina de Mar del Plata de los pasos.
  - Pregunta "¿Trabajan con negocios fuera de Argentina?".
  - En Meta se mide aparte: el `content_category` arranca con `diagnostico-tu-`.

### Imagen para compartir
- `assets/og/og-home-v3.jpg` (1200 × 630) usa Ubuntu Bold, fondo navy y tres fotos reales: rectificadora, concesionaria y distribuidora.
- Ya no dice "Asesoría para PyMEs".
- La home la usa en `og:image`, `twitter:image` y en el schema. La campaña también la usa.

### Imágenes y videos
- **Fotos nuevas en `assets/img/`:** son webp en 2 o 3 anchos con `srcset`, y las que están debajo de la primera pantalla cargan diferido.
- **Cuadros sacados de los videos:** elegí los que no tienen subtítulos quemados.

  | Archivo | Qué muestra |
  |---|---|
  | `rectificadora-mauro` | Mauro con Martín en el taller |
  | `concesionaria-checars` | Facundo con Martín en el salón |
  | `distribuidora-martin` | Vanesa Ruiz Díaz en el depósito |

  El recorte del taller deja afuera el teléfono y el Instagram del cartel.
- **Cuadros que salieron:** al principio usé dos cuadros de la capacitación de Elecsur y Contegma. Los saqué porque el video es de baja resolución y no alcanza para foto.
- **Del carrusel:**
  - Uso `hero-5` (Martín), `hero-3` (Anto, también en C·D·E) y `hero-4` (mesa de dueños, para el P·A·C).
  - `hero-2` no se usa, por el cartel de Fluir Empresas.
- **Retratos del equipo:** pasaron a webp.
- **Videos:**
  - Los de Mauro, Checars y Vanesa quedaron a 540 × 960, en el mismo nombre de archivo.
  - Pesos: Mauro bajó de 19 a 7,4 MB, Checars de 3,5 a 1,9 MB y Vanesa de 8,8 a 3,6 MB.
  - Llevan `preload="none"` y una portada liviana en webp. El video se descarga recién cuando alguien toca "Ver testimonio".
- **Testimonios que no entran en la home:** Elecsur y Contegma, y Macarena Poli.
  - El documento de frases del 10/11 los marca como "no sirven para Fluir Negocios": en uno se dice "Fluir Coaching" y "coach ontológico", y el otro es un taller de coaching.
  - Siguen en `pages/cde.html`.
  - Si los querés de vuelta, se suman en dos minutos.

### Medición
- **Eventos que se mantienen:**
  - PageView.
  - Contact en cualquier clic a WhatsApp.
  - Schedule, con `content_category` igual a página-botón (por ejemplo `home-portada`, `home-test`, `diagnostico-cierre` o `diagnostico-tu-barra`), en cada botón que pide el diagnóstico.
  - GA4 `solicitar_diagnostico`, con `pagina` y `boton`.
  - Lead solo al bajar la guía.
- **Código del anuncio:** si la visita trae `utm_content`, el mensaje de WhatsApp suma "(código: …)". El código queda guardado en la sesión, así que también se suma si después navega por la home.
- **Carga de las etiquetas:** GTM, GA4 y el píxel ahora se descargan al primer toque, scroll o tecla, o 3 s después de que carga la página.
  - Las colas (`dataLayer` y `fbq`) se arman desde el primer momento: PageView y cualquier evento quedan guardados y se mandan cuando llegan las librerías.
  - **Lo que se pierde:** el PageView de quien se va antes de 3 s sin tocar nada.
  - **Por qué:** con las etiquetas cargando de entrada, Lighthouse daba 76 a 78 de rendimiento. Esas tres librerías bloqueaban 1,1 s del celular.
  - **Cómo volver atrás:** en el `<head>` de cada página, `window.FN_ETIQUETAS_YA = true`.
- **GA4 se carga una sola vez.** Al principio anoté que se cargaba dos veces, pero estaba mal: el contenedor público de GTM (GTM-W9R963MW) no tiene ninguna etiqueta. Ni GA4 ni el píxel salen de GTM. El segundo pedido a `gtag/js` lo hace la propia librería de GA4.
- **Píxel de Meta inmediato** (rama, 10/11, pendiente de publicar). La campaña "FN | Web Diagnóstico | Leads" optimiza por vistas de la página de destino, que Meta cuenta con el PageView del píxel. Por eso el píxel volvió a cargar de entrada, con el código estándar. GA4 y GTM siguen diferidos.
  - **El costo:** Lighthouse mobile baja de 94–100 a 74–83 en rendimiento, y de 100 a 79 en buenas prácticas, por las cookies de terceros. El primer contenido sigue en 0,76–1,13 s.

### Rendimiento y CSS crítico
- `herramientas/css-critico.py` copia en cada página las reglas que dibujan la primera pantalla, y el CSS completo carga sin bloquear.
- Si se cambia `assets/css/fluir.css`, conviene correr `python herramientas/css-critico.py`. Si alguien se olvida, solo cambia el primer instante.

## Cómo se verificó

- **Capturas con Playwright:** están en la carpeta del proyecto, `Claude outputs/2026-11-10-rediseno-web-capturas/`.
  - Hay capturas a 390 px y a 1366 px de la home y de `/diagnostico`, cada una con su primera pantalla y la página completa.
  - El test ya usado se ve en `home-390-test-usado.png` y `home-1366-test-usado.png`.
  - También están las variantes `?h=plata` y la versión en tú.
- **Scroll horizontal:** no hay en ninguna página, ni a 390 ni a 1366. Había uno y lo encontré: los títulos de tabla ocultos se salían del carrusel de herramientas.
- **Medidas:** todo lo tocable mide 48 px o más.
- **Prueba de eventos:** usé un stub de `fbq` y leí el `dataLayer`. Pasaron 143 comprobaciones.
  - Cada botón de las tres páginas abre `wa.me/5492235295052` con "Hola, quiero mi diagnóstico.", y le suma el código cuando hay `utm_content`.
  - Cada botón dispara Contact, Schedule con la categoría correcta y `solicitar_diagnostico`.
  - El WhatsApp suelto del contacto dispara solo Contact.
  - Ningún botón dispara Lead.
  - La guía con email inválido no envía. Con email válido hace POST a Formspree, dispara Lead una vez y descarga el PDF.
  - El titular cambia con `?h=` y con `utm_content`.
- **Lighthouse mobile:** versión 12.6.1, con servidor local con gzip como GitHub Pages y etiquetas reales.

  | Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | Primer contenido | CLS |
  |---|---|---|---|---|---|---|
  | Home | 97–99 | 100 | 100 | 100 | 0,84–1,0 s | 0 |
  | /diagnostico | 94–100 | 100 | 100 | 69 (noindex, a propósito) | 0,67–0,85 s | 0 |
  | /diagnostico/tu | 96–100 | 100 | 100 | 69 (noindex) | 0,75–0,9 s | 0 |
  | M·A·R | 100 | 100 | 100 | 100 | 0,76 s | 0 |
  | P·A·C | 99 | 100 | 100 | 100 | 0,76 s | 0 |
  | C·D·E | 99 | 100 | 100 | 100 | 0,76 s | 0 |
  | Fluir Sistemas | 100 | 100 | 100 | 100 | 0,76 s | 0 |

  La prueba de eventos de las cuatro páginas de programas sumó comprobaciones: en total pasaron 251.

- **Búsqueda en las páginas nuevas, el JS y el CSS:** no hay "pyme", "charla", "45 minutos", "fluirempresas", "Fluir Empresas" ni "coaching". Tampoco hay títulos con punto final.
  - Solo aparece "2 minutos", en el `aria-label` del video de Mauro, como duración del video.
  - Las páginas viejas (`pages/*.html`, `404.html`) todavía dicen "PyMEs": se cambia en la fase 2.

## Referencias: qué tomé y por qué

- **EOS, reunión de 90 minutos** (eosworldwide.com/90mm, que redirige a /start-here)
  - **Tomé:**
    - El bloque "qué pasa después" en tres pasos numerados. El tercero termina en que la decisión es tuya. Le saca el miedo a la venta encubierta.
    - "¿Cuánto cuesta?" como pregunta propia.
    - La frase de honestidad vive en la FAQ, no en los pasos. Coincide con tu regla de "Si no te sirve, te lo decimos".
  - **No tomé:** los links de "explorá por tu cuenta" ni la franja de su conferencia. Sacan a la persona del camino.
- **Marketing Ingenioso /sgl**
  - **Tomé:** la mecánica de pasos numerados en la misma página, con el botón pegado al paso. En `/diagnostico` son tres pasos y un solo botón.
  - **No tomé:** el titular con cifras y plazo, los cupos limitados, la jerga, el fondo negro (cuesta leerlo al sol) ni la agenda de una hora. Para este público, WhatsApp va antes que un calendario.
- **Vistage, grupos de pares**
  - **Tomé:**
    - La ficha del grupo en una línea: grupos de 4, 8 semanas, online o en Mar del Plata.
    - El rol de quien guía cada encuentro.
    - Le sumé lo que Vistage no tiene: la línea de semanas dibujada (1 y 2, 3 y 4, 5 a 7, 8).
  - **No tomé:** su porcentaje de crecimiento ni sus fotos posadas.
- **Consultoras de la región**

  | Consultora | Qué tomé | Qué no tomé |
  |---|---|---|
  | Wenroads (wenroads.com) | Las frases espejo del dueño, en "Lo que cambia" | El registro corporativo |
  | BPS (bpsolutions.com.ar) | Testimonios con nombre y negocio | El muro de logos de multinacionales y la jerga |
  | ActionCOACH Argentina (empresasenaccion.com) | El titular en la voz del dueño | Los porcentajes sin fuente, las vacantes limitadas y la guía como acción alternativa |
  | Coach Latinoamérica (coachlatinoamerica.com) | — | Las estadísticas sin fuente, citadas como lo que hay que evitar |

- **Referencias visuales**
  - Godly redirigía y Land-book dio error 403. Usé las que cargaron.
  - **Clearleft (clearleft.com):** fotos de sesiones reales, con un texto alternativo que describe la escena. Lo usé en todas las fotos.
  - **Small Giants (smallgiants.org):** fotos verticales reales con esquinas redondeadas y un solo botón. Tomé el mosaico de la portada y la regla de no usar carrusel automático.
  - **Pilares de Marketing Ingenioso:** número grande más foto real. Lo usé en los casos con número.
  - **Testimonios de EOS:** miniatura de video con la frase del cliente y, debajo, nombre y negocio.

## Fotos que faltan

| Escena | Para qué sección |
|---|---|
| El dueño de la distribuidora familiar en su negocio (si es López y López: depósito, mostrador o con la administrativa que define precios) | Caso "3 a 4 horas por día". Hoy es una tarjeta sin foto |
| Una capacitación de encargados (C·D·E) con buena luz y en alta resolución: el equipo trabajando, no una charla de escenario | Portada del C·D·E, tarjeta del C·D·E en la home y "Lo que cambia" |
| Una sesión real del P·A·C con cuatro dueños, tomada desde atrás o de costado para cuidar la privacidad | Programa P·A·C y `/diagnostico?h=grupo`. Hoy uso `hero-4`, que es chica (894 px) |
| Un dueño con su encargado frente a la planilla de caja o al tablero, en su negocio | Herramientas y M·A·R: le daría cuerpo real a las piezas de ejemplo |
| Antonela, Martín y Vanesa trabajando con un cliente, en su lugar (no en escenario) | Equipo y "Te responde alguien de este equipo" |
| La puerta de la oficina con el cartel nuevo de Fluir Negocios | Contacto. Reemplaza a `hero-2` |
| Retratos del equipo en mayor resolución (hoy son de 453 × 680) | Equipo en escritorio |
| Facundo de Checars y Mauro en crudo, sin subtítulos quemados | Portadas de video y cuadros más limpios |

## Fase 2: páginas de programas (hecha el 10/11)

Las cuatro páginas ya usan el sistema nuevo y salieron publicadas junto con la home y `/diagnostico`.

### Todas
- **Encabezado de programa:** una franja con su gradiente (M·A·R, P·A·C y C·D·E) o navy (Fluir Sistemas).
  - Es el único lugar donde aparece el gradiente.
  - El nombre y la etiqueta van apilados, sobre el extremo oscuro, para cumplir el contraste.
- **Una sola acción:** todos los botones piden el diagnóstico con el mensaje base.
  - Antes había mensajes distintos ("Quiero mi web", "Pedir una demo", "Consultar el próximo grupo"). Ahora todos son "Hola, quiero mi diagnóstico.", más el código del anuncio si lo hay.
  - Schedule se mide con `mar-…`, `pac-…`, `cde-…` y `sistemas-…`.
- **Imágenes para compartir nuevas:** `og-mar-v3.jpg`, `og-pac-v3.jpg`, `og-cde-v3.jpg` y `og-sistemas-v3.jpg`.
- **Schema:** Service y BreadcrumbList sin "PyMEs".
- **Contenido de la página:** al pie, el mismo cierre con WhatsApp, oficina e Instagram de la home.

### M·A·R
- **Etapas:** las tres del brief (Tracción: números y caja · Impulso: procesos, manuales y encargado · Exponencial: automatización y web), cada una dicha como beneficio y con lo que te llevás.
- **Foto:** sale `hero-2`, por el cartel de Fluir Empresas. Entra Martín con Mauro en la puerta del taller.
- **Herramientas:** suma el tablero de cinco números de ejemplo.
- **Casos:** el de López y López, con su dirección y resultados sin número, pasa a los tres casos verificados más el testimonio de Mauro.
- **Sale:** "diagnóstico de 45 minutos".

### P·A·C
- **Formato:** grupos de 4, 8 semanas, online o presencial en Mar del Plata.
- **Sale:**
  - "Ocho miércoles";
  - el horario de 18:30 a 19:50;
  - "8 encuentros de 80 min";
  - "Fecha a confirmar".
- **Se mantiene:** el orden de las semanas, "Es para vos si" y "Con qué salís". "Clientes que pagan a tiempo" pasó a "una política de cobranza escrita", para no prometer.

### C·D·E
- **Sale:**
  - "4 semanas", "8 sesiones" y "unas 15 horas" (los documentos no se ponen de acuerdo en la duración);
  - "reunión semanal de 15 minutos";
  - "plan a 90 días";
  - "seguimiento a 30 y 60 días".
- **Testimonios:** el video de Macarena Poli sale. La cita de Elecsur y Contegma queda como tarjeta de texto, sin foto: el cuadro del video era de baja calidad. Ya no está el video donde se dice "Fluir Coaching".
- **Foto de la portada:** Antonela presentando en un evento (`hero-3`), hasta que haya una foto real de una capacitación de encargados.

### Fluir Sistemas
- **Sale:** los precios (desde USD 300, desde USD 200, Kit por unos USD 700, mantenimiento mensual) y la pregunta "¿Los precios son finales?".
  - El brief pide que no haya condiciones de cobro en ninguna parte, y que todo lleve al diagnóstico.
  - Si querés que vuelvan, están en `git show c494e46:pages/sistemas.html`.
- **Sale:** "el más pedido", porque no tiene respaldo.
- **Kit Arranque Pro:** se muestra con un flujo de ejemplo (la consulta de WhatsApp se responde, se anota en la planilla y se deriva a una persona).

### Pendientes resueltos (10/11, en la rama)
1. **`404.html`:** pasó al sistema nuevo, con rutas absolutas porque GitHub Pages la sirve en cualquier profundidad.
2. **`pages/diagnostico.html`:** ahora redirige a `/diagnostico/` y conserva `utm_*`, `h` y `fbclid`. No dispara el píxel, porque el PageView lo dispara la página de destino. Antes era la landing vieja con el test de la rueda, que disparaba un Lead propio ("Rueda del Negocio"). Si alguna campaña que optimiza por Lead apunta a esa URL, va a dejar de recibir esos Lead.
3. **GA4:** no había carga doble (ver Medición).

### Lo que queda
- Los CSS y JS viejos (`css/`, `js/`) ya no los usa ninguna página. Se pueden borrar más adelante.
- `pages/martin-troncoso*` siguen como estaban: redirigen a martintroncoso.com.
- La cuenta de Meta "Fluir nuevas publicidades" (952206709062329) figura como UNSETTLED (saldo impago) y no se pudo consultar. Hay que revisarla en el administrador de anuncios.
- Los anuncios tienen que apuntar a `https://fluirnegocios.com/diagnostico/` (o `/diagnostico/tu/` fuera de Argentina), con `utm_content` y, si corresponde, `h=plata`, `h=equipo` o `h=grupo`. El documento de pauta de junio todavía los manda a la home.

## Ajustes después de publicar (10/11)

- **Fotos:** salieron los dos cuadros de la capacitación de Elecsur y Contegma, que eran de baja calidad.
  - "Lo que cambia" queda sin foto.
  - El C·D·E pasa a la foto de Anto presentando.
  - La cita de Elecsur queda como tarjeta de texto.
  - El equipo queda con una sola foto a lo ancho.
- **Celular menos vertical:** en el celular, los grupos de tarjetas se deslizan hacia el costado, con puntitos que marcan cuántas hay. En escritorio todo sigue igual.
  - Qué grupos: lo que cambia, casos, programas, etapas, semanas, módulos y servicios.
  - El test: el radar queda arriba y las cinco frases se deslizan de a una. Al marcar una, pasa sola a la siguiente.
  - También bajó el aire entre secciones, se ocultó la tapa de la guía y los logos van de a cuatro por fila.

  | Página | Antes | Ahora |
  |---|---|---|
  | Home | 19,1 pantallas | 11,7 pantallas |
  | M·A·R | 7,6 | 6,3 |
  | P·A·C | 6,6 | 4,8 |
  | C·D·E | 7,2 | 5,4 |
  | Fluir Sistemas | 5,5 | 4,6 |
  | /diagnostico | 4,0 | 4,0 |

- **Barra inferior:** en escritorio ya no aparece, porque ahí está el botón de la cabecera. Queda en celular y tablet.
- **Tarjeta del M·A·R en la home:** ya no se estira el bloque de título.

## Para confirmar

- **Concesionaria = Checars.** Uní el número "2 semanas de vacaciones" con el testimonio de Facundo Palacios, porque `02-casos-y-prueba-social.md` los conecta.
- **Rectificadora = Mauro Marin.** Lo mismo con "27 trabajos por mes".
- **Distribuidora familiar sin nombre.** Va sin nombre y sin foto, porque no sé si es López y López o Distribuidora Martín.
- **Carga diferida de las etiquetas.** Si alguna campaña optimiza por vistas de la página de destino, revisá el punto de medición antes de publicar.
