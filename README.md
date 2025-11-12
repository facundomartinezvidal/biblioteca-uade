<div align="center">

# 📚 Biblioteca Universitaria - Campus Connect

**Módulo de Biblioteca Universitaria del sistema Campus Connect**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-398ccb?logo=trpc)](https://trpc.io/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-0e4d2a)](https://orm.drizzle.team/)
[![Supabase](https://img.shields.io/badge/Supabase-Client-3fcf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38b2ac?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Sistema de gestión bibliotecaria para la Universidad UADE, parte del ecosistema Campus Connect.

</div>

---

## 📋 Descripción

Este módulo forma parte del sistema **Campus Connect**, una plataforma modular que integra los principales servicios académicos, administrativos y de vida universitaria. El módulo de Biblioteca Universitaria permite gestionar el catálogo de libros, préstamos, reservas, multas y sanciones por préstamos tardíos.

## ✨ Funcionalidades

### Para Bibliotecarios (Administradores)

- **Gestión de Catálogo**: Administración completa del stock de libros físicos existentes en cada sede
- **Gestión de Préstamos**: Control de préstamos, reservas y devoluciones de libros
- **Gestión de Multas y Sanciones**: Aplicación automática de sanciones y multas por préstamos tardíos
- **Dashboard Administrativo**: Visualización de estadísticas y métricas del sistema

### Para Estudiantes

- **Consulta de Catálogo**: Búsqueda y visualización del stock actual de libros disponibles
- **Solicitud de Préstamos**: Reserva de libros físicos disponibles
- **Gestión de Préstamos**: Visualización del estado de préstamos activos y reservas
- **Multas y Sanciones**: Consulta y pago de multas aplicadas por préstamos tardíos
- **Notificaciones en Tiempo Real**: Alertas cuando se aplica una sanción por préstamo tardío
- **Favoritos**: Guardado de libros favoritos para acceso rápido

## 🔗 Integraciones con Otros Módulos

El módulo se integra con otros módulos del sistema Campus Connect mediante:

- **Portal del Estudiante**: Notificaciones en tiempo real cuando se aplica una sanción por préstamo tardío
- **Backoffice Administrativo**: Configuración de costos de multas y políticas de sanciones
- **Sistema de Comedor**: Descuento de multas desde la cuenta institucional del usuario
- **Core**: Comunicación centralizada con todos los módulos del sistema

## 🛠️ Tecnologías

- **Next.js 15** (App Router) - Framework React con renderizado del lado del servidor
- **tRPC v11** - API type-safe end-to-end
- **Drizzle ORM** - ORM moderno con postgres.js
- **Supabase** - Autenticación y base de datos (cliente browser/server/edge)
- **Tailwind CSS 4** - Framework de estilos utility-first
- **TypeScript** - Tipado estático
- **React Query** - Gestión de estado del servidor
- **Zod** - Validación de esquemas

## 📦 Requisitos

- Node.js 18.17+ (20+ recomendado)
- PostgreSQL (instancia local o gestionada)
- Cuenta de Supabase configurada

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones de base de datos
npm run db:migrate

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## ⚙️ Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

```bash
# Base de datos
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

# Entorno
NODE_ENV=development
```

**Nota**: Mantén un archivo `.env.example` sanitizado (sin secretos) en el control de versiones.

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev            # Servidor de desarrollo
npm run build          # Build de producción
npm run start          # Servidor de producción
npm run preview        # Build + start

# Calidad de código
npm run lint           # ESLint
npm run lint:fix       # ESLint (auto-fix)
npm run typecheck      # Verificación de tipos TypeScript
npm run format:check   # Prettier (verificación)
npm run format:write   # Prettier (aplicar formato)

# Base de datos (Drizzle)
npm run db:generate    # Generar SQL desde schema
npm run db:migrate     # Ejecutar migraciones
npm run db:push        # Aplicar cambios directamente (solo desarrollo)
npm run db:studio      # Abrir Drizzle Studio
npm run db:check       # Verificar conexión a base de datos

# Utilidades
npm run upload-image   # Subir imagen de libro
npm run list-books     # Listar libros en la base de datos
```

## 🗄️ Base de Datos

### Schema

El schema de la base de datos está definido en:

- Schema principal: `src/server/db/schema.ts`
- Schemas individuales: `src/server/db/schemas/*`

### Entidades Principales

- **books**: Catálogo de libros
- **authors**: Autores
- **editorials**: Editoriales
- **genders**: Géneros literarios
- **locations**: Ubicaciones físicas (sedes)
- **loans**: Préstamos y reservas
- **penalties**: Multas
- **sanctions**: Sanciones
- **users**: Usuarios del sistema
- **roles**: Roles de usuario (admin, estudiante)
- **notifications**: Notificaciones
- **favorites**: Libros favoritos

### Flujo de Trabajo

1. Editar schema en `src/server/db/schemas/*`
2. Generar migración: `npm run db:generate`
3. Aplicar migración: `npm run db:migrate` (o `npm run db:push` para desarrollo)

## 🔐 Autenticación

El sistema utiliza **Supabase Auth** para la autenticación:

- Cliente browser: `src/lib/supabase/client.ts`
- Cliente servidor/edge: `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`
- Requiere `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Los usuarios se autentican con su correo institucional de la universidad.

## 🔌 API (tRPC)

### Routers Disponibles

- **auth**: Autenticación y gestión de usuarios
- **books**: Gestión de libros
- **catalog**: Catálogo y búsqueda
- **loans**: Préstamos y reservas
- **penalties**: Multas
- **sanctions**: Sanciones
- **favorites**: Libros favoritos
- **notifications**: Notificaciones
- **dashboard**: Estadísticas y métricas
- **user**: Información de usuario
- **documentation**: Documentación de la API

### Estructura

- Router raíz: `src/server/api/root.ts`
- Routers: `src/server/api/routers/*`
- Handler: `src/app/api/trpc/[trpc]/route.ts`
- Cliente React Query: `src/trpc/react.tsx`

### Documentación

La documentación de la API está disponible en `/documentation` cuando la aplicación está en ejecución.

## 📁 Estructura del Proyecto

```
src/
  app/                          # Next.js App Router
    _components/                # Componentes compartidos
      home/                     # Componentes de la página principal
      help/                     # Componentes de ayuda
      privacy/                  # Componentes de privacidad
    api/trpc/[trpc]/           # Endpoint tRPC
    auth/                      # Páginas de autenticación
    loans/                     # Páginas de préstamos
    penalties/                 # Páginas de multas
    profile/                   # Páginas de perfil
    reserve/                   # Páginas de reserva
    users/                     # Páginas de usuarios (admin)
    documentation/             # Documentación de API
  components/
    ui/                        # Componentes UI (shadcn/ui)
    icons/                     # Iconos personalizados
  lib/
    contexts/                  # Contextos de React
    supabase/                  # Clientes Supabase
    utils/                     # Utilidades
  server/
    api/
      routers/                 # Routers tRPC
      procedures/             # Procedimientos compartidos
      trpc.ts                  # Configuración tRPC
    db/
      schemas/                 # Schemas de base de datos
      schema.ts                # Schema principal
      index.ts                 # Conexión a BD
  trpc/                        # Configuración tRPC cliente
```

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar todas las variables de entorno desde `.env`
3. Asegurar que las políticas CORS de Supabase estén configuradas correctamente
4. Desplegar

### Otros Proveedores

El proyecto puede desplegarse en cualquier plataforma que soporte Next.js:

- Netlify
- Railway
- Render
- AWS Amplify

## 🔍 Solución de Problemas

### Error 500 en runtime

- Verificar `DATABASE_URL` y acceso de red a PostgreSQL
- Revisar logs del servidor

### Error 401 de Supabase

- Verificar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Revisar configuración del proyecto en Supabase

### Errores de tipos TypeScript

```bash
npm run typecheck
```

### Problemas con migraciones

- Ejecutar `npm run db:generate` después de editar `schema.ts`
- Luego ejecutar `npm run db:migrate`

### Verificar conexión a base de datos

```bash
npm run db:check
```

## 📝 Reglas de Negocio

### Préstamos

- Los estudiantes pueden reservar libros disponibles
- Los bibliotecarios gestionan las devoluciones
- Las reservas tienen un tiempo límite

### Sanciones y Multas

- Si un estudiante no devuelve un libro pasados **7 días** de la fecha límite:
  - Se aplica automáticamente una **sanción**
  - Se aplica una **multa** sobre el saldo de la cuenta institucional
- El costo de la multa lo define el módulo de **Backoffice Administrativo**
- Las notificaciones se envían en tiempo real al **Portal del Estudiante**

### Stock

- El stock se gestiona por sede
- Los bibliotecarios pueden administrar el inventario de cada sede

## 👥 Roles

- **admin** (Bibliotecario): Acceso completo al sistema, gestión de catálogo y préstamos
- **estudiante**: Consulta de catálogo, solicitud de préstamos y gestión de sus propios préstamos

## 📄 Licencia

Este proyecto es parte del trabajo práctico obligatorio "Campus Connect" de la materia Desarrollo de Aplicaciones II.

## 👨‍💻 Desarrollo

### Contribuir

1. Crear una rama desde `dev`
2. Realizar cambios
3. Crear un Pull Request hacia `dev`

### Convenciones

- Código en inglés
- Comentarios mínimos y en español
- No incluir `console.log` en producción
- Seguir las reglas de ESLint y Prettier

---

**Desarrollado como parte del sistema Campus Connect - Universidad UADE**
