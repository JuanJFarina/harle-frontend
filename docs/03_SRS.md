# Especificación de requisitos de software

## Introducción

Este proyecto contiene la experiencia web de un asistente de IA todavía sin nombre comercial. Incluye una landing pública, registro, acceso, contratación y paneles privados para cuenta, finanzas y eventos. La conversación cotidiana permanece en Telegram.

El repositorio `harle-backend` es la fuente de verdad para identidades, autenticación, suscripciones, perfiles, cupos, vínculo con Telegram, gastos y eventos. Este frontend no debe reproducir reglas de negocio ni decidir por sí mismo si una modificación fue aceptada.

La primera integración real permite crear o recuperar una cuenta gratuita mediante Google, mantener una sesión segura y vincular una identidad de Telegram. Pagos, email y contraseña, y la administración persistente de los paneles permanecen pendientes.

## Entorno

- El público inicial son personas de aproximadamente 18 a 50 años en Argentina.
- La experiencia inicial usa español de Argentina, pesos argentinos, fechas locales y voseo.
- Los usuarios descubren y contratan el producto en la web, pero conversan con el asistente mediante Telegram.
- Una persona puede compartir datos sensibles: conversaciones, preferencias, ubicación, finanzas, agenda y contexto personal.
- El backend posee cuentas internas, perfiles, gastos, eventos, cupos, registro mediante Google, sesiones web y vínculo con Telegram.
- El acceso inicial usa Google OpenID Connect. Email y contraseña se incorporarán más adelante.
- Mercado Pago será el proveedor inicial para suscripciones recurrentes en ARS. La elección deberá revisarse si cambia el país o la entidad legal que opera el producto.
- Los planes iniciales serán Gratuito, Básico y Max. Costarán ARS 0, ARS 5.000 y ARS 15.000 por mes, respectivamente.
- Los límites mensuales serán 60, 480 y 1.920 conversaciones, y 15, 60 y 240 notificaciones de eventos, respectivamente.
- El backend debe ser la fuente de verdad del catálogo, los precios, los límites y el consumo.
- Las conversaciones y las notificaciones de eventos consumen cupos separados por período de suscripción. Los check-ins proactivos no consumen ninguno de esos cupos.

## Requisitos de usuario

- **UR-01 Descubrimiento**: una persona debe poder entender qué es el asistente, cómo se personaliza y cómo ayuda con finanzas, agenda y mensajes multimedia.
- **UR-02 Precios**: una persona debe poder comparar planes, precios, cupos y condiciones antes de registrarse.
- **UR-03 Registro**: una persona debe poder crear o recuperar una cuenta gratuita mediante Google.
- **UR-04 Suscripción**: una persona debe poder contratar, consultar, modificar o cancelar una suscripción mediante un flujo claro.
- **UR-05 Telegram**: una persona debe poder vincular de forma segura su cuenta con una identidad de Telegram.
- **UR-06 Cuenta**: una persona autenticada debe poder consultar y actualizar su perfil.
- **UR-07 Personalización**: una persona debe poder configurar el perfil del asistente y controlar sus interacciones proactivas.
- **UR-08 Uso**: una persona debe poder conocer el consumo y saldo de sus cupos durante el período vigente.
- **UR-09 Finanzas**: una persona debe poder consultar, crear, corregir y eliminar sus propios gastos y reintegros.
- **UR-10 Estadísticas**: una persona debe poder comprender sus gastos mediante resúmenes simples por período y categoría.
- **UR-11 Agenda**: una persona debe poder consultar, crear, modificar, desactivar, reactivar y eliminar sus eventos.
- **UR-12 Recordatorios**: una persona debe poder controlar el horario y la anticipación de sus recordatorios por Telegram.
- **UR-13 Privacidad**: una persona debe poder conocer el tratamiento de sus datos y solicitar su exportación o eliminación.
- **UR-14 Control**: ninguna modificación, pago o baja debe quedar confirmada en la interfaz antes de ser aceptada por el backend.
- **UR-15 Accesibilidad**: las funciones principales deben poder usarse desde teléfono o escritorio, con teclado y tecnologías de asistencia.

## Especificación del sistema

### Contrato requerido del backend

El catálogo detallado y las reglas de estos endpoints se definen en el SRS del backend y son la fuente de verdad. Este frontend depende del siguiente contrato mínimo:

