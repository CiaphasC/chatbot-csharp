-- Limpieza de textos del bot para eliminar referencias a empleados y centrar la experiencia en servicios/agenda

update public.bot_responses
set answer = 'Puedo mostrar los servicios disponibles y horarios abiertos. Indica el servicio que necesitas.',
    keywords = array['servicio','servicios','horario','disponible','agenda']
where key in ('empleados_info');

update public.bot_responses
set answer = 'Los horarios habituales son de 09:00 a 17:00. Confirmo disponibilidad por servicio antes de reservar.',
    keywords = array['horario','horarios','hora','agenda','disponibilidad']
where key = 'horarios';

update public.bot_responses
set answer = 'No encontré coincidencias. ¿Puedes dar más detalle sobre la cita o el servicio que necesitas?',
    keywords = array['?']
where key = 'fallback';

update public.bot_responses
set answer = 'Indica fecha y servicio para validar disponibilidad en agenda.',
    keywords = array['disponibilidad','horario','agenda','libre']
where key = 'empleado_disponibilidad';

update public.bot_responses
set answer = 'Si quieres cambiar tu cita, dime la fecha/hora actual y la nueva preferida.',
    keywords = array['cambiar cita','otro horario','reagendar','cambiar hora']
where key = 'empleado_cambio';
