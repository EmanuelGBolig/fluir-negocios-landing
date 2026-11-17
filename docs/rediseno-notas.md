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

## /diagnostico, rediseño final (10/11)

Las dos versiones (vos y tú) salen de `herramientas/diagnostico.py`. Los cambios se hacen ahí y después se corre `herramientas/css-critico.py`.

**Primer intento descartado: la versión "inmersiva".** Ponía cuadros de video a todo el ancho, que se veían borrosos, con el logo y etiquetas encima y un panel navy pesado, y repetía a Mauro tres veces. Se reemplazó entera.

**Versión actual:**
- **La pieza central:** la foto de la mesa de dueños, que es profesional y nítida, con una tarjeta de WhatsApp montada encima. La tarjeta muestra el mensaje real que se envía ("Hola, quiero mi diagnóstico."), las caras del equipo y "escribiendo…". Es el único movimiento de la página y respeta `prefers-reduced-motion`.
- **Lo demás, claro y quieto:**
  - fondo blanco y gris, titulares grandes en Ubuntu, sin rótulos en mayúsculas;
  - el zafiro solo en el botón;
  - cifras dichas en una frase y cuatro logos en gris;
  - casos con el número en grande, en filas;
  - testimonio de Mauro como miniatura vertical que se abre a pantalla completa;
  - los tres retratos del equipo con nombre y tres preguntas;
  - cierre en navy con el botón blanco.
- **Según el anuncio cambian solo el titular y la bajada.** La foto queda siempre la misma, porque es la única nítida de dueños trabajando.
- **Escritorio:** dos columnas en la portada, con el texto, el botón y la prueba a la izquierda y la foto con la tarjeta a la derecha. Los pasos y los casos van en tres columnas, y el equipo al lado de las preguntas.
- **Medidas:** 4,4 pantallas de celular y 3,6 de escritorio. Sin scroll horizontal y todo lo tocable de 48 px o más.
- **Lighthouse mobile:** accesibilidad 100, buenas prácticas 79 por las cookies del píxel y SEO 69 por el noindex. El rendimiento varió entre 63 y 82 en esta PC, con el píxel inmediato.
  - El elemento más grande es la foto: se descarga en menos de 1 s, pero tarda en pintarse mientras corre el script de Meta.
  - Probé cargar el píxel cuando termina la página y moverlo al final del HTML. Ninguna de las dos cosas mejoró de forma consistente.

## /diagnostico con movimiento (11/11)

Pedido: más atractiva y dinámica, que invite a deslizar y a pedir el diagnóstico, y que la tarjeta de WhatsApp lleve a WhatsApp.

- **La tarjeta es un botón.** Tocarla en cualquier momento abre WhatsApp con el mensaje y el código del anuncio. Mide como los demás botones: Contact, Schedule con `diagnostico-tarjeta` (o `diagnostico-tu-tarjeta`) y `solicitar_diagnostico`.
- **La tarjeta se escribe sola** cuando aparece en pantalla, en unos 5 segundos:
  1. Se tipea "Hola, quiero mi diagnóstico." en el campo de abajo.
  2. Se envía y los tildes pasan a azul.
  3. Aparece "escribiendo…" del otro lado y llega "¡Hola! ¿A qué se dedica tu negocio?".
  4. El campo queda con "Tocá y mandá el tuyo" ("Hacé clic…" en computadora) y el botón de enviar late.

  Al terminar, el botón principal hace un brillo, una vez. La foto se acomoda despacio mientras tanto.
- **Pasos:** al bajar se encienden de a uno, la línea se llena en zafiro y abajo hay un botón nuevo (`diagnostico-pasos`), que también brilla al encenderse el tercero.
- **Casos:** cada uno tiene un dibujo chico de su número, decorativo:
  - 27 puntos para los trabajos del mes;
  - un mes con 2 semanas marcadas para las vacaciones;
  - las 24 horas del día con 3 a 4 marcadas.

  Los dibujos se completan al verse y el número sube desde abajo. En el celular los casos se deslizan hacia el costado, con "Deslizá →", puntitos y un amague de la fila la primera vez que aparece.
