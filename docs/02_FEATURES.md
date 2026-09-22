# Funcionalidades

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

- **Registro con email**: permite crear una cuenta mediante email y contraseña, verificar el email y recuperar el acceso.
- **Ingreso con Google**: permite crear una cuenta o ingresar mediante Google.
- **Suscripción con Mercado Pago**: permite contratar y mantener una suscripción recurrente en pesos argentinos.
- **Estado de pago confiable**: activa o modifica el acceso únicamente después de que el backend confirma el estado informado por Mercado Pago.
- **Conexión con Telegram**: vincula de manera segura la cuenta web con una única identidad de Telegram.
- **Continuidad del onboarding**: muestra el estado de cada paso y permite retomar un registro, pago o vínculo incompleto.

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
- **Sin datos ficticios**: precios, cupos, estados de pago y consumo provienen del backend y no quedan fijados en la interfaz.

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