- **API-01 Convenciones**: todos los endpoints de navegador usan `/api`, JSON en `snake_case`, fechas ISO e instantes RFC 3339.
- **API-02 Errores**: toda falla usa un sobre estable con código, mensaje seguro, errores de campo opcionales e identificador de solicitud.
- **API-03 Sesión**: la identidad se resuelve desde una cookie de sesión opaca, revocable, `Secure` y `HttpOnly`. Las mutaciones incluyen protección CSRF y nunca envían un UUID de usuario como prueba de propiedad.
- **API-04 Google**: `GET /api/auth/google/start` y `GET /api/auth/google/callback`.
- **API-05 Sesión**: `GET /api/session` y `POST /api/auth/logout`.
- **API-06 Telegram**: `GET` y `POST /api/account/telegram-link`.
- **API-07 Alcance posterior**: catálogo público, pagos, email y contraseña, mutaciones de cuenta, finanzas, eventos, exportación, eliminación y desvinculación de Telegram permanecen diferidos.

Los paneles que todavía no tienen endpoint deben continuar identificados como demostración y no pueden presentar sus acciones como persistentes.

### Sitio público

- **FR-01**: la ruta pública principal deberá presentar encabezado, introducción, capacidades, precios, preguntas frecuentes, registro y pie de página en un único recorrido vertical.
- **FR-02**: el encabezado deberá permitir navegar a secciones de la landing, iniciar sesión y comenzar el registro.
- **FR-03**: la introducción deberá priorizar la personalización y autonomía controlada del asistente, seguida por finanzas, agenda y multimedia.
- **FR-04**: la web deberá dejar claro que la conversación ocurre en Telegram y no simular un chat web operativo.
- **FR-05**: mientras no exista un catálogo público, la landing deberá mostrar los planes aprobados en la documentación y presentar únicamente el plan Gratuito como contratable.
- **FR-06**: el catálogo inicial deberá mostrar Gratuito con 60 conversaciones y 15 notificaciones, Básico por ARS 5.000 al mes con 480 conversaciones y 60 notificaciones, y Max por ARS 15.000 al mes con 1.920 conversaciones y 240 notificaciones.
- **FR-07**: las preguntas frecuentes deberán poder abrirse y cerrarse de manera accesible.
- **FR-08**: el pie deberá enlazar términos, privacidad, ayuda y medios de contacto.
- **FR-09**: el contenido público deberá tener títulos, descripciones, metadatos sociales y estructura semántica aptos para buscadores.

### Registro y autenticación

- **FR-10**: el frontend deberá iniciar Google mediante navegación a `GET /api/auth/google/start`, enviando locale y zona horaria.
- **FR-11**: el backend deberá completar el callback de Google y redirigir nuevamente a la ruta de registro del frontend.
- **FR-12**: la interfaz deberá tratar el primer acceso y los accesos posteriores con Google como un mismo flujo.
- **FR-13**: el frontend no deberá recibir ni almacenar códigos, tokens, `state`, `nonce` o datos internos del proveedor.
- **FR-14**: una sesión autenticada deberá usar cookies `Secure`, `HttpOnly` y con una política `SameSite` adecuada; los tokens de sesión persistentes no deberán guardarse en `localStorage`.
- **FR-15**: las operaciones que cambian estado deberán estar protegidas contra CSRF cuando la autenticación dependa de cookies.
- **FR-16**: el backend deberá limitar intentos de inicio y callback OAuth sin bloquear indiscriminadamente a otros usuarios.
- **FR-17**: la interfaz deberá reconciliar su estado autenticado mediante `GET /api/session` y distinguir carga, éxito, ausencia de sesión y fallas transitorias.
- **FR-18**: después de autenticarse, la persona deberá continuar con la vinculación de Telegram.

### Planes, pagos y suscripción

- **FR-19**: el backend deberá mantener el catálogo de planes, conservar la correspondencia `free`/Gratuito, `basic`/Básico y `max`/Max, y exponer únicamente planes activos y contratables.
- **FR-20**: la contratación de planes pagos permanecerá deshabilitada hasta que exista el endpoint de checkout.
- **FR-21**: credenciales, secretos y llamadas privilegiadas a Mercado Pago deberán permanecer exclusivamente en el backend.
- **FR-22**: el backend deberá correlacionar cada suscripción de Mercado Pago con una única cuenta interna mediante referencias no ambiguas.
- **FR-23**: el backend deberá validar y procesar notificaciones de Mercado Pago de forma idempotente.
- **FR-24**: una redirección exitosa desde Mercado Pago no deberá activar el plan por sí sola; el estado confirmado por el backend será la fuente de verdad.
- **FR-25**: el backend deberá sincronizar estado de suscripción, plan y límites exactos del período con el runtime del asistente.
- **FR-26**: el frontend deberá representar al menos los estados pendiente, activo, vencido, en mora, cancelado y revocado cuando el backend los informe.
- **FR-27**: el panel deberá mostrar inicio y fin exactos del período vigente y la próxima acción de cobro cuando esté disponible.
- **FR-28**: cambiar o cancelar un plan deberá mostrar el efecto y su fecha antes de pedir confirmación.
- **FR-29**: reintentos, reembolsos, prorrateo, períodos de gracia y cambios de plan no deberán implementarse hasta definir su política de producto.