- **Lo demás:**
  - el play del testimonio late;
  - las caras del equipo llegan de a una;
  - la barra inferior brilla al aparecer.
- **Menos movimiento:** si la persona lo pidió en su teléfono (`prefers-reduced-motion`), nada se mueve y todo aparece completo.
  - Si el JS no carga, la tarjeta se completa sola a los 5 segundos.
  - Las animaciones arrancan recién cuando el CSS completo está aplicado.
- **Verificado:**
  - 275 comprobaciones de botones y eventos;
  - toque real en la tarjeta: abre wa.me con el código;
  - sin desborde de 320 a 1440 px;
  - Lighthouse mobile: accesibilidad 100, CLS 0 y FCP 0,8 s. El rendimiento quedó entre 74 y 93, en el rango que ya tenía con el píxel inmediato.
- **Medidas:** 4,35 pantallas de celular y 3,85 de escritorio.
- **Versión de CSS y JS:** `?v=8` en todas las páginas.

## Ajustes del 17/11: herramientas, diagnóstico rápido, sin P·A·C y Sistemas con pantallas reales

Pedido: las herramientas tenían muchos números y eran poco atractivas. El test pasa a un diagnóstico de 10 preguntas que ocupe menos lugar. El M·A·R es 1 a 1 o grupal y el P·A·C ya no existe. La "foto" de Sistemas era mala: van recortes reales del CRM y de webs.

- **Herramientas (home):** sin tablas. Son tres dibujos simples, cada uno con una sola idea:
  - caja: cuatro barras por semana y la tercera en rojo, con "Semana 3: va a faltar plata";
  - estado de resultados: "De cada $ 100 que vendés, te quedan $ 11", con una barra repartida en mercadería, gastos, tu sueldo y ganancia;
  - tablero: los cinco números con "En meta", "Superado" o "Mirar", sin cifras.

  Se dibujan al entrar en pantalla. En el celular se deslizan.
- **Diagnóstico rápido (reemplaza al test de 1 minuto, mismo ancla `#rueda`):**
  - 10 preguntas, de a una, en una tarjeta. Cada una se contesta con "Sí", "A medias" o "No" y pasa sola a la siguiente; se puede volver a la anterior.
  - Son dos preguntas por área: Finanzas, Equipo, Operaciones, Ventas y Proveedores. Cada área va de 0 a 4 y el total de 0 a 20.
  - El resultado usa la misma lógica y los mismos textos que el test anterior: etapa, lo que más frena, dos pasos y programa sugerido. Se suman barras por área.
  - El programa sugerido es M·A·R, C·D·E si el freno es el equipo con procesos escritos, o Fluir Sistemas si nada frena.
  - El botón de WhatsApp sigue con `data-cta="test"` (Schedule `home-test`). El mensaje dice "Hice el diagnóstico rápido de la web. Etapa: … (n de 20). Resultado: …" más el código del anuncio.
  - Al terminar se manda a GA4 el evento `diagnostico_rapido` (resultado, etapa y puntaje). No se agregó nada al píxel.
  - En el menú pasa a llamarse "Diagnóstico rápido".
- **M·A·R 1 a 1 o grupal y fuera el P·A·C:**
  - "Tres formas de trabajar juntos": el M·A·R va a lo ancho con la foto de la mesa de dueños, que antes era del P·A·C, y al lado van el C·D·E y Fluir Sistemas.
  - `pages/mar.html` dice "1 a 1 o grupal" en el título, la ficha, el schema y una pregunta nueva, "¿Es 1 a 1 o grupal?".
  - `pages/pac.html` redirige al M·A·R conservando los parámetros. Salió del sitemap, de los pies, del 404, del schema y del CSS crítico.
  - El titular de `/diagnostico?h=grupo` ahora es "Ordená tu negocio junto a otros dueños", con la bajada "El M·A·R también se hace en grupo…".
