<div align="center">

# Navy Tiers

**La tierlist competitiva de PvP de Minecraft de la comunidad Navy.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)

[**navytiers.com**](https://navytiers.com) · [Discord](https://discord.com/invite/navyy)

</div>

<div align="center">
  <img src="docs/screenshots/tierlist.jpg" alt="Tierlist de Navy: ranking general con jugadores, puntos, región y tiers por modalidad" width="900">
</div>

---

## Qué es esto

**Navy** es una comunidad de PvP de Minecraft que evalúa jugadores mediante *tests* oficiales: un tester enfrenta al jugador en una modalidad concreta (Crystal, Sword, Netherite…) y le asigna un tier de `1` a `5`, en variante *high* o *low*. Cada tier vale unos puntos, la suma de todas las modalidades da un **puntaje global**, y ese puntaje sitúa al jugador en un rango: de *Novice* a *Legend*.

Este repositorio es la **web pública** de esa operación: la tierlist consultable, el historial de tests, el equipo de staff, los baneos aplicados, los partners y el formulario de postulación para entrar al staff — todo en tres idiomas y con un panel privado para revisar postulaciones.

Los datos no se producen aquí: viven en la base de datos MySQL que comparte el bot de Discord de Navy. Esta app **lee** ese esquema (`prisma db pull`) y escribe únicamente sus propias tablas: postulaciones, usuarios admin y caché.

### Rangos y puntaje

| Rango | Puntos | | Tier | High | Low |
| --- | --- | --- | --- | --- | --- |
| **Legend** | 140+ | | Tier 1 | 70 | 50 |
| **Master** | 100 – 139 | | Tier 2 | 40 | 30 |
| **Expert** | 50 – 99 | | Tier 3 | 20 | 10 |
| **Veteran** | 25 – 49 | | Tier 4 | 7 | 5 |
| **Apprentice** | 10 – 24 | | Tier 5 | 2 | 1 |
| **Novice** | 0 – 9 | | | | |

> Fuente de verdad: [`src/shared/constants/information.ts`](src/shared/constants/information.ts). Si cambian los valores, se cambian ahí y no en los componentes.

---

## Capturas

<table>
<tr>
<td width="50%">
<img src="docs/screenshots/home.jpg" alt="Home con los carruseles de últimos resultados altos y bajos, cada tarjeta con la skin del jugador y su tier">
<p align="center"><em>Home — últimos resultados altos y bajos, con la skin de cada jugador</em></p>
</td>
<td width="50%">
<img src="docs/screenshots/profile-modal.jpg" alt="Modal de perfil de jugador con skin 3D, posición, puntos, región y tiers por modalidad">
<p align="center"><em>Perfil de jugador — skin 3D, posición, puntos y tiers</em></p>
</td>
</tr>
<tr>
<td width="50%">
<img src="docs/screenshots/staff.jpg" alt="Página de staff con los miembros agrupados por rol y número de integrantes">
<p align="center"><em>Staff — agrupado por rol, con el color del rol tomado de la base de datos</em></p>
</td>
<td width="50%">
<img src="docs/screenshots/bans.jpg" alt="Página de baneos con tarjetas que muestran razón, quién sancionó, duración, fecha y expiración">
<p align="center"><em>Baneos — razón, duración, fecha y expiración, con buscador por nick</em></p>
</td>
</tr>
<tr>
<td width="50%">
<img src="docs/screenshots/applications.jpg" alt="Formulario de postulación al staff, paso 1 de 5, con selección de rol Helper o Tester">
<p align="center"><em>Postulación — asistente de 5 pasos, Helper o Tester</em></p>
</td>
<td width="50%">
<img src="docs/screenshots/chat-bot.jpg" alt="Chat bot abierto con el saludo y las tres opciones del nodo raíz">
<p align="center"><em>Chat bot — las tres ramas del nodo raíz de <code>botFlows.ts</code></em></p>
</td>
</tr>
</table>

---

## Secciones

| Sección | Ruta | Qué resuelve | Datos |
| --- | --- | --- | --- |
| **Home** | `/` | Últimos tests high y low, y total de tests por modalidad. | ISR · 1 h |
| **Tierlist** | `/tierlist` | Ranking global y por modalidad, con buscador de jugador y modal de perfil con skin 3D. | Cliente (React Query) |
| **Staff** | `/staff-navy` | Equipo agrupado por rol, con jerarquía y color del rol. | ISR · 24 h |
| **Bans** | `/bans` | Historial de sanciones: motivo, fecha, expiración y si fue por cheats. | ISR · 24 h |
| **Partners** | `/partners` | Creadores y servidores aliados. | Estático |
| **Postulaciones** | `/applications` | Asistente de 5 pasos para postular a Helper o Tester, con anti-spam por IP. | Formulario → API |
| **Panel admin** | `/admin/applications` | Bandeja privada de postulaciones: revisar, aprobar o rechazar. | Sesión + React Query |
| **Chat bot** | *global* | Asistente flotante: cambio de nick, invitación a Discord y guía de postulación. | Grafo declarativo |

El **chat bot** no usa IA: es una máquina de estados declarada en [`src/features/chat-bot/config/botFlows.ts`](src/features/chat-bot/config/botFlows.ts). Añadir un flujo nuevo es añadir un nodo ahí; solo los pasos de texto libre necesitan un handler en el controller.

---

## Arquitectura

### Capas

```
pages/<ruta>/index.tsx          Página fina: SEO, OG, JSON-LD, i18n y getStaticProps. Delega la UI.
  └── src/features/<módulo>/
        views/                  Vista del módulo — solo llama al controller y renderiza
        hooks/                  use<Feature>Controller + hooks de React Query
        components/             Componentes propios del módulo (+ CSS Modules colocalizados)
        actions/                *.action.ts  → cliente, vía axios contra /api
                                *.server.ts  → servidor, Prisma directo (sin salto HTTP)
        interfaces/             Tipos del módulo
        validations/            Esquemas Zod compartidos cliente ↔ servidor
        helpers/                Funciones puras
src/shared/                     Transversal: components, layouts, stores, motion, api, constants
src/config/lib/                 prisma · cache · rateLimit · adminAuth · profileHelper
pages/api/                      Endpoints para las llamadas de cliente
```

**Patrón controller.** Cada feature expone un `use<Feature>Controller` que compone React Query, los stores de Zustand y la traducción en un único objeto. Las vistas son delgadas por diseño: si una vista tiene lógica, va al controller.

### Decisiones que conviene conocer antes de tocar el código

- **Pages Router**, no App Router. No existe directorio `app/`, y `pages/` solo hace routing — la lógica vive en `src/`.
- **ISR por defecto, no SSR.** Las páginas con datos usan `getStaticProps` + `revalidate`; el valor lo devuelve la propia action (`revalidate: 1` si la consulta falla, para reintentar pronto en vez de cachear una página vacía).
- **`getStaticProps` llama a Prisma directamente.** Las rutas de `pages/api/` existen para las peticiones del **cliente**. Renderizar en servidor pasando por HTTP sería un salto de red inútil.
- **Zod se comparte entre cliente y servidor.** Los esquemas de `validations/` reciben los mensajes por parámetro: el cliente los inyecta traducidos con `t`, el servidor usa los mensajes por defecto en español. Un solo contrato, validado dos veces.
- **La caché de API vive en la base de datos** (tabla `api_cache`), no en memoria — sobrevive a los reinicios y funciona con múltiples instancias.
- **El rate limit sí es en memoria** ([`rateLimit.ts`](src/config/lib/rateLimit.ts), 40 req/min por IP). Es por instancia: suficiente como freno anti-abuso, no como cuota estricta.
- **Estilos con CSS Modules + `@apply`**, nunca CSS crudo. Nomenclatura BEM en camelCase: `.cardBan__item`, `.cardBan__status__active`.
- **Sin `any`.** `strict: true` y tipos de retorno explícitos en todo lo exportado.

### Stack

| Área | Elección |
| --- | --- |
| Framework | Next.js 16.2.6 (Pages Router, Turbopack) · React 19.2 |
| Lenguaje | TypeScript 5.8 (`strict`) |
| Estilos | Tailwind CSS 3.4 + CSS Modules |
| Base de datos | MySQL vía Prisma 6 (esquema *introspected*) |
| Datos (cliente) | TanStack Query 5 + Axios |
| Estado | Zustand 5 — `cursor`, `lenis`, `loader`, `menu`, `modal`, `modalities`, `search`, `skin`, `switch` |
| Formularios | React Hook Form + Zod 4 |
| i18n | next-i18next — `es` (por defecto), `en`, `pt` |
| Animación | Framer Motion 12 · Lenis (*smooth scroll*) · Swiper |
| Notificaciones | React Toastify |
| Métricas | Vercel Speed Insights |

---

## Puesta en marcha

### Requisitos

- Node.js **20** o superior
- Acceso a la base de datos **MySQL** de Navy

### Instalación

```bash
git clone https://github.com/jhosuapp/nextjs-navy.git
cd nextjs-navy
npm install          # el postinstall ejecuta prisma generate
cp .env.example .env
```

### Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Conexión MySQL: `mysql://user:password@host:3306/db`. |
| `ADMIN_SESSION_SECRET` | Sí | Secreto para firmar la sesión del panel admin (HMAC-SHA256). Cadena aleatoria de **16 caracteres o más**; la app lanza error al arrancar si falta o es más corta. |

### Comandos

```bash
npm run dev      # prisma generate + servidor de desarrollo en http://localhost:3000
npm run build    # build de producción
npm start        # sirve el build de producción
npm run lint     # ESLint (flat config)
npm run doctor   # react-doctor: salud de los componentes React
```

### Prisma

El esquema **se sincroniza desde la base de datos**, no al revés. No escribas migraciones contra tablas del bot.

```bash
npx prisma db pull      # trae el esquema desde la BD (fuente de verdad)
npx prisma generate     # regenera el cliente tras cambiar el esquema
npx prisma studio       # explorador de datos en el navegador
```

Tablas propias de esta app: `applications`, `tester_applications`, `admin_users`, `api_cache`. El resto (`tiers`, `staff`, `punishments`, `blacklists`, `cooldowns`…) las produce el bot de Discord.

Para crear el primer usuario admin, inserta en `admin_users` un `password_hash` generado con `hashPassword()` de [`src/config/lib/adminAuth.ts`](src/config/lib/adminAuth.ts) — formato `salt:hashHex` (scrypt).

---

## API

Todas las rutas viven en `pages/api/`, se consumen desde el cliente con la instancia de axios de [`src/shared/api/navy.api.ts`](src/shared/api/navy.api.ts) (`baseURL: '/api'`) y comparten tres reglas: comprobar `req.method` (405 si no coincide), envolverse en `withRateLimit`, y cachear con `getCache`/`setCache` lo que sea caro. Los duplicados de puntos por tier que hoy viven en `overall-upd.ts` deberían leerse de `information.ts`; es deuda conocida.

| Endpoint | Método | Caché | Qué hace |
| --- | --- | --- | --- |
| `/api/v2/mode/list` | GET | 1 h | Modalidades disponibles. |
| `/api/v2/profile/[uuid]` | GET | 5 min | Perfil completo de un jugador. |
| `/api/v2/profile/[uuid]/rankings` | GET | 5 min | Sus posiciones por modalidad. |
| `/api/v2/profile/by-name/[query]` | GET | 5 min | Búsqueda por nick (máx. 16 caracteres, saneado). |
| `/api/tierlist/resume` | GET | — | Resumen de últimos tests. |
| `/api/tierlist/overall-upd` | GET | — | Ranking global, con los puntos por tier aplicados en la consulta. |
| `/api/tierlist/filter-by-modalitie` | GET | — | Ranking de una modalidad. |
| `/api/applications` | POST | — | Registra una postulación. |
| `/api/bot/username` · `/username-update` | GET · POST | — | Consulta y cambio de nick desde el chat bot. Al actualizar, invalida toda la caché `profile:`. |
| `/api/admin/login` · `/logout` · `/session` | POST · GET | — | Sesión del panel admin. |
| `/api/admin/applications` · `/[id]` | GET · PATCH | — | Bandeja y cambio de estado de postulaciones. |

---

## Seguridad

- **Sesión admin sin dependencias externas.** Contraseñas con `scrypt` y comparación *timing-safe*; token firmado con HMAC-SHA256 en cookie `httpOnly`, TTL de 8 horas. El login responde un mensaje genérico: no revela si el usuario existe.
- **Anti-spam en postulaciones.** Además del rate limit global, una postulación por IP cada 30 minutos, con la IP guardada **hasheada** (SHA-256), nunca en claro.
- **Entrada saneada.** Zod valida el payload y, encima, se eliminan bytes nulos y caracteres de control que Zod no filtra.
- **Cabeceras endurecidas** en [`next.config.js`](next.config.js): CSP, HSTS con `preload`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` y `poweredByHeader: false`.
- **Imágenes remotas en lista blanca**: solo `mc-heads.net` y `render.crafty.gg`, con SVG servido en *sandbox*.
- **`console.log` eliminado en producción** (se conservan `error` y `warn`).

---

## CI

Cada push dispara [`.github/workflows/ci.yml`](.github/workflows/ci.yml), que ejecuta en orden:

```
npm run lint  →  npm audit --audit-level=high  →  npm run build
```

> [!IMPORTANT]
> Los tres pasos deben pasar. Los PR hacia `main` quedan bloqueados si alguno falla. No hay *test runner* configurado: la verificación previa a un cambio es lint + build más una comprobación real contra la base de datos.

---

## Estructura del repositorio

```
├── pages/
│   ├── _app.tsx              Providers: React Query, i18n, AnimatePresence, Lenis
│   ├── _document.tsx         Documento base
│   ├── api/                  Endpoints (rate limit + caché + Prisma)
│   ├── admin/applications/   Panel privado
│   └── <ruta>/index.tsx      Páginas públicas
├── src/
│   ├── config/               lib (prisma, cache, rateLimit, adminAuth), assets y tipografías
│   ├── features/             9 módulos de negocio
│   └── shared/               components, layouts, stores, motion, api, constants, helpers
├── prisma/schema.prisma      Esquema introspected desde MySQL
├── public/locales/{es,en,pt} Traducciones por namespace
├── next.config.js            i18n, imágenes, cabeceras de seguridad
└── CLAUDE.md                 Guía para agentes de IA que trabajen en el repo
```

---

## Contribuir

1. Rama desde `main` con un nombre descriptivo (`feat/…`, `fix/…`).
2. **Nada de texto en duro**: toda copia visible va en `public/locales/` y se consume con `useTranslation` desde el controller. Los tres idiomas, siempre.
3. Antes de añadir un `useQuery`, pregúntate si el dato depende del usuario o debe refrescarse en pantalla. Si no, es ISR — y entonces Prisma se llama directo, sin pasar por `pages/api/`.
4. Usa las factorías de [`src/shared/motion/`](src/shared/motion) (`fadeInMotion`, `fadeUpMotion`, `zoomInMotion`, `flowerMotion`) en lugar de escribir variantes de Framer Motion a mano.
5. Estilos en `*.module.css` con `@apply`. Tailwind suelto en el JSX solo para *overrides* puntuales.
6. Componentes hoja reutilizables: `memo()`, `displayName` y export nombrado.
7. Antes de abrir el PR: `npm run lint` y `npm run build` en verde.

---

<div align="center">
<sub>Navy · Tierlist competitiva de PvP de Minecraft</sub>
</div>
