# Webhook de leads → Google Sheets

Conecta el formulario del autodiagnóstico de la landing de Meta Ads
(`pages/diagnostico.html`) con una planilla de Google. Cada lead queda como
una fila en la planilla y además llega un mail de aviso. Gratis y sin límite
de envíos (a diferencia de Formspree).

## Paso a paso (una sola vez, ~10 minutos)

1. **Crear la planilla**: entrá a [sheets.new](https://sheets.new) con la cuenta
   de Google de Fluir y nombrala, por ejemplo, `Leads Autodiagnóstico`.
   No hace falta crear columnas: el script arma los encabezados solo.

2. **Abrir el editor de scripts**: en la planilla, menú
   **Extensiones → Apps Script**.

3. **Pegar el código**: borrá lo que haya en el editor y pegá todo el contenido
   de [`Code.gs`](Code.gs) (el archivo que está en esta misma carpeta).
   - Si querés que el aviso llegue a otra casilla, cambiá `NOTIFY_EMAIL` arriba
     de todo.
   - Guardá con el ícono de disquete (o Ctrl+S).

4. **Publicar como aplicación web**: botón azul **Implementar → Nueva implementación**.
   - En el engranaje ⚙ elegí **Aplicación web**.
   - **Ejecutar como**: *Yo* (tu cuenta).
   - **Quién tiene acceso**: *Cualquier usuario* ← importante, si no el
     formulario no puede mandarle datos.
   - Click en **Implementar**. Google te va a pedir autorizar permisos
     (planilla + mail): aceptá, y si aparece "Google no verificó esta app",
     andá a *Configuración avanzada → Ir a... (no seguro)* — es tu propio script.

5. **Copiar la URL**: te muestra una URL que termina en `/exec`
   (algo como `https://script.google.com/macros/s/AKfycb.../exec`). Copiala.

6. **Pegarla en la landing**: en `pages/diagnostico.html`, línea ~28:

   ```js
   var LEAD_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```

   Subí el archivo al hosting y listo.

## Probar que funciona

Abrí `pages/diagnostico.html`, completá el quiz con datos de prueba y tocá
"Ver mi resultado". En menos de un minuto tiene que aparecer la fila en la
planilla y llegarte el mail de aviso. Si no llega, revisá en Apps Script el
menú **Ejecuciones** (ícono de reloj) para ver el error.

## Si cambiás el código del script

Cada vez que edites `Code.gs` en Apps Script tenés que volver a
**Implementar → Administrar implementaciones → ✏ editar → Versión: Nueva → Implementar**.
La URL no cambia, no hace falta tocar la landing.

## Mail automático al lead (opcional)

El script ya trae la opción: cambiá `SEND_RESULT_TO_LEAD` a `true` y el lead
recibe su resultado por mail desde tu cuenta de Google. Tope de Gmail:
~100 mails/día por cuenta (de sobra para el volumen actual).