- **Fluir Sistemas con pantallas reales:**
  - recortes de Mate, el CRM para WhatsApp (inicio, embudo y una respuesta automática), con los datos de demostración de los videos de LinkedIn;
  - la landing de Kovu para el Colegio de Veterinarios (Distrito IV).

  En la home van dos recortes superpuestos. En `pages/sistemas.html` van en la portada y en una sección nueva, "Algunas cosas que ya hicimos". Las imágenes son `assets/img/sistemas-*.webp`.
- **Sin pantallas repetidas en Sistemas (pedido del usuario):** la respuesta automática del CRM se cambió por la web de JP Coach de Música, para no mostrar dos pantallas del CRM.
  - En `pages/sistemas.html`, la portada muestra la web de Fluir Coaching y el inicio del CRM.
  - "Algunas cosas que ya hicimos" muestra el embudo del CRM, la web de JP y la landing de Kovu.
  - La tarjeta de la home sigue con Kovu y el inicio del CRM.
  - Las capturas de JP y Fluir Coaching se sacaron de sus webs publicadas, en su primera pantalla a 1280 px.
- **Verificado:**
  - 250 comprobaciones de botones y eventos, con el diagnóstico rápido completo;
  - Lighthouse mobile: accesibilidad 100 y CLS 0 en home, Sistemas y M·A·R;
  - la home pasó de 11,7 a 11,4 pantallas de celular.
- **Versión de CSS y JS:** `?v=9`.

## Diagnóstico rápido como embudo, con link propio (17/11)

Pedido:
- El mensaje de WhatsApp es el del ejemplo del usuario.
- Pide nombre y email para que la información le llegue al equipo, de forma amigable y explicando por qué.
- Las preguntas mezclan el diagnóstico con el formulario "Punto de Partida" (Google Forms, 21 preguntas abiertas).
- Tiene un link directo para mandar.

- **Link directo:** `https://fluirnegocios.com/diagnostico-rapido/`.
  - Lo genera `herramientas/rapido.py`, que también actualiza la misma tarjeta en la home (entre `<!-- rapido:inicio -->` y `<!-- rapido:fin -->`).
  - Tiene noindex, no va en el sitemap y no tiene menú.
  - Su imagen para compartir es `assets/og/og-diagnostico-rapido.jpg`.
  - Schedule se mide como `diagnostico-rapido-test`.
- **Recorrido:**
  1. **Intro** con lo que gana la persona: ve qué área la frena y en qué etapa está, se lleva dos pasos y la llamada va directo a lo que hay que hacer. Avisa que al final se piden nombre y email.
  2. **16 preguntas de un toque:**
     - 3 del negocio, tomadas del formulario: rol y socios, cuántas personas trabajan y antigüedad.
     - Las 10 de sí, a medias o no, que son las que dan el resultado.
     - 3 de lo que busca, también del formulario: qué quiere lograr primero, cómo le afecta hoy y qué pierde si nada cambia en 6 meses.
  3. **Datos justo antes del resultado,** explicando para qué: nombre y email obligatorios, WhatsApp y negocio opcionales. Se piden al final y no al principio porque así completa más gente: ya invirtió tiempo y quiere ver el resultado. Todo el que ve un resultado deja sus datos.
  4. **Resultado** con su nombre y el botón "Agendar mi llamada por WhatsApp" (sigue `data-cta="test"`).
