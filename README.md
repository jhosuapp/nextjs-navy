# Navy tierlist

Tierlist de minecraft

## 🚀 Tecnologías Principales

- **Next.js**: 15.5.7
- **Node.js**: >= 20.x
- **Base de datos**: Prisma ORM
- **Gestión de estado**: Zustand
- **Fetching de datos**: TanStack Query + Axios
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Formularios**: React Hook Form + Yup

## 📋 Requisitos Previos

- Node.js >= 20.x
- npm >= 10.x
- Base de datos configurada (especificar cuál: PostgreSQL, MySQL, etc.)

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <https://github.com/jhosuapp/nextjs-navy>
cd <nextjs-navy>
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="tu-conexion-de-base-de-datos"
# Ejemplo PostgreSQL:
# DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"
```

4. **Configurar Prisma**

Inicializar Prisma (si es un proyecto nuevo):
```bash
npx prisma init
```

Sincronizar el esquema desde la base de datos existente:
```bash
npx prisma db pull
```

Generar el cliente de Prisma:
```bash
npx prisma generate
```

## 🚦 Comandos de Desarrollo

```bash
# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Linter
npm run lint
```

## 🗂️ Estructura del Proyecto

```
├── src/
│   ├── features/              # Features modulares
│   │   ├── feature-name/
│   │   │   ├── components/    # Componentes específicos del feature
│   │   │   ├── hooks/         # Hooks específicos del feature
│   │   │   ├── actions/       # Server actions del feature
│   │   │   ├── views/         # Vistas/páginas del feature
│   │   │   ├── interfaces/    # Tipos e interfaces
│   │   │   └── schemas/       # Schemas de validación (Yup)
│   │   └── ...
│   │
│   ├── shared/                # Recursos compartidos globalmente
│   │   ├── components/        # Componentes reutilizables
│   │   ├── hooks/             # Hooks globales
│   │   ├── actions/           # Server actions globales
│   │   ├── interfaces/        # Tipos globales
│   │   └── utils/             # Utilidades
│   │
│   ├── app/                   # App Router de Next.js
│   │   ├── api/               # API Routes y endpoints
│   │   └── ...                # Sin lógica de negocio
│   │
│   └── prisma/
│       └── schema.prisma      # Esquema de base de datos
```

## 📐 Arquitectura y Convenciones

### Principios de Organización

- **Feature-Based**: Cada funcionalidad principal vive en su propio módulo dentro de `/features`
- **Separation of Concerns**: La lógica de negocio está separada de las rutas (`/app` solo maneja routing)
- **Shared Resources**: Componentes, hooks y actions compartidos viven en `/shared`
- **Colocation**: Cada feature contiene todo lo necesario (componentes, hooks, schemas, etc.)

### Gestión de Estado

- **Zustand**: Para estado global de la aplicación
- **TanStack Query**: Para server state y cache de peticiones
- **React Hook Form**: Para estado de formularios

### Validación

Todos los formularios utilizan **Yup** para definir schemas de validación:
```typescript
// features/auth/schemas/loginSchema.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required()
});
```

### Estilos

- **Tailwind CSS**: Utility-first para estilos
- **Framer Motion**: Para animaciones y transiciones

## 🔌 API y Endpoints

Los endpoints se crean usando Prisma ORM. Ejemplo básico:

```typescript
// app/api/users/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

## 🗃️ Base de Datos

### Comandos útiles de Prisma

```bash
# Visualizar base de datos en navegador
npx prisma studio

# Aplicar migraciones
npx prisma migrate dev

# Sincronizar desde BD existente
npx prisma db pull

# Regenerar cliente
npx prisma generate
```

## 📝 Notas Adicionales

- La carpeta `/app` se utiliza únicamente para routing y no debe contener lógica de negocio
- Cada feature es autocontenido y puede incluir sus propios componentes, hooks, actions, etc.
- Los recursos compartidos entre features van en `/shared`

## 🤝 Contribución

jhosuapp

---

**Desarrollado con ❤️ usando Next.js 15**