### Vínculo con Telegram

- **FR-30**: el frontend deberá solicitar mediante `POST /api/account/telegram-link` un mecanismo de vinculación de corta duración, de un solo uso y asociado a la cuenta autenticada.
- **FR-31**: el vínculo deberá completarse mediante una interacción verificable con el bot, sin pedir al usuario que copie identificadores internos.
- **FR-32**: el backend deberá impedir que una identidad de Telegram quede vinculada simultáneamente a dos cuentas.
- **FR-33**: la interfaz deberá consultar `GET /api/account/telegram-link` y mostrar si Telegram está desconectado, pendiente o conectado, sin exponer identificadores sensibles.
- **FR-34**: reemplazar o desvincular Telegram deberá requerir una confirmación explícita y preservar una ruta de recuperación de cuenta.

### Cuenta y personalización

- **FR-35**: el registro deberá obtener de `GET /api/session` el nombre, plan gratuito, período vigente y estado de Telegram.
- **FR-36**: el usuario deberá poder actualizar nombre preferido, idioma, zona horaria y ubicación cuando esos campos estén habilitados.
- **FR-37**: la ubicación deberá admitir ausencia total o latitud y longitud válidas en conjunto.
- **FR-38**: el usuario deberá poder consultar y modificar el nombre visible y el perfil de comportamiento de su asistente.
- **FR-39**: el usuario deberá poder activar o desactivar las interacciones proactivas.
- **FR-40**: la frecuencia proactiva deberá admitir `high`, `medium` y `low`, presentadas como alta, media y baja; el backend conservará su significado temporal.
- **FR-41**: el consumo detallado permanecerá como dato de demostración hasta que el backend exponga un endpoint de uso.
- **FR-42**: los check-ins proactivos deberán indicarse como no consumidores de esos cupos.
- **FR-43**: la exportación y eliminación de cuenta deberán cubrir todos los datos propios cuando el backend implemente la política aprobada.
- **FR-44**: una eliminación irreversible deberá exigir reautenticación y una confirmación explícita.

### Finanzas personales

- **FR-45**: los futuros endpoints financieros deberán resolver al propietario desde la sesión y nunca aceptar otro usuario como autoridad desde el cliente.
- **FR-46**: el panel deberá listar movimientos por rango de fechas con paginación o carga acotada.
- **FR-47**: el panel deberá filtrar por tipo, categoría y período sin perder la zona horaria del usuario.
- **FR-48**: un movimiento deberá contener tipo gasto o reintegro, monto positivo, moneda ARS, fecha, categoría y descripción.
- **FR-49**: las categorías iniciales deberán corresponder a alquileres, servicios esenciales, servicios no esenciales, hogar, transporte, salidas, compras y otros, aunque sus identificadores internos difieran.
- **FR-50**: el alta desde la web deberá exigir una fecha explícita para evitar reglas implícitas de cambio de día.
- **FR-51**: una compra en cuotas deberá admitir entre 2 y 12 cuotas y mostrar número, total y grupo.
- **FR-52**: la actualización de un movimiento perteneciente a cuotas deberá advertir y aplicar el cambio al grupo completo.
- **FR-53**: la eliminación de un movimiento o grupo deberá ser permanente y requerir confirmación.
- **FR-54**: el backend deberá calcular montos y distribución de centavos; el frontend sólo deberá mostrar el resultado confirmado.
- **FR-55**: los resúmenes deberán mostrar gastos, reintegros y neto sin confundir un reintegro con un monto negativo ingresado.
- **FR-56**: las estadísticas deberán poder agruparse al menos por día, mes y categoría.

### Eventos personales