- **Mensaje de WhatsApp:** "Hola, soy {nombre}. Hice el diagnóstico de la web y lo que más me frena son las finanzas. Quiero agendar la llamada de asesoría personalizada." Se le suma el código del anuncio si viene `utm_content`. La frase del freno cambia según el resultado.
- **Al equipo:** va un mail por Formspree, al mismo formulario de la guía (`mredepgv`). El asunto es "Diagnóstico rápido: Nombre (Negocio) — Resultado". Incluye:
  - nombre, email, WhatsApp y negocio;
  - perfil: "Encaja" si es dueño o negocio familiar de 2 a 30 personas, o "Revisar" si no;
  - resultado, etapa, puntaje por área y programa sugerido;
  - las 16 respuestas, el origen (home o link directo) y las UTM.
- **Medición:**
  - GA4: `diagnostico_rapido_inicio`, `diagnostico_rapido_datos` y `diagnostico_rapido` (el embudo paso a paso);
  - píxel: no se agregó nada y el Lead sigue siendo solo la guía.
- **Foto del C·D·E en la home:** se recortó para que se vea menos techo y más gente sentada (`evento-anto-sala-*.webp`). La página del C·D·E sigue con la foto completa.
- **Verificado:**
  - 261 comprobaciones de botones y eventos, con el recorrido completo y lo que se manda a Formspree;
  - Lighthouse mobile del link directo: rendimiento 98, accesibilidad 100 y CLS 0.
- **Versión de CSS y JS:** `?v=10`.

## Diagnóstico rápido: nombre al principio, 13 preguntas y tarjeta de alto fijo (17/11)

Pedido: que la sección no se mueva según el alto de cada pregunta, pedir el nombre al principio y bajar a 13 preguntas más el nombre.

- **Recorrido:**
  1. La intro pide el nombre ("Para empezar, ¿cómo te llamás?").
  2. Siguen 13 preguntas de un toque: rol y personas, las 10 de sí, a medias o no, y qué quiere lograr primero. Salieron antigüedad, "cómo te afecta" y "qué perdés si nada cambia".
  3. Antes del resultado se pide el email, con WhatsApp y negocio opcionales, bajo el título "Tu resultado está listo, {nombre}".
  - Las preguntas lo nombran: "Dale, Juan…" y "Última, Juan."
- **Alto fijo:** la tarjeta mide lo mismo en la intro, en cada pregunta y en los datos. El alto sale de medir el paso más alto en cada ancho y está en `--alto-rapido`, con los cortes de 360, 390, 414, 560, 720 y 1024 px en `fluir.css`.
  - En escritorio, el texto de la izquierda queda arriba, así no se mueve cuando aparece el resultado, que es lo único que puede crecer.
  - Las listas de opciones van en dos columnas también en el celular, y los campos de WhatsApp y negocio van lado a lado.
  - Si cambian los textos de la tarjeta, hay que volver a medir: el script de medición recorre todos los pasos en cada ancho.
- **Arreglado:** en el celular, los campos lado a lado ensanchaban la columna más que la pantalla. Ahora la grilla usa `minmax(0, 1fr)` y los campos se achican.
- **Link directo en el celular:** arriba de la tarjeta queda solo el título, así el nombre y el botón entran en la primera pantalla en 360×740, 390×844 y 414×896.
- **Verificado:** 263 comprobaciones de botones y eventos. La sección no se mueve en ningún paso, de 320 a 1600 px.

## Diagnóstico rápido: lenguaje claro, resultado centrado en el problema y tarjetas compactas (17/11)

Pedido:
- Pedir el nombre completo al empezar.
- Revisar las preguntas 5 y 6, que tenían "en tu cabeza" y "boca en boca".
- En la 13 se pueden marcar hasta 3 opciones.
- El resultado se centra en el problema de la persona y cierra con cómo la ayudamos.
- "Finanzas" pasa a "Administración".
- Textos claros, sin metáforas ni ambigüedades.
- Tarjetas más chicas, para que cada paso entre en una pantalla de celular.

