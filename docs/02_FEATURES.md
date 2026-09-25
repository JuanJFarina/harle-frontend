# Funcionalidades

## Estado actual

- **Prototipo navegable**: la landing, el acceso, el registro y los paneles de cuenta, finanzas y eventos están implementados en Next.js.
- **Datos de demostración**: los paneles permiten probar altas, ediciones, eliminaciones, filtros y preferencias sólo en memoria local.
- **Registro gratuito integrado**: el frontend crea o recupera una cuenta gratuita mediante Google, restaura la sesión y guía la vinculación con Telegram usando el contrato `/api`.
- **API bajo el origen del frontend**: Next.js reescribe `/api` hacia el backend para que las sesiones funcionen como cookies first-party aunque ambos proyectos estén desplegados en dominios diferentes.
- **Integración parcial**: pagos, email y contraseña, y la persistencia de los paneles permanecen pendientes.

## Producto inicial

### Sitio público

- **Landing de una sola página**: presenta al asistente, sus capacidades principales, los planes, las preguntas frecuentes y el inicio del registro en un único recorrido vertical.
- **Propuesta del asistente**: explica que puede personalizarse, aprender preferencias y comunicarse de manera proactiva bajo control del usuario.
- **Finanzas personales**: comunica el seguimiento de gastos, reintegros, cuotas, vencimientos y estadísticas.
- **Agenda personal**: comunica eventos únicos o recurrentes y recordatorios por Telegram.
- **Mensajes multimedia**: muestra que la conversación principal acepta texto, notas de voz, audio e imágenes en Telegram.
- **Precios transparentes**: compara planes, cupos de conversación y cupos de notificaciones como límites separados.
- **Preguntas frecuentes**: cubre funcionamiento, personalización, autonomía, Telegram, finanzas, eventos, multimedia, privacidad, suscripciones y cancelación.
- **Contenido legal y de ayuda**: ofrece acceso claro a términos, privacidad, soporte y condiciones de contratación.

### Planes iniciales

- **Gratuito**: sin costo, con 60 conversaciones y 15 notificaciones de eventos por período mensual.
- **Básico**: ARS 5.000 por mes, con 480 conversaciones y 60 notificaciones de eventos por período mensual.
- **Max**: ARS 15.000 por mes, con 1.920 conversaciones y 240 notificaciones de eventos por período mensual.
- **Cupos separados**: una notificación no consume conversaciones y una conversación no consume notificaciones. Los check-ins proactivos no consumen ninguno de los dos cupos.
- **Consumo confirmado**: sólo cuentan las conversaciones completadas y las notificaciones de eventos entregadas correctamente.

### Registro, acceso y suscripción

- **Registro e ingreso con Google**: un único flujo crea la cuenta gratuita en el primer acceso y recupera la existente en los siguientes.
- **Sesión segura**: la interfaz restaura la sesión del backend sin almacenar tokens persistentes.
- **Plan gratuito renovable**: el primer acceso activa el plan Gratuito y muestra su período mensual vigente.
- **Conexión con Telegram**: vincula de manera segura la cuenta web con una única identidad de Telegram.
- **Continuidad del onboarding**: muestra el estado de cuenta y Telegram, genera un enlace temporal y confirma automáticamente el vínculo.
- **Suscripciones pagas posteriores**: email y contraseña, Mercado Pago y cambios de plan permanecen fuera de esta primera integración.

### Dependencias del backend

- **Identidad web actual**: Google OpenID Connect, sesión y cierre de sesión.
- **Cuenta gratuita actual**: nombre, código de plan, período vigente y estado de Telegram.
- **Vínculo actual con Telegram**: creación y consulta de un vínculo temporal y seguro.
- **Planes públicos posteriores**: catálogo dinámico con nombres, precios, periodicidad y ambos cupos.
- **Suscripciones posteriores**: checkout, estado, cambio y cancelación mediante Mercado Pago confirmado por el backend.
- **Cuenta posterior**: perfil del usuario, perfil del asistente, proactividad y uso.
- **Finanzas**: listado, resumen, alta, corrección y eliminación de movimientos propios.
- **Eventos**: listado, alta, corrección, activación, desactivación y eliminación de eventos personales.
- **Privacidad**: exportación y eliminación de cuenta bajo la política aprobada.

