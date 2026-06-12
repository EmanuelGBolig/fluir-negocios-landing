/**
 * Webhook de leads del autodiagnóstico (pages/diagnostico.html)
 *
 * Recibe el POST con el lead en JSON, lo guarda como una fila en la
 * hoja "Leads" de esta planilla y manda un mail de aviso.
 *
 * Cómo instalarlo: ver webhook/LEEME.md en el repo de la landing.
 */

// Mail donde llega el aviso de cada lead nuevo.
var NOTIFY_EMAIL = 'sistemas@fluircoaching.com';

// Si lo pasás a true, también le manda al lead un mail con su resultado.
var SEND_RESULT_TO_LEAD = false;

var SHEET_NAME = 'Leads';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // --- 1) Guardar en la planilla ---
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Fecha', 'Nombre', 'Email', 'WhatsApp', 'Score', 'Nivel',
      'Respuestas', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'Página'
    ]);
  }

  var respuestas = '';
  if (data.respuestas) {
    respuestas = Object.keys(data.respuestas).map(function (k) {
      return k + ': ' + data.respuestas[k];
    }).join('\n');
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.nombre || '',
    data.email || '',
    data.whatsapp || '',
    (data.score != null ? data.score + ' / ' + data.score_max : ''),
    data.nivel || '',
    respuestas,
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
    data.utm_content || '',
    data.pagina || ''
  ]);

  // --- 2) Aviso por mail ---
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Nuevo lead del autodiagnóstico: ' + (data.nombre || data.email || 'sin nombre'),
    body:
      'Nombre: ' + (data.nombre || '-') + '\n' +
      'Email: ' + (data.email || '-') + '\n' +
      'WhatsApp: ' + (data.whatsapp || '-') + '\n' +
      'Score: ' + (data.score != null ? data.score + ' / ' + data.score_max : '-') + '\n' +
      'Nivel: ' + (data.nivel || '-') + '\n\n' +
      'Respuestas:\n' + (respuestas || '-') + '\n\n' +
      'Campaña: ' + [data.utm_source, data.utm_medium, data.utm_campaign, data.utm_content].filter(String).join(' / ') + '\n' +
      'Página: ' + (data.pagina || '-') + '\n\n' +
      'Planilla: ' + ss.getUrl()
  });

  // --- 3) (Opcional) Mail al lead con su resultado ---
  if (SEND_RESULT_TO_LEAD && data.email) {
    MailApp.sendEmail({
      to: data.email,
      subject: 'Tu resultado del autodiagnóstico — Fluir Negocios',
      body:
        'Hola ' + (data.nombre ? data.nombre.split(' ')[0] : '') + '!\n\n' +
        'Gracias por hacer el autodiagnóstico. Tu nivel de dependencia operativa dio: ' +
        (data.nivel || '') + ' (' + data.score + ' de ' + data.score_max + ' puntos).\n\n' +
        'El próximo paso es la sesión gratuita de 45 minutos para armar tu plan: ' +
        'escribinos por WhatsApp o agendá desde la página.\n\n' +
        'Abrazo,\nEquipo Fluir Negocios'
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
