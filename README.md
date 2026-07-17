# Nexxora — Web comercial

Web de conversión para Nexxora (automatización y digitalización de restaurantes): landing premium,
demostración interactiva de un restaurante ficticio, formulario de diagnóstico multistep, backend con
Supabase + Resend y panel interno de gestión de contactos.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Recharts · Lucide Icons ·
Supabase (base de datos) · Resend (emails) · React Hook Form + Zod (validación).

## 1. Instalación

```bash
npm install
cp .env.example .env.local
```

Completá `.env.local` con tus credenciales reales (ver sección de variables de entorno más abajo).

```bash
npm run dev
```

La web queda disponible en `http://localhost:3000`. El panel interno está en `http://localhost:3000/admin`.

## 2. Variables de entorno

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL de tu proyecto de Supabase. |
| `SUPABASE_ANON_KEY` | Clave anónima (no se usa actualmente en el frontend, pero queda reservada por si se necesita en el futuro). |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave con permisos totales. Se usa **solo en el servidor** (API routes) para guardar y leer contactos. Nunca se expone al navegador. |
| `RESEND_API_KEY` | API key de Resend para el envío de emails. |
| `ADMIN_EMAIL` | Email que recibe la notificación de cada nuevo diagnóstico. |
| `ADMIN_PASSWORD` | Contraseña de acceso al panel interno (`/admin`). |
| `ADMIN_SESSION_SECRET` | (Opcional) Secreto para firmar la sesión del panel. Si no se define, se usa `ADMIN_PASSWORD`. |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (usada en metadatos, sitemap y Open Graph). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email de contacto mostrado en el footer. |

Ninguna credencial está escrita en el código: todas se leen desde `process.env` en archivos que corren
exclusivamente en el servidor (`lib/supabase/server.ts`, `lib/resend.ts`, rutas dentro de `app/api/`).

## 3. Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Andá a **SQL Editor** y ejecutá el contenido de `supabase/migration.sql`. Esto crea la tabla
   `contacts` con Row Level Security habilitado (sin políticas públicas: solo la Service Role Key puede
   leer/escribir).
3. Copiá `Project URL` y `service_role key` desde **Project Settings > API** a tu `.env.local`.

## 4. Configurar Resend

1. Creá una cuenta en [resend.com](https://resend.com) y generá una API key.
2. Verificá tu dominio en Resend para poder enviar desde una dirección propia (por ejemplo
   `notificaciones@nexxora.com.ar`).
3. Reemplazá `FROM_ADDRESS` en `lib/resend.ts` por tu dirección verificada (por defecto usa el dominio
   de prueba `resend.dev`, que solo envía a la cuenta con la que te registraste).

## 5. Panel interno (`/admin`)

Acceso protegido por contraseña (`ADMIN_PASSWORD`). Permite:

- Ver todos los diagnósticos recibidos, con búsqueda por restaurante/nombre/teléfono y filtro por estado.
- Ver el diagnóstico completo de cada contacto.
- Cambiar el estado comercial (nuevo, contactado, reunión agendada, propuesta enviada, negociación,
  cliente cerrado, no interesado), agregar notas internas y definir una fecha de próximo seguimiento.
- Exportar todos los contactos a CSV.
- Abrir WhatsApp o email directamente desde cada contacto.

Es un sistema de autenticación simple (contraseña única), pensado para uso interno de un equipo pequeño.
Si en el futuro necesitás múltiples usuarios con roles distintos, migrar a Supabase Auth.

## 6. Desplegar en Vercel

1. Subí el proyecto a un repositorio de GitHub/GitLab.
2. Importá el repositorio en [vercel.com](https://vercel.com).
3. En **Settings > Environment Variables**, cargá las mismas variables de `.env.local`.
4. Deploy. Vercel detecta Next.js automáticamente.
5. Actualizá `NEXT_PUBLIC_SITE_URL` con la URL final una vez desplegado, y volvé a desplegar.

## 7. Personalización

### Cambiar el logo

El isotipo actual (`components/ui/Logo.tsx`) recrea el logo real de Nexxora (ribbon/flecha en degradado
cian → azul, más el wordmark "nexxora" en minúsculas). Si en el futuro cambia el diseño de marca:

1. Guardá el archivo del logo en `public/logo.png` (o `.svg`).
2. Reemplazá el contenido de `components/ui/Logo.tsx` por una etiqueta `<Image src="/logo.png" ... />` de
   `next/image`, o por el SVG exportado real si contás con el vector.
3. El favicon y la imagen de Open Graph se generan dinámicamente en `app/icon.tsx` y
   `app/opengraph-image.tsx`: actualizalos con los mismos colores/isotipo si cambiás la paleta de marca.

### Cambiar textos y teléfono

- **WhatsApp**: número definido en `lib/constants.ts` (`SITE.whatsappNumber`). Los mensajes predefinidos
  de cada botón también están ahí (`buildWhatsappLink`).
- **Email**: variable `NEXT_PUBLIC_CONTACT_EMAIL` en `.env.local`.
- **Textos de cada sección**: cada sección vive en `components/sections/*.tsx` con el texto en español
  directamente en el JSX, fácil de editar.
- **Preguntas frecuentes**: `components/sections/FAQ.tsx`.
- **Problemas/soluciones**: `components/sections/Problems.tsx`.
- **Comparativa antes/después**: `components/sections/Comparison.tsx`.
- **Beneficios**: `components/sections/Benefits.tsx`.

### Datos ficticios de la demostración

La demostración interactiva ("Un sistema diseñado alrededor de tu restaurante") usa datos de ejemplo
definidos en `lib/restaurantDemoData.ts` (menú, stock, pedidos, clientes) para tres perfiles de negocio
(hamburguesería, pizzería, cafetería). Son completamente ficticios y están aislados del resto del sistema;
no afectan a los datos reales de contactos.

## 8. Estructura del proyecto

```
app/                       Rutas (App Router)
  page.tsx                 Home
  gracias/                 Pantalla de agradecimiento
  admin/                   Panel interno (protegido)
  api/contact/              Endpoint del formulario público
  api/admin/                Endpoints del panel interno
components/
  layout/                  Header, Footer
  sections/                Secciones de la home
  solutions/               Demostración interactiva de los 8 módulos del sistema
  form/                    Formulario de diagnóstico multistep
  admin/                   Componentes del panel interno
  ui/                      Componentes reutilizables (Button, Card, etc.)
lib/                       Utilidades, constantes, validaciones, clientes de Supabase/Resend
supabase/migration.sql     Esquema de base de datos
types/                     Tipos compartidos
middleware.ts              Protección de rutas /admin y /api/admin
```

## 9. Seguridad implementada

- La Service Role Key de Supabase solo se usa en archivos marcados con `import "server-only"`, ejecutados
  en API routes. Nunca llega al navegador.
- El panel `/admin` y sus API routes están protegidos por `middleware.ts`, que verifica una cookie de
  sesión firmada (HMAC-SHA256) antes de permitir el acceso.
- El formulario público tiene protección antispam: campo honeypot oculto, límite de envíos por IP y
  bloqueo de envíos duplicados (mismo teléfono/email en los últimos 5 minutos).
- Todas las validaciones del formulario se repiten en el servidor (`app/api/contact/route.ts`) con Zod,
  sin confiar únicamente en la validación del cliente.
- Headers de seguridad básicos configurados en `next.config.js`.

## 10. Estado de "Testimonios"

La sección de testimonios está preparada para el futuro pero, siguiendo el requerimiento del proyecto, no
incluye testimonios ni clientes inventados. Cuando existan casos reales, reemplazá el contenido de
`components/sections/Testimonials.tsx`.
