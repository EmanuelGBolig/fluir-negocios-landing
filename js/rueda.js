/* ============================================================
   Fluir Negocios — Los 5 Pilares + La Rueda del Negocio
   Vanilla JS, sin dependencias. El radar se dibuja en <canvas>
   y el pentágono de los pilares en SVG inline generado acá.
   ============================================================ */
(function () {
    'use strict';

    /* Endpoint de captación del lead.
       Para migrar al Apps Script de webhook/, cambiar solo esta constante. */
    var LEAD_ENDPOINT = 'https://formspree.io/f/mredepgv';
    var WA_NUMERO = '5492235295052';

    /* ------------------------------------------------------------
       CONTENIDO — editable sin tocar la lógica de más abajo.
       ------------------------------------------------------------ */
    var PILARES = [
        {
            num: '01', corto: 'Finanzas', nombre: 'Administración y Finanzas',
            icono: 'fa-solid fa-coins', c1: '#0F52BA', c2: '#0B3E8C', claro: '#5AA9F0',
            lema: 'Los números que te dicen la verdad.',
            desc: 'Saber exactamente cuánto entra, cuánto sale y cuánto queda. Es el pilar que convierte las sensaciones en decisiones: sin números reales, todo lo demás es una apuesta.',
            items: ['Flujo de caja proyectado', 'Margen real por producto', 'Tablero de KPIs', 'Sueldo del dueño separado', 'Punto de equilibrio', 'Precios con criterio'],
            rol: 'Referente en Administración y Finanzas',
            cuello: 'Hoy tomás decisiones sin saber con certeza cuánto ganás ni dónde se te va la plata. Mientras el pilar financiero esté flojo, cualquier crecimiento amplifica el desorden en vez de resolverlo.',
            preguntas: [
                { q: 'Sé exactamente cuánto ganó mi negocio el mes pasado, sin tener que estimarlo.', rec: 'Armar el estado de resultados mensual real, con ingresos, costos y gastos fijos separados. Es el primer número que un dueño tiene que poder decir de memoria.' },
                { q: 'Tengo un sueldo definido y separado de la caja del negocio.', rec: 'Definir un sueldo fijo para el dueño y sacarlo de la caja diaria. Sin esa separación, ninguna decisión financiera es honesta.' },
                { q: 'Conozco el margen real de cada producto o servicio que vendo.', rec: 'Calcular el margen real por línea (costo + gastos estructurales) y escribir una tabla de precios base que el equipo pueda usar sin consultarte.' },
                { q: 'Proyecto los cobros y pagos de las próximas semanas antes de comprar.', rec: 'Construir un flujo de caja proyectado a 8 semanas y calendarizar las compras según los plazos reales de cobro.' }
            ]
        },
        {
            num: '02', corto: 'Operaciones', nombre: 'Producto, Servicio y Logística',
            icono: 'fa-solid fa-boxes-stacked', c1: '#0F52BA', c2: '#00B4D8', claro: '#3FC9E8',
            lema: 'Que lo que entregás sea siempre igual de bueno.',
            desc: 'Lo que vendés y cómo lo entregás, siempre igual de bien, esté quien esté. Acá viven la calidad, el stock, los tiempos y el costo real de cada entrega.',
            items: ['Procesos documentados', 'Costo y tiempo por unidad', 'Control de stock', 'Estándar de calidad', 'Proveedores y compras', 'Postventa'],
            rol: 'Referente en Operaciones y Logística',
            cuello: 'La calidad y los tiempos dependen de que vos estés mirando. Es el pilar que más rápido se rompe cuando el negocio crece, porque lo que hoy sostiene tu memoria mañana lo tiene que sostener un proceso.',
            preguntas: [
                { q: 'Los procesos clave están escritos y no dependen de mi memoria.', rec: 'Documentar los 3 procesos críticos del negocio en formato paso a paso. Con asistencia de IA se resuelve en días, no en meses.' },
                { q: 'La calidad de lo que entregamos se mantiene igual cuando yo no estoy.', rec: 'Definir un estándar de calidad medible y un control simple (checklist o mystery shopper quincenal) que funcione sin tu presencia.' },
                { q: 'Sé cuánto tiempo y cuánto cuesta producir o entregar cada cosa que vendo.', rec: 'Medir tiempo y costo real por unidad entregada. Es el dato que sostiene el precio y el que revela la pérdida oculta.' },
                { q: 'Manejo el stock y las compras con datos, no por sensación.', rec: 'Definir stock mínimo y punto de recompra por producto, y conectar el sistema de stock con el de ventas para eliminar la doble carga.' }
            ]
        },
        {
            num: '03', corto: 'Marketing', nombre: 'Marketing, Comunicación y Publicidad',
            icono: 'fa-solid fa-bullhorn', c1: '#00B4D8', c2: '#48C6EF', claro: '#6FD4F5',
            lema: 'Que te encuentren, te entiendan y te elijan.',
            desc: 'Un sistema de captación predecible, no una cuenta de Instagram con la que se hace lo que se puede. Que el cliente te encuentre, entienda qué hacés y tenga motivos para elegirte.',
            items: ['Propuesta de valor clara', 'Canales de captación', 'Presencia digital', 'Origen de cada consulta', 'Publicidad medida', 'Contenido con criterio'],
            rol: 'Referente en Marketing y Comunicación',
            cuello: 'La llegada de clientes depende del boca en boca y de la suerte del mes. Sin un sistema de captación medible, tu facturación siempre va a ser una montaña rusa que no controlás.',
            preguntas: [
                { q: 'Tengo una forma predecible de conseguir clientes nuevos todos los meses.', rec: 'Elegir un canal de captación y sostenerlo con constancia hasta volverlo medible. Un canal bien hecho vale más que cuatro a medias.' },
                { q: 'Sé de dónde viene cada cliente que me contacta.', rec: 'Instalar una pregunta de origen en el primer contacto y registrarla siempre. Sin ese dato, toda inversión publicitaria es a ciegas.' },
                { q: 'Mi negocio se ve profesional donde el cliente lo busca (Google, redes, web).', rec: 'Ordenar la ficha de Google, la web y el perfil de Instagram. Es la primera impresión que hoy estás dejando sin controlar.' },
                { q: 'Puedo explicar en una frase por qué me eligen a mí y no a la competencia.', rec: 'Escribir la propuesta de valor en una sola oración y bajarla a toda la comunicación. Si no la tenés clara vos, el cliente tampoco.' }
            ]
        },
        {
            num: '04', corto: 'Equipo', nombre: 'Equipo y Liderazgo',
            icono: 'fa-solid fa-users-gear', c1: '#20C997', c2: '#48C6EF', claro: '#3FE0B4',
            lema: 'Gente que decide sin preguntarte.',
            desc: 'Personas que saben qué se espera de ellas y resuelven sin consultarte. Roles claros, feedback real y encargados que absorben el día a día antes de que llegue a vos.',
            items: ['Roles y expectativas', 'Delegación efectiva', 'Reuniones con estructura', 'Feedback y evaluación', 'Cultura y valores', 'Plan de desarrollo'],
            rol: 'Referente en Equipo y Liderazgo',
            cuello: 'Sos el centro de información y de decisión del negocio. Cada consulta que te llega es tiempo que no dedicás a lo estratégico, y es también la razón por la que no podés irte una semana.',
            preguntas: [
                { q: 'Cada persona del equipo sabe qué se espera de ella sin que se lo recuerde.', rec: 'Escribir el manual de funciones por puesto: qué hace, qué no hace, cómo resuelve lo frecuente y a quién escala.' },
                { q: 'Hay alguien que resuelve los problemas del día a día sin consultarme.', rec: 'Designar un encargado con autoridad real e instalar la regla: no se trae un problema sin una posible solución.' },
                { q: 'Tengo reuniones de equipo con estructura y frecuencia fija.', rec: 'Instalar la reunión semanal de 30 minutos con agenda fija y acta. Es la herramienta de gestión más barata que existe.' },
                { q: 'Doy feedback concreto cuando algo se hace bien y cuando se hace mal.', rec: 'Adoptar un modelo simple de feedback (situación, conducta, impacto) y usarlo al menos una vez por semana con cada referente.' }
            ]
        },
        {
            num: '05', corto: 'Alianzas', nombre: 'Socios Estratégicos y Aliados',
            icono: 'fa-solid fa-handshake', c1: '#2ECC71', c2: '#20C997', claro: '#4FE08C',
            lema: 'Con quién crecés.',
            desc: 'Proveedores, alianzas, derivaciones y asesores externos: la red que multiplica lo que tu estructura sola no puede. Es la palanca más barata que tenés disponible.',
            items: ['Acuerdos con proveedores', 'Alianzas y derivaciones', 'Asesores externos', 'Plan B ante dependencias', 'Red de contactos activa', 'Negociación con criterio'],
            rol: 'Referente en Alianzas Estratégicas',
            cuello: 'Estás creciendo solo, con lo que tu estructura puede. Las alianzas y los acuerdos claros son la palanca más barata que tenés disponible, y hoy está sin usar.',
            preguntas: [
                { q: 'Tengo acuerdos claros y escritos con mis proveedores clave.', rec: 'Formalizar condiciones con los 3 proveedores críticos: precios, plazos de entrega y respuesta ante imprevistos.' },
                { q: 'Genero negocio a través de alianzas o derivaciones con otros.', rec: 'Identificar 3 negocios que le hablan al mismo cliente que vos y proponer un acuerdo de derivación mutua con reglas claras.' },
                { q: 'Cuento con asesores externos que aportan criterio, no sólo trámite.', rec: 'Revisar si tu contador, tu abogado y tu asesor comercial aportan decisiones o sólo papeles. El criterio externo se elige, no se hereda.' },
                { q: 'Si mañana pierdo a mi proveedor o aliado principal, tengo un plan B.', rec: 'Mapear las dependencias críticas del negocio y conseguir al menos un proveedor alternativo ya probado para cada una.' }
            ]
        }
    ];

    var ESCALA = [
        { v: 1, t: 'Nunca' }, { v: 2, t: 'Casi nunca' }, { v: 3, t: 'A veces' },
        { v: 4, t: 'Casi siempre' }, { v: 5, t: 'Siempre' }
    ];

    var ETAPAS = [
        { max: 3.4, nombre: 'Autoempleo', color: '#FF8A65', texto: 'Hoy el negocio sos vos. Tiene demanda y capacidad, pero todo pasa por tu cabeza. El trabajo de los próximos meses es sacar el negocio de adentro tuyo.' },
        { max: 5.9, nombre: 'En transición', color: '#FFC661', texto: 'Ya hay estructura, pero todavía no sostiene sola. Estás en el punto donde ordenar un pilar destraba a los otros: es el mejor momento para intervenir.' },
        { max: 7.9, nombre: 'Empresa en formación', color: '#48C6EF', texto: 'El negocio funciona con sistema y no sólo con tu presencia. El desafío ahora es consolidar lo que falta y preparar la estructura para el próximo salto de volumen.' },
        { max: 10, nombre: 'Empresa autónoma', color: '#20C997', texto: 'Tu negocio opera con autonomía real. Lo que sigue no es ordenar: es escalar, profesionalizar la conducción y decidir dónde poner el crecimiento.' }
    ];

    /* ------------------------------------------------------------ Utilidades */
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }
    function num1(n) { return n.toFixed(1).replace('.', ','); }
    function hexA(hex, a) {
        var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
    function etapaDe(p) {
        for (var i = 0; i < ETAPAS.length; i++) { if (p <= ETAPAS[i].max) return ETAPAS[i]; }
        return ETAPAS[ETAPAS.length - 1];
    }

    /* ============================================================
       1) LOS 5 PILARES — pentágono SVG + tabs + panel de detalle
       ============================================================ */
    var elDiagrama = document.getElementById('pilaresDiagrama');
    var elTabs = document.getElementById('pilaresTabs');
    var elDetalle = document.getElementById('pilarDetalle');
    var pilarActivo = 0;

    var CX = 200, CY = 198, R = 118;

    function vertices(radio) {
        var pts = [];
        for (var i = 0; i < 5; i++) {
            var a = -Math.PI / 2 + i * (2 * Math.PI / 5);
            pts.push([CX + radio * Math.cos(a), CY + radio * Math.sin(a)]);
        }
        return pts;
    }
    function poly(radio) {
        return vertices(radio).map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    }

    function pintarDiagrama() {
        if (!elDiagrama) return;
        var act = PILARES[pilarActivo];
        var svg = '<svg viewBox="0 0 400 400" class="pd-svg" role="img" aria-label="Los 5 pilares del negocio">';
        // anillos
        [0.35, 0.55, 0.78, 1].forEach(function (f, i) {
            svg += '<polygon points="' + poly(R * f) + '" class="pd-anillo' + (i === 3 ? ' pd-anillo-ext' : '') + '"/>';
        });
        // ejes
        vertices(R).forEach(function (p) {
            svg += '<line x1="' + CX + '" y1="' + CY + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" class="pd-eje"/>';
        });
        // polígono decorativo (toma el color del pilar activo)
        svg += '<polygon points="' + poly(R * 0.62) + '" class="pd-relleno" style="stroke:' + act.claro + '"/>';
        // nodos
        vertices(R).forEach(function (p, i) {
            var pil = PILARES[i];
            var esAct = i === pilarActivo;
            var lx = CX + (R + 34) * Math.cos(-Math.PI / 2 + i * (2 * Math.PI / 5));
            var ly = CY + (R + 34) * Math.sin(-Math.PI / 2 + i * (2 * Math.PI / 5));
            // ancla del texto según posición (evita que se salga del viewBox)
            var anchor = 'middle';
            if (lx > CX + 12) anchor = 'start';
            else if (lx < CX - 12) anchor = 'end';
            svg += '<g class="pd-nodo' + (esAct ? ' es-activo' : '') + '" data-pilar="' + i + '" tabindex="0" role="button" ' +
                'aria-label="Pilar ' + pil.num + ': ' + esc(pil.nombre) + '" style="--pc:' + pil.claro + ';--po:' + p[0].toFixed(1) + 'px;--pl:' + p[1].toFixed(1) + 'px">' +
                '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="21" class="pd-nodo-circ"/>' +
                '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 5).toFixed(1) + '" class="pd-nodo-num" text-anchor="middle">' + pil.num + '</text>' +
                '<text x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1) + '" class="pd-nodo-lbl" text-anchor="' + anchor + '">' + esc(pil.corto) + '</text>' +
                '</g>';
        });
        svg += '</svg>';
        elDiagrama.innerHTML = svg;
    }

    function pintarTabs() {
        if (!elTabs) return;
        elTabs.innerHTML = PILARES.map(function (p, i) {
            var act = i === pilarActivo;
            return '<button class="pilar-tab' + (act ? ' es-activo' : '') + '" data-pilar="' + i + '" role="tab" ' +
                'aria-selected="' + act + '" style="--pc1:' + p.c1 + ';--pc2:' + p.c2 + '">' +
                '<i class="' + p.icono + '" aria-hidden="true"></i><span>' + esc(p.corto) + '</span></button>';
        }).join('');
    }

    function pintarDetalle() {
        if (!elDetalle) return;
        var p = PILARES[pilarActivo];
        elDetalle.innerHTML =
            '<div class="pilar-franja" style="background:linear-gradient(90deg,' + p.c1 + ',' + p.c2 + ')"></div>' +
            '<div class="pilar-cuerpo">' +
            '<div class="pilar-encabezado">' +
            '<div class="pilar-icono" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')"><i class="' + p.icono + '" aria-hidden="true"></i></div>' +
            '<div><span class="pilar-kicker">Pilar ' + p.num + ' de 5</span><h3 class="pilar-titulo">' + esc(p.nombre) + '</h3></div>' +
            '</div>' +
            '<p class="pilar-desc">' + esc(p.desc) + '</p>' +
            '<ul class="pilar-items">' + p.items.map(function (it) {
                return '<li><i class="fa-solid fa-circle-check" style="color:' + p.c2 + '" aria-hidden="true"></i> ' + esc(it) + '</li>';
            }).join('') + '</ul>' +
            '<div class="pilar-referente">' +
            '<span class="pilar-badge">&#9998; Completar</span>' +
            '<div class="pilar-ref-foto" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')">NN</div>' +
            '<div class="pilar-ref-datos">' +
            '<span class="pilar-ref-rol">' + esc(p.rol) + '</span>' +
            '<h4 class="pilar-ref-nombre">Nombre y Apellido</h4>' +
            '<p class="pilar-ref-desc">Breve descripción del perfil: formación, años de experiencia y qué resuelve concretamente dentro del negocio del cliente.</p>' +
            '</div></div></div>';
    }

    function activarPilar(i) {
        pilarActivo = i;
        pintarDiagrama();
        pintarTabs();
        pintarDetalle();
    }

    if (elTabs && elDetalle) {
        elTabs.addEventListener('click', function (e) {
            var b = e.target.closest('[data-pilar]');
            if (b) activarPilar(parseInt(b.getAttribute('data-pilar'), 10));
        });
    }
    if (elDiagrama) {
        elDiagrama.addEventListener('click', function (e) {
            var g = e.target.closest('.pd-nodo');
            if (g) activarPilar(parseInt(g.getAttribute('data-pilar'), 10));
        });
        elDiagrama.addEventListener('keydown', function (e) {
            var g = e.target.closest('.pd-nodo');
            if (!g) return;
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                activarPilar(parseInt(g.getAttribute('data-pilar'), 10));
            }
        });
    }
    if (elDetalle) activarPilar(0);

    /* ============================================================
       2) LA RUEDA DEL NEGOCIO
       ============================================================ */
    var elPasos = document.getElementById('ruedaPasos');
    var elProgreso = document.getElementById('ruedaProgreso');
    var elResultado = document.getElementById('ruedaResultado');
    if (!elPasos || !elResultado) return;

    var pasoActual = 0;                 // 0..4 pilares, 5 = resultado
    var respuestas = [];                // respuestas[p][q] = 1..5
    var autos = [];                     // autos[p] = 0 (sin tocar) o 1..10

    function estadoLimpio() {
        respuestas = PILARES.map(function () { return [null, null, null, null]; });
        autos = PILARES.map(function () { return 0; });
        pasoActual = 0;
    }

    function pintarProgreso() {
        if (!elProgreso) return;
        var html = '';
        for (var i = 0; i < PILARES.length + 1; i++) {
            var cls = i < pasoActual ? ' es-hecho' : (i === pasoActual ? ' es-activo' : '');
            html += '<span class="rueda-seg' + cls + '"></span>';
        }
        elProgreso.innerHTML = html;
    }

    function pasoCompleto(i) {
        return respuestas[i].every(function (r) { return r !== null; }) && autos[i] > 0;
    }

    function pintarPasos() {
        elPasos.innerHTML = PILARES.map(function (p, i) {
            var preguntas = p.preguntas.map(function (pr, j) {
                var opts = ESCALA.map(function (o) {
                    var sel = respuestas[i][j] === o.v ? ' es-elegida' : '';
                    return '<button type="button" class="rueda-opcion' + sel + '" data-p="' + i + '" data-q="' + j + '" data-v="' + o.v + '">' +
                        '<b>' + o.v + '</b><span>' + o.t + '</span></button>';
                }).join('');
                return '<div class="rueda-pregunta"><p class="rueda-pregunta-txt"><span class="rueda-pregunta-n">' + (i + 1) + '.' + (j + 1) + '</span> ' + esc(pr.q) + '</p>' +
                    '<div class="rueda-escala">' + opts + '</div></div>';
            }).join('');

            var a = autos[i];
            return '<div class="rueda-paso" data-paso="' + i + '">' +
                '<div class="rueda-paso-top">' +
                '<span class="rueda-paso-kicker" style="color:' + p.claro + '"><i class="' + p.icono + '" aria-hidden="true"></i> Pilar ' + p.num + ' · ' + esc(p.corto) + '</span>' +
                '<span class="rueda-paso-contador">Paso ' + (i + 1) + ' de 5</span>' +
                '</div>' +
                '<h3 class="rueda-paso-titulo">' + esc(p.nombre) + '</h3>' +
                '<p class="rueda-paso-bajada">' + esc(p.lema) + ' Respondé con lo que pasa hoy en tu negocio, no con lo que te gustaría que pase.</p>' +
                preguntas +
                '<div class="rueda-auto">' +
                '<p class="rueda-auto-txt">Ahora puntuate vos: del 1 al 10, ¿cómo está este pilar en tu negocio?</p>' +
                '<div class="rueda-auto-fila">' +
                '<input type="range" min="0" max="10" step="1" value="' + a + '" class="rueda-slider' + (a === 0 ? ' sin-tocar' : '') + '" data-p="' + i + '" aria-label="Autopuntaje del pilar ' + esc(p.corto) + '">' +
                '<span class="rueda-auto-valor" data-valor="' + i + '">' + (a === 0 ? '—' : a) + '</span>' +
                '</div>' +
                '<div class="rueda-auto-refs"><span>1 · Es un desastre</span><span>10 · Funciona solo</span></div>' +
                '</div>' +
                '<div class="rueda-nav">' +
                (i > 0 ? '<button type="button" class="btn-rueda-ghost" data-accion="atras">Volver</button>' : '<span></span>') +
                '<button type="button" class="btn-rueda" data-accion="siguiente" data-p="' + i + '"' + (pasoCompleto(i) ? '' : ' disabled') + '>' +
                (i === PILARES.length - 1 ? 'Ver mi resultado' : 'Siguiente pilar') + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>' +
                '</div>' +
                '</div>';
        }).join('');
        mostrarPaso();
    }

    function mostrarPaso() {
        var pasos = elPasos.querySelectorAll('.rueda-paso');
        for (var i = 0; i < pasos.length; i++) {
            pasos[i].classList.toggle('is-activo', i === pasoActual);
        }
        elResultado.classList.toggle('is-activo', pasoActual === PILARES.length);
        pintarProgreso();
    }

    function refrescarBoton(i) {
        var btn = elPasos.querySelector('[data-accion="siguiente"][data-p="' + i + '"]');
        if (btn) btn.disabled = !pasoCompleto(i);
    }

    /* --- interacción del cuestionario --- */
    elPasos.addEventListener('click', function (e) {
        var op = e.target.closest('.rueda-opcion');
        if (op) {
            var p = +op.getAttribute('data-p'), q = +op.getAttribute('data-q'), v = +op.getAttribute('data-v');
            respuestas[p][q] = v;
            var hermanos = op.parentNode.querySelectorAll('.rueda-opcion');
            for (var k = 0; k < hermanos.length; k++) hermanos[k].classList.remove('es-elegida');
            op.classList.add('es-elegida');
            refrescarBoton(p);
            return;
        }
        var acc = e.target.closest('[data-accion]');
        if (!acc) return;
        var a = acc.getAttribute('data-accion');
        if (a === 'atras') { if (pasoActual > 0) { pasoActual--; mostrarPaso(); irAlTope(); } }
        else if (a === 'siguiente') {
            var idx = +acc.getAttribute('data-p');
            if (!pasoCompleto(idx)) return;
            pasoActual++;
            if (pasoActual === PILARES.length) pintarResultado();
            mostrarPaso();
            irAlTope();
        }
    });

    elPasos.addEventListener('input', function (e) {
        var sl = e.target.closest('.rueda-slider');
        if (!sl) return;
        var p = +sl.getAttribute('data-p');
        var v = +sl.value;
        if (v < 1) { v = 1; sl.value = 1; }     // al moverlo, el mínimo real es 1
        autos[p] = v;
        sl.classList.remove('sin-tocar');
        var out = elPasos.querySelector('[data-valor="' + p + '"]');
        if (out) out.textContent = v;
        refrescarBoton(p);
    });

    function irAlTope() {
        var caja = document.querySelector('.rueda-caja');
        if (!caja) return;
        var y = caja.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) - 90;
        try { window.scrollTo({ top: y, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, y); }
    }

    /* --- cálculo --- */
    function puntajes() {
        return PILARES.map(function (p, i) {
            var suma = respuestas[i].reduce(function (a, b) { return a + (b || 0); }, 0);
            var prom = suma / 4;
            return Math.round(((prom - 1) / 4) * 10 * 10) / 10;
        });
    }

    function acciones(pts) {
        var lista = [];
        PILARES.forEach(function (p, i) {
            p.preguntas.forEach(function (pr, j) {
                var r = respuestas[i][j];
                if (r !== null && r <= 3) lista.push({ pilar: p, rec: pr.rec, prio: r + pts[i] });
            });
        });
        lista.sort(function (a, b) { return a.prio - b.prio; });
        return lista.slice(0, 5);
    }

    /* --- radar en canvas --- */
    var radarDatos = null, radarAnim = 0, resizeTimer = null;

    function dibujarRadar(prog) {
        var cv = document.getElementById('ruedaRadar');
        if (!cv || !radarDatos) return;
        var cont = cv.parentNode;
        var lado = Math.max(240, Math.min(cont.clientWidth || 340, 380));
        var dpr = window.devicePixelRatio || 1;
        cv.width = lado * dpr; cv.height = lado * dpr;
        cv.style.width = lado + 'px'; cv.style.height = lado + 'px';
        var ctx = cv.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, lado, lado);

        var cx = lado / 2, cy = lado / 2 + 4, rad = lado * 0.32;
        function pt(i, val) {
            var a = -Math.PI / 2 + i * (2 * Math.PI / 5);
            var d = rad * (val / 10);
            return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
        }
        // anillos + ejes
        ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 1;
        for (var r = 1; r <= 5; r++) {
            ctx.beginPath();
            for (var i = 0; i < 5; i++) {
                var p = pt(i, r * 2);
                i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
            }
            ctx.closePath(); ctx.stroke();
        }
        for (var i2 = 0; i2 < 5; i2++) {
            var e = pt(i2, 10);
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(e[0], e[1]); ctx.stroke();
        }
        function trazar(vals, color, relleno, punteado) {
            ctx.beginPath();
            for (var i = 0; i < 5; i++) {
                var p = pt(i, vals[i] * prog);
                i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
            }
            ctx.closePath();
            if (relleno) { ctx.fillStyle = relleno; ctx.fill(); }
            ctx.setLineDash(punteado ? [5, 4] : []);
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
            ctx.setLineDash([]);
        }
        trazar(radarDatos.auto, '#20C997', null, true);
        trazar(radarDatos.pts, '#00B4D8', 'rgba(0,180,216,0.22)', false);
        // puntos del puntaje calculado
        ctx.fillStyle = '#00B4D8';
        for (var i3 = 0; i3 < 5; i3++) {
            var pp = pt(i3, radarDatos.pts[i3] * prog);
            ctx.beginPath(); ctx.arc(pp[0], pp[1], 3.5, 0, Math.PI * 2); ctx.fill();
        }
        // etiquetas (clampeadas con measureText para que no se corten)
        ctx.font = '600 11px Inter, system-ui, sans-serif';
        ctx.textBaseline = 'middle';
        for (var i4 = 0; i4 < 5; i4++) {
            var lp = pt(i4, 12.6);
            var txt = PILARES[i4].corto + ' ' + num1(radarDatos.pts[i4]);
            var w = ctx.measureText(txt).width;
            ctx.textAlign = 'center';
            var x = lp[0];
            if (x - w / 2 < 4) x = w / 2 + 4;
            if (x + w / 2 > lado - 4) x = lado - 4 - w / 2;
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.fillText(txt, x, lp[1]);
        }
    }

    function animarRadar() {
        var ini = null, corrio = false;
        function paso(ts) {
            corrio = true;
            if (!ini) ini = ts;
            var t = Math.min((ts - ini) / 850, 1);
            dibujarRadar(1 - Math.pow(1 - t, 3));
            if (t < 1) radarAnim = requestAnimationFrame(paso);
        }
        cancelAnimationFrame(radarAnim);
        radarAnim = requestAnimationFrame(paso);
        /* Si la pestaña está oculta, requestAnimationFrame no corre:
           dibujamos igual para que el radar nunca quede en blanco. */
        setTimeout(function () { if (!corrio) dibujarRadar(1); }, 400);
    }

    window.addEventListener('resize', function () {
        if (!radarDatos) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { dibujarRadar(1); }, 160);
    });

    /* --- resultado --- */
    function pintarResultado() {
        var pts = puntajes();
        var general = Math.round((pts.reduce(function (a, b) { return a + b; }, 0) / 5) * 10) / 10;
        var et = etapaDe(general);
        radarDatos = { pts: pts, auto: autos.slice() };

        var orden = pts.map(function (v, i) { return { i: i, v: v }; }).sort(function (a, b) { return b.v - a.v; });
        var flojo = orden[orden.length - 1], fuerte = orden[0];

        // punto ciego
        var brechas = pts.map(function (v, i) { return { i: i, b: Math.round((autos[i] - v) * 10) / 10 }; });
        var mayor = brechas.slice().sort(function (a, b) { return b.b - a.b; })[0];
        var menor = brechas.slice().sort(function (a, b) { return a.b - b.b; })[0];
        var ciego;
        if (mayor.b >= 2) {
            ciego = 'Te puntuaste <b>' + autos[mayor.i] + '/10</b> en <b>' + esc(PILARES[mayor.i].nombre) + '</b>, pero tus respuestas dan <b>' + num1(pts[mayor.i]) + '/10</b>. Esa brecha de ' + num1(mayor.b) + ' puntos suele ser el lugar donde más plata se pierde: es el pilar que creés resuelto y no lo está.';
        } else if (menor.b <= -2) {
            ciego = 'Te puntuaste <b>' + autos[menor.i] + '/10</b> en <b>' + esc(PILARES[menor.i].nombre) + '</b>, pero tus respuestas dan <b>' + num1(pts[menor.i]) + '/10</b>. Estás siendo más duro con vos mismo de lo que corresponde: ahí ya tenés un activo construido que podés capitalizar.';
        } else {
            ciego = 'Tu autopercepción está bastante alineada con lo que muestran tus respuestas, sin brechas mayores a 2 puntos. Es buena señal: sabés dónde estás parado, y eso acelera muchísimo cualquier proceso de mejora.';
        }

        var accs = acciones(pts);
        var accHtml = accs.length
            ? accs.map(function (a, k) {
                return '<li><span class="rueda-acc-n">' + (k + 1) + '</span><div><span class="rueda-acc-pilar" style="color:' + a.pilar.claro + '">' + esc(a.pilar.corto) + '</span>' + esc(a.rec) + '</div></li>';
            }).join('')
            : '<li><span class="rueda-acc-n">1</span><div>Tu negocio está ordenado en los cinco pilares. El próximo paso no es corregir: es definir el plan de escala y la conducción que lo sostenga.</div></li>';

        var rankHtml = orden.map(function (o) {
            var p = PILARES[o.i];
            return '<li><div class="rueda-rank-top"><span>' + esc(p.corto) + '</span><b>' + num1(o.v) + '</b></div>' +
                '<div class="rueda-barra"><i style="width:' + (o.v * 10) + '%;background:linear-gradient(90deg,' + p.c1 + ',' + p.c2 + ')"></i></div></li>';
        }).join('');

        var waMsg = encodeURIComponent('Hola, hice la Rueda del Negocio en la web. Mi puntaje general dio ' + num1(general) + '/10 (' + et.nombre + ') y mi pilar más flojo es ' + PILARES[flojo.i].nombre + '. Quiero coordinar el diagnóstico de 45 minutos.');
        var waUrl = 'https://wa.me/' + WA_NUMERO + '?text=' + waMsg;

        elResultado.innerHTML =
            '<div class="rueda-res-cabecera"><span class="rueda-paso-kicker">Tu resultado</span>' +
            '<h3 class="rueda-paso-titulo">Así está hoy la rueda de tu negocio</h3></div>' +
            '<div class="rueda-res-grid">' +
            '<div class="rueda-res-izq">' +
            '<div class="rueda-radar-caja"><canvas id="ruedaRadar" role="img" aria-label="Radar de los 5 pilares"></canvas></div>' +
            '<div class="rueda-leyenda"><span><i class="rueda-ll rueda-ll-calc"></i> Puntaje según tus respuestas</span><span><i class="rueda-ll rueda-ll-auto"></i> Tu autopercepción</span></div>' +
            '<div class="rueda-marcador">' +
            '<span class="rueda-marcador-num">' + num1(general) + '<small>/10</small></span>' +
            '<span class="rueda-etapa" style="color:' + et.color + ';background:' + hexA(et.color, 0.16) + '">' + esc(et.nombre) + '</span>' +
            '<p class="rueda-etapa-txt">' + esc(et.texto) + '</p>' +
            '</div></div>' +
            '<div class="rueda-res-der">' +
            '<div class="rueda-bloque"><h4>Tus 5 pilares, ordenados</h4><ul class="rueda-rank">' + rankHtml + '</ul></div>' +
            '<div class="rueda-bloque"><h4>Tu cuello de botella</h4>' +
            '<p class="rueda-destacado" style="color:' + PILARES[flojo.i].claro + '">' + esc(PILARES[flojo.i].nombre) + ' · ' + num1(flojo.v) + '/10</p>' +
            '<p>' + esc(PILARES[flojo.i].cuello) + '</p>' +
            '<p>Tu pilar más fuerte es <b>' + esc(PILARES[fuerte.i].nombre) + '</b> (' + num1(fuerte.v) + '/10): esa es la base sobre la que conviene apoyar el trabajo.</p></div>' +
            '<div class="rueda-bloque"><h4>Tu punto ciego</h4><p>' + ciego + '</p></div>' +
            '<div class="rueda-bloque"><h4>Por dónde empezaría un consultor Fluir</h4><ul class="rueda-acciones">' + accHtml + '</ul></div>' +
            '</div></div>' +

            '<div class="rueda-lead" id="ruedaLead">' +
            '<h4>¿Querés el informe completo y una lectura profesional?</h4>' +
            '<p>Te enviamos el detalle pilar por pilar y coordinamos el diagnóstico de 45 minutos con un consultor, sin cargo. Ya viste tu resultado: esto es el paso siguiente.</p>' +
            '<div class="rueda-form">' +
            '<div class="rueda-campo"><label for="ruNombre">Tu nombre</label><input id="ruNombre" type="text" autocomplete="name" placeholder="Nombre y apellido"><span class="rueda-error" id="ruErrNombre">Decinos tu nombre.</span></div>' +
            '<div class="rueda-campo"><label for="ruNegocio">Tu negocio</label><input id="ruNegocio" type="text" autocomplete="organization" placeholder="Nombre del negocio"></div>' +
            '<div class="rueda-campo"><label for="ruEmail">Tu email</label><input id="ruEmail" type="email" inputmode="email" autocomplete="email" placeholder="vos@tunegocio.com"><span class="rueda-error" id="ruErrEmail">Poné un email válido.</span></div>' +
            '<div class="rueda-campo"><label for="ruWsp">Tu WhatsApp</label><input id="ruWsp" type="tel" inputmode="tel" autocomplete="tel" placeholder="223 555 0000"></div>' +
            '</div>' +
            '<button type="button" class="btn-rueda" data-accion="enviarLead">Quiero el informe completo <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>' +
            '<p class="rueda-legal">Sin spam. Usamos tus datos sólo para enviarte el informe y coordinar la reunión.</p>' +
            '</div>' +

            '<div class="rueda-res-pie">' +
            '<button type="button" class="btn-rueda-ghost" data-accion="rehacer">Rehacer el diagnóstico</button>' +
            '<a class="btn-rueda-wa" href="' + waUrl + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Hablar con un consultor</a>' +
            '</div>';

        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) dibujarRadar(1); else animarRadar();

        // guardar para el envío del lead
        elResultado.__datos = { pts: pts, general: general, etapa: et, waUrl: waUrl };
    }

    /* --- acciones del resultado --- */
    elResultado.addEventListener('click', function (e) {
        var acc = e.target.closest('[data-accion]');
        if (!acc) return;
        var a = acc.getAttribute('data-accion');

        if (a === 'rehacer') {
            estadoLimpio();
            radarDatos = null;
            elResultado.innerHTML = '';
            pintarPasos();
            irAlTope();
            return;
        }

        if (a === 'enviarLead') {
            var n = document.getElementById('ruNombre');
            var em = document.getElementById('ruEmail');
            var neg = document.getElementById('ruNegocio');
            var w = document.getElementById('ruWsp');
            var okN = n.value.trim().length > 0;
            var okE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim());
            document.getElementById('ruErrNombre').style.display = okN ? 'none' : 'block';
            document.getElementById('ruErrEmail').style.display = okE ? 'none' : 'block';
            if (!okN) { n.focus(); return; }
            if (!okE) { em.focus(); return; }

            var d = elResultado.__datos || {};
            var detalle = PILARES.map(function (p, i) {
                return p.nombre + ': calculado ' + num1(d.pts[i]) + '/10, autopercibido ' + autos[i] + '/10';
            }).join(' | ');

            try {
                var fd = new FormData();
                fd.set('_subject', 'Rueda del Negocio — nuevo lead');
                fd.set('origen', 'Rueda del Negocio — 5 Pilares');
                fd.set('nombre', n.value.trim());
                fd.set('negocio', neg.value.trim());
                fd.set('email', em.value.trim());
                fd.set('whatsapp', w.value.trim());
                fd.set('puntaje_general', num1(d.general) + '/10');
                fd.set('etapa', d.etapa ? d.etapa.nombre : '');
                fd.set('detalle_pilares', detalle);
                fetch(LEAD_ENDPOINT, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
                    .catch(function () { /* no bloquear la experiencia si falla */ });
            } catch (err) { }

            if (window.fbq) {
                try { window.fbq('track', 'Lead', { content_name: 'Rueda del Negocio' }); } catch (err) { }
            }

            var caja = document.getElementById('ruedaLead');
            if (caja) {
                caja.innerHTML = '<div class="rueda-exito"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>' +
                    '<h4>Listo, recibimos tus datos</h4>' +
                    '<p>Te vamos a escribir para pasarte el informe completo y coordinar el diagnóstico de 45 minutos.</p>' +
                    '<a class="btn-rueda-wa" href="' + (d.waUrl || 'https://wa.me/' + WA_NUMERO) + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Hablar ahora por WhatsApp</a></div>';
            }
        }
    });

    /* --- arranque: siempre en blanco --- */
    estadoLimpio();
    pintarPasos();
})();
