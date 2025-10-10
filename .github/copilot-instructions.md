# Copilot Instructions for Odin Message App

## Project Overview

- **Monorepo structure:**
  - `client/` — React + TypeScript frontend (Vite)
  - `server/` — Node.js backend (TypeScript, Express, Prisma)
- **Purpose:** Messenger app based on The Odin Project's Node.js messaging app curriculum.

## Architecture & Data Flow

- **Frontend:**
  - Uses React Router for navigation (`src/components/routes.tsx`).
  - Auth handled via context (`src/components/Authentication/AuthContext.ts`, `AuthProvider.tsx`).
  - Pages/components are organized by feature (e.g., `ChatPage`, `ChatListPage`, `EditProfile`).
  - API calls are made to the backend (see `userServices.ts`, `chatController.ts`).
- **Backend:**
  - Express routes in `server/src/routes/` (auth, user, chats).
  - Controllers in `server/src/controllers/` handle business logic.
  - Prisma ORM for database access (`server/src/lib/prisma.ts`, `prisma/schema.prisma`).
  - JWT-based authentication (`server/src/middlewares/validateJWTToken.ts`).

## Developer Workflows

- **Frontend:**
  - Start dev server: `cd client && npm run dev`
  - Build: `npm run build`
  - Lint: `npm run lint` (uses custom ESLint config, see `eslint.config.js`)
- **Backend:**
  - Start server: `cd server && npm run dev` (nodemon)
  - Prisma migrations: `npx prisma migrate dev` (see `prisma/migrations/`)
  - Environment config: `.env` file in `server/`

## Conventions & Patterns

- **TypeScript everywhere:** All code is strictly typed.
- **Feature-based file organization:** Components, controllers, and routes are grouped by feature.
- **Context for auth:** Use React context for authentication state.
- **Error handling:** Centralized in `server/src/services/handleError.ts`.
- **Validation:** Custom middlewares for request validation (`server/src/middlewares/`).
- **Styling:** CSS Modules for component styles (e.g., `ChatPage.module.css`).

## Integration Points

- **Frontend ↔ Backend:**
  - API endpoints: `/api/auth`, `/api/user`, `/api/chats` (see route files).
  - JWT tokens for auth, stored in frontend context.
- **Database:**
  - Prisma schema defines models; migrations tracked in `prisma/migrations/`.

## Examples

- **Adding a new page:**
  - Create a folder in `client/src/components/`.
  - Add `.tsx` and `.module.css` files.
  - Register route in `routes.tsx`.
- **Adding a backend route:**
  - Add route file in `server/src/routes/`.
  - Implement controller in `server/src/controllers/`.
  - Update Prisma schema if new model needed.

## Key Files

- `client/src/components/routes.tsx` — Frontend routing
- `client/src/components/Authentication/` — Auth logic
- `server/src/routes/` — API endpoints
- `server/src/controllers/` — Business logic
- `server/src/lib/prisma.ts` — DB access
- `server/prisma/schema.prisma` — DB schema

---

For questions or unclear conventions, check the respective README or ask for clarification.