- **FR-57**: los futuros endpoints de eventos deberán resolver al propietario desde la sesión.
- **FR-58**: el panel deberá consultar eventos personales dentro de un rango de fechas acotado.
- **FR-59**: la interfaz inicial deberá administrar eventos de agenda del usuario y no exponer eventos internos del sistema.
- **FR-60**: un evento deberá admitir título, descripción, inicio, fin, zona horaria, día completo y anticipación de notificación.
- **FR-61**: el fin deberá ser posterior al inicio y los eventos de día completo deberán respetar límites de medianoche local.
- **FR-62**: un evento deberá ser único, semanal por una lista no vacía de días únicos, o mensual por una lista no vacía de días del 1 al 31.
- **FR-63**: la interfaz deberá explicar que una recurrencia mensual no ocurre en meses que carezcan del día elegido.
- **FR-64**: omitir la recurrencia al editar deberá conservarla; elegir explícitamente “no repetir” deberá convertir el evento en único.
- **FR-65**: desactivar deberá detener ocurrencias y notificaciones sin eliminar el evento; reactivar deberá reanudarlas.
- **FR-66**: la eliminación deberá ser permanente y requerir confirmación.
- **FR-67**: la anticipación deberá expresarse en términos comprensibles y convertirse al contrato esperado por el backend.
- **FR-68**: el panel deberá mostrar el cupo restante de notificaciones y aclarar que una entrega exitosa lo consume aunque luego se elimine el evento.

### Estados, errores y consistencia

- **FR-69**: toda mutación deberá impedir envíos duplicados mientras esté en curso y usar idempotencia del backend cuando corresponda.
- **FR-70**: después de una mutación, la interfaz deberá reconciliarse con la respuesta o una lectura confirmada del backend.
- **FR-71**: los errores deberán conservar los datos válidos del formulario y explicar una acción de recuperación.
- **FR-72**: una sesión vencida deberá pedir reingreso sin presentar una operación no confirmada como exitosa.
- **FR-73**: el frontend deberá diferenciar ausencia de datos, falta de permisos, validación, conflicto, límite agotado y falla temporal.
- **FR-74**: fechas y horas deberán intercambiarse con zona horaria explícita y mostrarse según la zona configurada por el usuario.

### Requisitos no funcionales

- **NFR-01 Privacidad**: la interfaz deberá minimizar la exposición de perfiles, finanzas, eventos e identificadores en URLs, logs, analítica y mensajes de error.
- **NFR-02 Aislamiento**: ningún dato almacenado en caché deberá aparecer en la sesión de otra cuenta.
- **NFR-03 Transporte**: todo tráfico de producción deberá usar HTTPS.
- **NFR-04 Seguridad web**: la aplicación deberá aplicar una política de seguridad de contenido, protección contra XSS, validación de entradas y dependencias mantenidas.
- **NFR-05 Accesibilidad**: la experiencia deberá aspirar a WCAG 2.2 nivel AA, con semántica, teclado, foco visible, contraste y anuncios de estado.
- **NFR-06 Diseño adaptable**: las funciones deberán operar en anchos móviles y de escritorio sin exigir desplazamiento horizontal para acciones principales.
- **NFR-07 Rendimiento**: la landing deberá cumplir los umbrales vigentes de Core Web Vitals en condiciones representativas.
- **NFR-08 Resiliencia**: una falla de red no deberá borrar formularios ni crear una falsa confirmación.
- **NFR-09 Compatibilidad**: se deberán soportar versiones modernas mantenidas de Chrome, Edge, Firefox y Safari.
- **NFR-10 Localización**: textos, monedas y fechas deberán centralizarse para permitir otros idiomas o regiones sin reescribir componentes.
- **NFR-11 SEO**: el contenido público deberá poder indexarse; los paneles privados no deberán indexarse.
- **NFR-12 Observabilidad**: errores y métricas deberán usar campos permitidos y excluir contraseñas, tokens, descripciones financieras, contenido de eventos y conversaciones.
- **NFR-13 Mantenibilidad**: reglas de planes, pagos, cuotas, recurrencia y permisos deberán permanecer en el backend, no duplicadas en componentes.
- **NFR-14 Coherencia visual**: la implementación deberá seguir los lineamientos de `../branding-docs` sin convertir valores exploratorios en decisiones permanentes.
- **NFR-15 Calidad**: los flujos críticos de acceso, pago, vínculo de Telegram y mutaciones deberán tener pruebas automatizadas proporcionales al riesgo.
- **NFR-16 Compatibilidad**: el frontend deberá validar el contrato `/api` mediante tipos o pruebas de consumidor y no depender de campos internos no documentados.
- **NFR-17 Seguridad del prototipo**: los fixtures y respuestas simuladas no deberán incluirse como fallback silencioso en producción ni mezclarse con una sesión real.

