-- ============================================================
-- Nexxora — Datos demo para el panel administrativo.
-- Ejecutar DESPUÉS de correr migration_crm.sql Y de crear los
-- usuarios Nara/Juli en Authentication > Users (este script busca
-- sus perfiles por email).
--
-- Todo lo que crea este script tiene is_demo = true, así que se
-- puede borrar por completo en cualquier momento con:
--   delete from public.companies where is_demo = true;
-- (el resto de las tablas hijas se borran solas por "on delete cascade")
-- ============================================================

do $$
declare
  v_nara uuid;
  v_juli uuid;
  v_c1 uuid := '10000000-0000-4000-8000-000000000001'; -- Burger House
  v_c2 uuid := '10000000-0000-4000-8000-000000000002'; -- Sushi Club
  v_c3 uuid := '10000000-0000-4000-8000-000000000003'; -- Pizza Max
  v_c4 uuid := '10000000-0000-4000-8000-000000000004'; -- Rotisería El Fogón
  v_c5 uuid := '10000000-0000-4000-8000-000000000005'; -- Café Central
  v_c6 uuid := '10000000-0000-4000-8000-000000000006'; -- TransLogística Cuyo
  v_c7 uuid := '10000000-0000-4000-8000-000000000007'; -- Flota Andina
  v_c8 uuid := '10000000-0000-4000-8000-000000000008'; -- Distribuidora Mendoza Sur (cliente)
  v_c9 uuid := '10000000-0000-4000-8000-000000000009'; -- Pizza Center (perdido)
  v_lost_price uuid;