### Panel de cuenta

- **Datos personales**: permite consultar y actualizar nombre preferido, idioma, zona horaria y ubicación cuando corresponda.
- **Personalización del asistente**: permite configurar su nombre visible, perfil de comportamiento y preferencias disponibles.
- **Interacciones proactivas**: permite activar o desactivar los check-ins y elegir una frecuencia alta, media o baja.
- **Plan y suscripción**: muestra plan, estado, período vigente, próxima renovación y opciones de cambio o cancelación.
- **Uso del período**: muestra conversaciones y notificaciones consumidas, disponibles y límites de cada cupo.
- **Estado de Telegram**: muestra la identidad vinculada y permite iniciar un proceso seguro de vinculación o reemplazo.
- **Privacidad**: permite solicitar exportación o eliminación de los datos y dar de baja la cuenta cuando el backend soporte esos procesos.

### Panel de finanzas personales

- **Movimientos**: permite listar, filtrar y consultar gastos y reintegros propios.
- **Alta de movimientos**: permite registrar monto, fecha, descripción y categoría en pesos argentinos.
- **Compras en cuotas**: permite registrar entre 2 y 12 cuotas y verlas como un mismo grupo.
- **Correcciones**: permite modificar un movimiento; cuando pertenece a una compra en cuotas, el cambio afecta al grupo completo.
- **Eliminación permanente**: permite eliminar un movimiento o grupo de cuotas después de una confirmación explícita.
- **Resumen**: muestra totales y estadísticas simples por día, mes y categoría.
- **Categorías iniciales**: alquileres, servicios esenciales, servicios no esenciales, hogar, transporte, salidas, compras y otros.

### Panel de eventos personales

- **Agenda**: permite consultar eventos propios por un rango de fechas.
- **Eventos únicos**: permite crear y editar eventos con horario o de día completo.
- **Eventos recurrentes**: permite repetir un evento semanalmente por días de la semana o mensualmente por días del mes.
- **Recordatorios**: permite definir con cuánta anticipación debe llegar la notificación por Telegram.
- **Estados**: permite desactivar y reactivar eventos sin eliminarlos.
- **Eliminación permanente**: permite eliminar un evento después de una confirmación explícita.
- **Zona horaria**: presenta y edita horarios según la zona horaria configurada por el usuario.

## Reglas de experiencia

- **Español de Argentina**: el contenido inicial usa voseo, fechas locales y montos en ARS.
- **Diseño adaptable**: todas las funciones principales deben ser utilizables en teléfono y escritorio.
- **Accesibilidad**: navegación por teclado, foco visible, contraste suficiente, etiquetas comprensibles y movimiento reducido.
- **Privacidad por defecto**: ningún usuario puede consultar ni modificar información de otra cuenta.
- **Sin datos ficticios en producción**: precios, cupos, estados de pago y consumo provienen del backend. Los fixtures actuales existen sólo para el prototipo.

## Fuera del alcance inicial

- Chat directo con el asistente dentro de la web.
- Comparación o selección manual de modelos de IA.
- Monedas distintas de ARS o categorías financieras personalizadas.
- Recurrencias de eventos distintas de semanal y mensual.
- Sincronización multiusuario con Google Sheets o Google Calendar.
- WhatsApp, email, voz en tiempo real o aplicaciones móviles nativas.
- Administración de eventos internos del sistema.

## Posibles funcionalidades posteriores

- Inspección, corrección y eliminación granular de recuerdos.
- Integraciones personales mediante OAuth.
- Exportación de finanzas y agenda.
- Monedas y categorías configurables.
- Nuevos canales de conversación.
- Métodos de acceso y proveedores de pago adicionales.

## Decisiones pendientes

- Nombre comercial, logotipo y sistema visual definitivo.
- Pruebas gratuitas, impuestos y futuros ajustes de precios o límites.
- Reglas de cambio de plan, mora, reintentos, reembolsos y períodos de gracia.
- Política de memoria, retención, exportación y eliminación.
- Contenido legal, región de operación y obligaciones fiscales.