## Programa

El sistema web se divide conceptualmente en:

- **Experiencia pública**: landing, navegación por secciones, precios, preguntas frecuentes, registro inicial y contenido legal.
- **Aplicación autenticada**: estructura común de sesión y navegación para cuenta, finanzas y eventos.
- **Cliente de identidad**: formularios y estados para email, contraseña, Google, verificación, recuperación y cierre de sesión.
- **Cliente de suscripción**: catálogo, inicio de pago, retorno de Mercado Pago, estado del período y administración del plan.
- **Cliente de vinculación**: inicia y observa el proceso seguro de asociación con Telegram.
- **Cliente de cuenta**: perfil de usuario, perfil del asistente, proactividad, cupos, privacidad y baja.
- **Cliente financiero**: listado, formularios, grupos de cuotas, eliminación y resúmenes.
- **Cliente de eventos**: agenda, formularios, recurrencia, estados y recordatorios.
- **Capa de acceso al backend**: cliente tipado para `/api`, manejo uniforme de sesión, CSRF, errores y cancelación.
- **Repositorio backend**: `harle-backend` autentica, autoriza, valida, persiste, integra Google y Telegram, y expone datos ya aislados por usuario.

El flujo principal de alta será:

1. La persona conoce el producto y elige un plan.
2. Inicia Google OpenID Connect desde el backend.
3. El backend crea o recupera la cuenta gratuita y establece la sesión.
4. El frontend consulta la sesión y muestra el período mensual activo.
5. La persona genera un enlace temporal y lo abre en Telegram.
6. El frontend consulta el estado hasta confirmar el vínculo.
7. La persona continúa al panel, cuyas funciones persistentes se habilitarán por etapas.

Una modificación autenticada seguirá este flujo:

1. El frontend recopila y valida formato básico.
2. El backend autentica, resuelve al propietario, valida las reglas y ejecuta la operación.
3. El frontend muestra éxito sólo con una respuesta confirmada.
4. Ante incertidumbre, vuelve a consultar el estado antes de permitir una repetición riesgosa.

## Máquina

- El frontend usa Next.js 16, React 19 y TypeScript, con rutas públicas renderizables y paneles interactivos.
- El backend es `harle-backend`, basado en FastAPI y PostgreSQL.
- `NEXT_PUBLIC_HARLE_API_URL` deberá contener el origen HTTPS del backend, sin incluir `/api`.
- La integración deberá consumir exclusivamente el contrato `/api`; el frontend no tendrá acceso directo a PostgreSQL.
- `FRONTEND_REDIRECT_URL` en el backend deberá apuntar a la ruta `/registro` de este frontend para continuar el onboarding después de Google.
- El origen del frontend deberá estar incluido de forma explícita en `FRONTEND_ORIGINS` del backend.
- La integración inicial de pagos usará la API de suscripciones y webhooks de Mercado Pago.
- La autenticación con Google usará OAuth; la autenticación por email será propiedad del backend.
- Telegram seguirá siendo el canal de conversación y notificación.
- Frontend y backend deberán coordinar dominios, CORS, cookies, CSRF y redirecciones para mantener sesiones seguras.
- Los secretos de Google, Mercado Pago, Telegram, sesión y base de datos deberán residir únicamente en infraestructura protegida del backend.
- Los entornos de desarrollo, prueba y producción deberán usar credenciales, URLs de retorno y webhooks separados.
- La entrega deberá incluir compilación reproducible, controles de dependencias, pruebas críticas y despliegue sobre HTTPS.
- El monitoreo deberá cubrir errores de interfaz, autenticación, pagos, webhooks, vínculo con Telegram y endpoints, sin registrar contenido sensible.

## Decisiones pendientes

- Hosting, dominio y topología final entre frontend y backend.
- Nombre comercial y activos definitivos de marca.
- Prueba gratuita, tratamiento de impuestos y política para futuros ajustes de precios o cupos.
- Política de cambio de plan, cancelación, mora, reintento y reembolso.
- Flujo final de vinculación y reemplazo de Telegram.
- Proveedor de email transaccional, duración de sesión y política de vinculación con Google.
- Política legal de privacidad, retención, exportación y eliminación.
- Alcance fiscal y comprobantes de los cobros en Argentina.
- Objetivos medibles de disponibilidad y tiempos de respuesta.