- **Intro:** "Diagnóstico en 2 minutos", tres beneficios, el campo "Nombre completo" y el botón "Empezar".
- **Preguntas reescritas** sin metáforas. Por ejemplo:
  - "¿Los procesos importantes del negocio están escritos?"
  - "¿Conseguís clientes nuevos todos los meses, además de los que llegan por recomendación?"
  - "¿El trabajo sale bien cuando vos no estás?"
  - Las respuestas son "Sí", "En parte" y "No".
- **Pregunta 13:** "¿Qué te gustaría lograr? Elegí hasta 3". Se marcan y desmarcan opciones; con 3 elegidas, el resto se bloquea. Para avanzar está el botón "Seguir".
- **Resultado:** "Listo, Juan. Esto es lo que más te frena hoy:" y después:
  - el problema en palabras simples, como "No sabés cuánto gana tu negocio" o "Todo pasa por vos";
  - qué le está causando y lo que quiere lograr ("Querés tener más tiempo libre y…: para lograrlo, lo primero es resolver esto");
  - "Por dónde empezar", con dos pasos;
  - "Cómo te ayudamos", con el programa y su link;
  - el WhatsApp.

  Se sacaron las barras por área y la etapa: siguen en el mail al equipo.
- **"Finanzas" ahora es "Administración"** en el diagnóstico, en el resultado, en el mensaje de WhatsApp ("lo que más me frena es la administración") y en el mail.
- **Mail al equipo:** suma "Quiere lograr", con hasta 3 metas.
- **Tarjetas compactas:** menos aire, botones de 48 px y títulos más chicos. En el link directo, en el celular, arriba queda solo el título.
  - En 390 px la tarjeta mide unos 410 px, contra 560 antes, y cada paso entra en una pantalla de 390×760.
  - Al mostrar el resultado, la página baja hasta la tarjeta.
  - Altos fijos nuevos: 412, 460, 416, 396, 390 y 410 px.
- **Arreglado:**
  - el texto de "Cómo te ayudamos" borraba el link al programa;
  - si alguien tocaba "Empezar" antes de que cargara el JS, el formulario se mandaba solo y ponía el nombre en la dirección. Ahora los dos formularios tienen `onsubmit="return false"`.
- **Verificado:** la sección no se mueve en ningún paso, de 320 a 1366 px, en la home y en el link.

## Diagnóstico rápido: M·A·R primero y C·D·E al final (17/11, v=13)

- **Pedido:** recomendar siempre el M·A·R primero y el C·D·E como última opción, y explicar al final qué es cada uno, en pocas palabras.
- **"Cómo te ayudamos"** ahora son dos tarjetas, en este orden:
  - **M·A·R, "Recomendado para vos":** "Acompañamiento para dueños, 1 a 1 o en grupo.", más una frase de qué hacemos en su caso ("En tu caso, empezamos por…") y el link al M·A·R.
  - **C·D·E, "Otra opción":** "Capacitación para los encargados y supervisores de tu negocio: liderazgo, comunicación y gestión con números.", con el link al C·D·E.
- **Ya no se recomienda Fluir Sistemas ni el C·D·E como primera opción.** Antes salía Sistemas si todas las áreas estaban bien, y C·D·E si el problema era delegar. Esos casos ahora recomiendan el M·A·R, con su propia frase.
- **El mail al equipo** dice "Programa sugerido: M·A·R (otra opción: C·D·E)".
- **Verificado:** prueba completa de eventos sin fallas; capturas del resultado en 320, 390 y 1366 px.

## Para confirmar

- **Concesionaria = Checars.** Uní el número "2 semanas de vacaciones" con el testimonio de Facundo Palacios, porque `02-casos-y-prueba-social.md` los conecta.
- **Rectificadora = Mauro Marin.** Lo mismo con "27 trabajos por mes".
- **Distribuidora familiar sin nombre.** Va sin nombre y sin foto, porque no sé si es López y López o Distribuidora Martín.
- **Carga diferida de las etiquetas.** Si alguna campaña optimiza por vistas de la página de destino, revisá el punto de medición antes de publicar.