begin
  select id into v_nara from public.profiles where email = 'naraagrauu@gmail.com';
  select id into v_juli from public.profiles where email = 'juliganholigans@gmail.com';
  select id into v_lost_price from public.lost_reasons where label = 'Muy caro';

  if v_nara is null or v_juli is null then
    raise exception 'No encontré los perfiles de Nara/Juli. Creá los usuarios en Authentication > Users antes de correr este script.';
  end if;

  -- Empresas demo
  insert into public.companies
    (id, name, industry, subcategory, address, city, province, maps_url, phone, whatsapp, instagram,
     employees_estimate, branches_count, notes, status, priority, pain_points, score, probability,
     mrr_potential, mrr_actual, next_action_type, next_action_date, next_action_comment, next_action_assigned_to,
     source, assigned_to, created_by, client_since, is_demo)
  values
    (v_c1, 'Burger House', 'gastronomia', 'Hamburguesería', 'Av. San Martín 1250', 'Godoy Cruz', 'Mendoza',
     'https://maps.google.com/?q=Av.+San+Martin+1250+Godoy+Cruz+Mendoza', '261-4551234', '5492614551234', '@burgerhouse.mza',
     '8-10', '1', 'Alto volumen los fines de semana.', 'negociacion', 'A',
     array['pedidos_desorganizados','whatsapp_separado','errores_cocina'], 84, 80,
     45000, 0, 'follow_up', current_date + 1, 'Esperando respuesta a la propuesta enviada.', v_nara,
     'Prospección directa', v_nara, v_juli, null, true),

    (v_c2, 'Sushi Club', 'gastronomia', 'Sushi', 'Belgrano 340', 'Ciudad de Mendoza', 'Mendoza',
     'https://maps.google.com/?q=Belgrano+340+Mendoza', '261-4889012', '5492614889012', '@sushiclub.mza',
     '10-15', '2', 'Dos sucursales, dueño centraliza decisiones.', 'demo', 'A',
     array['pedidos_delivery_separados','falta_metricas','falta_menu_qr'], 78, 65,
     60000, 0, 'demo', current_date, 'Demo confirmada para hoy.', v_nara,
     'Instagram', v_nara, v_juli, null, true),

    (v_c3, 'Pizza Max', 'gastronomia', 'Pizzería', 'Las Heras 780', 'Las Heras', 'Mendoza',
     'https://maps.google.com/?q=Las+Heras+780+Mendoza', '261-4223344', '5492614223344', '@pizzamax.mza',
     '5-8', '1', null, 'interesado', 'B',
     array['comandas_manuales','stock_manual'], 58, 40,
     35000, 0, 'llamar', current_date + 2, 'Preguntó por precios, hay que retomar contacto.', v_juli,
     'Recomendación de cliente', v_nara, v_juli, null, true),

    (v_c4, 'Rotisería El Fogón', 'gastronomia', 'Rotisería', 'Alberdi 55', 'Guaymallén', 'Mendoza',
     'https://maps.google.com/?q=Alberdi+55+Guaymallen+Mendoza', '261-4665566', '5492614665566', null,
     '3-5', '1', 'Nara visitó, dueño no estaba.', 'visitado', 'C',
     array['pedidos_desorganizados'], 32, 20,
     20000, 0, 'visitar', current_date + 5, 'Volver a visitar, el dueño está de tarde.', v_nara,
     'Google Maps', v_nara, v_nara, null, true),

    (v_c5, 'Café Central', 'gastronomia', 'Cafetería', 'Sarmiento 210', 'Ciudad de Mendoza', 'Mendoza',
     'https://maps.google.com/?q=Sarmiento+210+Mendoza', '261-4778899', '5492614778899', '@cafecentral.mza',
     '4-6', '1', null, 'contactado', 'B',
     array['sin_panel_administrativo'], 41, 25,
     18000, 0, 'whatsapp', current_date + 1, 'Responder consulta sobre integración con Mercado Pago.', v_juli,
     'WhatsApp Business', v_juli, v_juli, null, true),

    (v_c6, 'TransLogística Cuyo', 'logistica', 'Transporte de cargas', 'Acceso Este km 8', 'Maipú', 'Mendoza',
     'https://maps.google.com/?q=Acceso+Este+km+8+Maipu+Mendoza', '261-4991122', '5492614991122', null,
     '20-30', '3', 'Flota de 12 camiones, buscan control de rutas.', 'propuesta', 'A',
     array['rutas_manuales','control_choferes','falta_trazabilidad'], 71, 55,
     90000, 0, 'follow_up', current_date + 3, 'Propuesta enviada, esperando devolución del gerente de operaciones.', v_nara,
     'Referido', v_nara, v_juli, null, true),

    (v_c7, 'Flota Andina', 'logistica', 'Distribución', 'Ruta 40 km 12', 'Luján de Cuyo', 'Mendoza',
     'https://maps.google.com/?q=Ruta+40+km+12+Lujan+de+Cuyo+Mendoza', '261-4334455', '5492614334455', null,
     '10-15', '2', null, 'nuevo', 'B',
     array[]::text[], 15, 10,
     40000, 0, null, null, null, null,
     'Investigación Juli', v_juli, v_juli, null, true),

    (v_c8, 'Distribuidora Mendoza Sur', 'logistica', 'Distribuidora', 'Carril Rodríguez Peña 900', 'San Rafael', 'Mendoza',
     'https://maps.google.com/?q=Carril+Rodriguez+Pena+900+San+Rafael+Mendoza', '260-4443322', '5492604443322', null,
     '15-20', '2', 'Cliente desde julio, muy conforme con el sistema.', 'cliente', 'A',
     array[]::text[], 95, 100,
     0, 55000, 'cobrar', date_trunc('month', current_date) + interval '1 month' - interval '1 day', 'Cobro mensual recurrente.', v_nara,
     'Prospección directa', v_nara, v_nara, current_date - interval '25 days', true),

    (v_c9, 'Pizza Center', 'gastronomia', 'Pizzería', 'Colón 450', 'Ciudad de Mendoza', 'Mendoza',
     'https://maps.google.com/?q=Colon+450+Mendoza', '261-4112233', '5492614112233', null,
     '3-4', '1', 'Dijo que ya usan un sistema de otro proveedor.', 'perdido', 'C',
     array[]::text[], 10, 0,
     15000, 0, null, null, null, null,
     'WhatsApp Business', v_juli, v_juli, null, true)
  on conflict (id) do nothing;

  update public.companies set lost_reason_id = v_lost_price, lost_comment = 'Dijo que el presupuesto no le cerraba este trimestre.'
  where id = v_c9;

  -- Contactos
  insert into public.people (company_id, first_name, last_name, position, phone, whatsapp, best_contact_time, decision_level, is_primary)
  values
    (v_c1, 'Martín', 'Gómez', 'encargado', '261-4551234', '5492614551234', '17:00 a 20:00', 'influye', false),
    (v_c1, 'Diego', 'Fernández', 'dueño', '261-4551299', '5492614551299', 'Después de las 18:00', 'decide', true),
    (v_c2, 'Kenji', 'Ishida', 'dueño', '261-4889012', '5492614889012', 'Mediodía', 'decide', true),
    (v_c6, 'Laura', 'Peralta', 'administrador', '261-4991122', '5492614991122', 'Horario de oficina', 'influye', true),
    (v_c8, 'Roberto', 'Salinas', 'dueño', '260-4443322', '5492604443322', 'Mañanas', 'decide', true)
  on conflict do nothing;

  -- Timeline
  insert into public.activities (company_id, type, content, created_by, created_at) values
    (v_c1, 'nota', 'Encontró la empresa en Instagram y agregó información inicial.', v_juli, now() - interval '9 days'),
    (v_c1, 'llamada', 'Llamó y habló con Martín. El dueño (Diego) suele estar después de las 18:00.', v_juli, now() - interval '8 days'),
    (v_c1, 'visita', 'Nara visitó el local y habló directamente con Diego.', v_nara, now() - interval '6 days'),
    (v_c1, 'cambio_estado', 'Estado cambiado: Visitado → Interesado', v_nara, now() - interval '6 days'),
    (v_c1, 'demo', 'Demo realizada en el local, buena recepción.', v_nara, now() - interval '4 days'),
    (v_c1, 'propuesta_enviada', 'Propuesta enviada: $45.000/mes.', v_nara, now() - interval '2 days'),
    (v_c2, 'whatsapp', 'Contacto inicial por WhatsApp, Kenji respondió con interés.', v_juli, now() - interval '5 days'),
    (v_c2, 'nota', 'Demo agendada para hoy a las 16:00.', v_nara, now() - interval '1 days'),
    (v_c6, 'reunion', 'Reunión con Laura para relevar la operación de la flota.', v_nara, now() - interval '10 days'),
    (v_c6, 'propuesta_enviada', 'Propuesta enviada: $90.000/mes, incluye control de rutas y choferes.', v_nara, now() - interval '3 days'),
    (v_c8, 'cierre', 'Cliente cerrado. Implementación iniciada.', v_nara, now() - interval '25 days'),
    (v_c9, 'cambio_estado', 'Estado cambiado a Perdido: Muy caro.', v_juli, now() - interval '15 days');

  -- Tareas
  insert into public.tasks (title, description, company_id, assigned_to, created_by, priority, due_date, status) values
    ('Llamar a Burger House por la propuesta', 'Confirmar si Diego ya la vio.', v_c1, v_nara, v_juli, 'A', current_date + 1, 'pendiente'),
    ('Conseguir WhatsApp del dueño de Pizza Max', null, v_c3, v_juli, v_nara, 'B', current_date + 2, 'pendiente'),
    ('Preparar demo de Sushi Club', 'Llevar tablet cargada y el menú de ejemplo.', v_c2, v_nara, v_nara, 'A', current_date, 'en_progreso'),
    ('Investigar 5 restaurantes nuevos en Chacras de Coria', null, null, v_juli, v_juli, 'B', current_date + 1, 'pendiente');

  -- Propuesta
  insert into public.proposals (company_id, plan_name, setup_fee, monthly_fee, currency, services, sent_date, expiry_date, assigned_to, status) values
    (v_c1, 'Plan Restaurante Pro', 15000, 45000, 'ARS', array['Menú digital','Pedidos online','Pantalla de cocina','Panel administrativo'], current_date - 2, current_date + 12, v_nara, 'enviada'),
    (v_c6, 'Plan Logística Pro', 25000, 90000, 'ARS', array['Control de rutas','Gestión de choferes','Trazabilidad de entregas'], current_date - 3, current_date + 11, v_nara, 'enviada');

  -- Checklist de implementación (cliente)
  insert into public.implementation_items (company_id, label, done, sort_order) values
    (v_c8, 'Datos recibidos', true, 1),
    (v_c8, 'Logo', true, 2),
    (v_c8, 'Productos y precios', true, 3),
    (v_c8, 'Categorías', true, 4),
    (v_c8, 'Stock inicial', true, 5),
    (v_c8, 'Usuarios', true, 6),
    (v_c8, 'Configuración del sistema', false, 7),
    (v_c8, 'Pruebas', false, 8),
    (v_c8, 'Capacitación', false, 9),
    (v_c8, 'Sistema activo', false, 10),
    (v_c8, 'Seguimiento a 7 días', false, 11);

  -- Funcionalidades pedidas (para el ranking de inteligencia comercial)
  insert into public.feature_requests (company_id, feature) values
    (v_c1, 'Integración WhatsApp'),
    (v_c2, 'Integración WhatsApp'),
    (v_c3, 'Mercado Pago'),
    (v_c6, 'GPS'),
    (v_c6, 'Multi-sucursal'),
    (v_c9, 'Facturación');

end $$;
