# MenuFit

Aplicación móvil Expo para planificar menús personalizados, descubrir recetas y organizar la compra según las preferencias del hogar.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/menufit/` — app Expo principal y rutas de la experiencia móvil.
- `artifacts/menufit/context/MenuFitContext.tsx` — recetas, motor de generación, preferencias y persistencia local.
- `artifacts/menufit/components/MenuFitUI.tsx` — componentes visuales compartidos de MenuFit.
- `artifacts/menufit/constants/colors.ts` — tokens de color claro/oscuro.
- `artifacts/menufit/assets/images/` — icono y fotografía de platos usados por la app.

## Architecture decisions

- La primera versión es local-first: usa AsyncStorage para que onboarding, menús, favoritos, compra e historial funcionen sin backend.
- El generador filtra primero alergias/intolerancias y exclusiones; las alergias tienen prioridad estricta sobre el resto de preferencias.
- La lista de compra se recalcula desde el menú y escala cantidades por número de personas, descontando ingredientes indicados como disponibles en casa.
- La app usa Expo Router con pestañas inferiores y rutas de detalle/sustitución para una experiencia móvil nativa.

## Product

MenuFit ofrece configuración inicial guiada, generación de menús de 1 a 7 días, detalle de recetas con pasos y nutrición orientativa, sustitución de comidas, favoritos, lista de compra agrupada, historial de planes y ajustes editables.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- El workflow móvil es `artifacts/menufit: expo`; el preview se abre con Expo Go o con el preview web de Expo.
- El error de `libglib-2.0.so.0` del React Native DevTools opcional no impide que Metro compile ni que la app se ejecute.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
