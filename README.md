# Storefront

E-commerce de ropa construido con Next.js 16, MongoDB, Stripe, Cloudinary y NextAuth v5.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Base de datos:** MongoDB + Mongoose
- **Auth:** NextAuth v5 — Google OAuth + email/contraseña
- **Pagos:** Stripe Checkout
- **Imágenes:** Cloudinary
- **Email:** Resend
- **Estado del carrito:** Zustand (localStorage)
- **Estilos:** Tailwind CSS v4

## Variables de entorno

Crea un archivo `.env.local` en la raíz con las siguientes variables:

```env
# MongoDB
MONGODB_URI=

# NextAuth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=
```

## Instalación y desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

> **Nota de memoria:** El dev server requiere más memoria de lo habitual. Si encuentras errores de heap, usa:
> ```bash
> NODE_OPTIONS=--max-old-space-size=4096 npm run dev
> ```

## Primer deploy — crear el admin inicial

Con la base de datos vacía no existe ningún usuario admin. Antes de levantar la app en producción, corre el seed script una sola vez:

```bash
npm run seed:admin -- --email=tu@email.com --password=tupassword --name="Tu Nombre"
```

El script es seguro para correr múltiples veces:
- Si ya existe un admin → no hace nada
- Si el email existe sin rol admin → lo promueve a admin
- Si no existe el usuario → lo crea con contraseña hasheada

A partir del primer admin, los demás se crean desde el panel en `/admin/admins`.

## Acceso al panel de administración

1. Ve a `/login` e inicia sesión con email/contraseña (admins) o Google (clientes)
2. El panel está en `/admin`
3. El middleware en `proxy.ts` protege todas las rutas `/admin/*` y `/api/admin/*`

## Estructura del proyecto

```
src/
├── app/
│   ├── (store)/          # Rutas de la tienda (clientes)
│   ├── (admin)/          # Panel de administración
│   ├── api/              # API routes
│   ├── login/            # Página de login
│   └── auth/redirect/    # Redirect post-login
├── components/
│   ├── store/            # Navbar, HeroBanner, SearchBar, etc.
│   ├── admin/            # ProductForm
│   └── ui/               # Button
├── models/               # Mongoose models (Product, Order, User, SiteSettings)
├── lib/                  # mongoose, cloudinary, stripe, resend, cart-store
├── auth.ts               # Configuración NextAuth
└── proxy.ts              # Middleware de protección de rutas admin
scripts/
└── seed-admin.mjs        # Script para crear el primer admin
```

## Funcionalidades principales

### Tienda
- Catálogo de productos con búsqueda y filtro por categoría
- Página de detalle de producto con selección de talla/color
- Carrito persistido en localStorage
- Checkout con Stripe (pagos reales)
- Email de confirmación de orden vía Resend

### Panel de administración (`/admin`)
- **Dashboard** — resumen de ventas, productos y órdenes recientes
- **Products** — crear, editar y eliminar productos con imágenes en Cloudinary
- **Orders** — ver y actualizar el estado de las órdenes
- **Settings** — configurar el hero banner de la home (imagen o color sólido, color de texto, titular, CTA) y el nombre de la tienda
- **Admins** — crear y listar usuarios administradores

### Hero Banner
Configurable desde `/admin/settings`:
- Fondo: imagen (subida a Cloudinary) o color sólido
- Color del texto configurable
- Titular, subtítulo y botón CTA
- Se puede deshabilitar sin eliminar la configuración

## Webhook de Stripe

Para recibir eventos de Stripe en desarrollo usa la Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

El webhook en `/api/webhooks/stripe` crea las órdenes y descuenta el stock al completarse un pago.
