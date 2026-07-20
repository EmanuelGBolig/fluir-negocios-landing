# README — Landing Page de Martín Troncoso (Martín Troncoso · Negocios Exitosos)

Página de marca personal tipo hub / single-page para **Martín Troncoso**, alojada en la webapp de **Fluir Negocios** en `pages/martin-troncoso.html`.

---

## 🚀 Cómo Ejecutar y Probar la Página

1. **Abrir localmente**:
   - Abrí el archivo [pages/martin-troncoso.html](file:///c:/Users/Usuario/Documents/Fluir%20Negocios/Landing/FN%20Landing/pages/martin-troncoso.html) directamente en cualquier navegador moderno o utilizando un servidor estático (ej: `npx serve .` o Live Server en VSCode).
2. **Navegación**:
   - Probá la navegación sticky con achicamiento de header al hacer scroll.
   - Probá el menú hamburguesa en vista mobile.
   - Probá las respuestas del acordeón FAQ.
   - Comprobá la validación y prueba de envío del formulario de contacto.

---

## 📋 Lista Completa de Placeholders a Completar (`{{...}}`)

Para pasar de producción de staging a producción final, reemplazá los siguientes valores en [pages/martin-troncoso.html](file:///c:/Users/Usuario/Documents/Fluir%20Negocios/Landing/FN%20Landing/pages/martin-troncoso.html):

| Placeholder | Descripción | Ubicación en Código / Valor sugerido |
| :--- | :--- | :--- |
| `{{NUMERO_WHATSAPP}}` | Número de WhatsApp internacional sin símbolos (ej: `5492235295052`) | Header, Hero, Indicadores, Pains, Contacto, Footer |
| `{{FORM_ENDPOINT}}` | URL del servicio de recepción de formulario (ej: `https://formspree.io/f/XXXXX` o Google Apps Script) | Formulario de contacto (`<form action="...">`) |
| `{{EMAIL_CONTACTO}}` | Correo electrónico institucional de Martín Troncoso | Footer y Schema.org JSON-LD |
| `{{N_NEGOCIOS}}` | Cantidad real de negocios y emprendedores acompañados (ej: `+150`) | Indicadores de confianza (Sección 3) |
| `{{RATING}}` | Puntuación media en Google Reviews (ej: `4.9` o `5.0`) | Indicadores de confianza (Sección 3) |
| `{{N_RESEÑAS}}` | Cantidad de opiniones registradas (ej: `48`) | Indicadores de confianza (Sección 3) |
| `{{FOTO_HERO}}` | Fotografía profesional de alta resolución para la sección Hero | `<img src="../assets/team/martin.png">` |
| `{{FOTO_SOBRE_MI}}` | Fotografía en acción o retrato cercano para la sección Sobre Mí | `<img src="../assets/team/martin.png">` |
| `{{DESCRIPCION_MARKETING}}` | Descripción de 1 línea de la consultora de marketing | Sección 8 (Servicios / Proyectos) |
| `{{LINK_CONSULTORA_MARKETING}}` | Link externo o ancla a la consultora de marketing | Sección 8 (Servicios / Proyectos) |
| `{{PROYECTOS_NUEVOS}}` | Descripción breve de proyectos personales / pasiones de Martín | Sección 8 (Servicios / Proyectos) |
| `{{LINK_OTROS_PROYECTOS}}` | Link a otros proyectos | Sección 8 (Servicios / Proyectos) |
| `{{PLACEHOLDER_TESTIMONIOS_ADICIONALES}}` | Bloque o carrusel para añadir videos/testimonios reales de dueños | Sección 9 (Casos reales) |
| `{{MODALIDAD_PRESENCIAL_ONLINE}}` | Detalle específico si es presencial en Mar del Plata u online global | Sección 11 (FAQ) |
| `{{OG_IMAGE_MARTIN}}` | Imagen de previsualización para redes sociales (1200x630px) | Meta tags de Open Graph en `<head>` |

---

## 🎨 Sistema de Estilos y Tokens

Todos los estilos de la marca de Martín Troncoso están centralizados en `css/martin-troncoso.css`:
- **Fondo**: Azul Marino `#0A1830` a Azul Noche `#060F20` (radial/diagonal).
- **Acentos**: Dorado `#C9A24B` y Dorado Claro `#D9B45C` para detalles, marcos y CTAs pill.
- **Tipografías**: Google Fonts `Lora` (serif para títulos y acento en itálica dorada) y `Lato` (sans-serif para cuerpo).
- **Íconos**: Lucide (versión stroke ~2.3 en dorado).
