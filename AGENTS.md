# AGENTS.md

## Project Overview

Symponify is a monorepo with:

- `client/`: React + Vite SPA
- `server/`: Express + MongoDB API
- `server/public/songs/`: deployed static audio and cover assets
- `Songs/`: legacy local media sources used for some fallback paths

## Architecture

Frontend:
- `src/App.jsx`: route shell and auth gating
- `src/context/PlayerContext.jsx`: player, liked songs, auth user sync
- `src/components/`: layout, cards, player, navigation
- `src/pages/`: Home, Search, Library, Liked Songs, Login, Add Song, Manage Songs
- `src/lib/api.js`: Axios instance

Backend:
- `server.js`: app bootstrap, CORS, request logging, static media, route mounting
- `config/db.js`: MongoDB connection
- `routes/auth.js`: login, register, admin access, current user
- `routes/songs.js`: songs, albums, uploads, likes, media handling
- `routes/playlists.js`: playlist CRUD
- `middleware/`: auth and upload handling
- `utils/`: validation and media utilities

## Setup Commands

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## Build Commands

Frontend:

```bash
cd client
npm run build
```

Backend start:

```bash
cd server
npm start
```

## Lint / Test Commands

There is no dedicated lint or automated test framework configured yet.

Safe checks:

```bash
cd server
node -c server.js
node -c routes/auth.js
node -c routes/songs.js
node -c routes/playlists.js
```

```bash
cd client
npm run build
```

## Deployment Workflow

Frontend:
- Deploy `client/` to Vercel
- Ensure `client/vercel.json` rewrites `/api/*` and `/songs/*`

Backend:
- Deploy `server/` to Render
- Set env vars from `server/.env.example`
- Confirm media files exist in `server/public/songs`

## Environment Setup

Backend required env:
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_ORIGIN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Frontend optional env:
- `VITE_API_BASE_URL`

## Repository-Specific Rules

- Prefer `rg` for search.
- Use `apply_patch` for file edits.
- Do not remove or overwrite media files casually.
- Treat `Songs/` as legacy local inputs, not the primary deployed media source.
- Preserve Vercel `/api` and `/songs` rewrite behavior.
- Keep admin-only routes guarded on both frontend and backend.
- When touching media paths, verify both local and deployed URLs.

## Coding Conventions

- Keep files ASCII-first where practical.
- Use escaped Unicode sequences when source encoding is unstable.
- Prefer small reusable utilities for validation and media path logic.
- Add concise comments only when the logic is non-obvious.
- Preserve the existing Symponify design language.

## Animation & UI System (Framer Motion + ShadCN/UI)

### New Dependencies Installed
- **Framer Motion 12.40.0** - Animation library with GPU acceleration
- **Radix UI 53 packages** - Accessible component primitives
- **Utilities:** clsx, class-variance-authority, tailwind-merge

### New Component Libraries

#### Animation System (`src/lib/animations.js`)
- 30+ animation variants for all interaction types
- Consistent easing curve: `[0.22, 1, 0.36, 1]`
- Categories: page transitions, list animations, hover effects, modals, loading states
- **Usage:** `import { pageVariants, listItemVariants } from '../lib/animations'`

#### Accessibility Utilities (`src/lib/animation-utils.js`)
- `useReducedMotion()` - Respects user accessibility preferences
- `createAccessibleTransition()` - Motion-aware timing
- `usePageTransition()` - Combined hook for pages
- **All animations disable when prefers-reduced-motion is enabled**

#### Toast Notifications (`src/context/ToastContext.jsx` + `src/components/Toast.jsx`)
- Global notification system via React Context
- `useToast()` hook: `success()`, `error()`, `warning()`, `info()`
- Auto-dismiss with configurable duration
- Position: fixed top-right corner
- **Usage:** `const { success, error } = useToast()`

#### Skeleton Loaders (`src/components/Skeleton.jsx`)
- Base `Skeleton` with pulse animation
- Pre-built: `SongRowSkeleton`, `AlbumCardSkeleton`, `PlayerBarSkeleton`
- `SkeletonWrapper` for conditional loading states
- **Usage:** Wrap loading content for seamless UX

#### Motion Wrappers (`src/components/motion/MotionWrappers.jsx`)
- `AnimatedPage` - Page transitions
- `AnimatedContainer` - Staggered children
- `AnimatedList` & `AnimatedListItem` - List animations
- `FadeIn`, `HoverScale`, `SkeletonWrapper` - Common patterns

#### UI Components (`src/components/ui/`)
- **Button** - Variants: default, outline, ghost, secondary, destructive, link
- **Badge** - Variants: primary, secondary, success, warning, error, info
- **Card** - CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Input** - Text input with focus states
- **Textarea** - Multi-line input with min-height
- All components: Full dark mode support, accessibility-first design

### Integration Points

**In `src/main.jsx`:**
```javascript
<ToastProvider>
  <PlayerProvider>
    <App />
    <ToastContainer />
  </PlayerProvider>
</ToastProvider>
```

**In `src/components/MainLayout.jsx`:**
- Page transitions on route change
- Sidebar backdrop animation
- Motion wrapper on content outlet

**In `src/components/SongRow.jsx`:**
- List item fade + slide animation
- Hover lift effect with background change
- Like button scale animation

### Documentation Files

- **`INTEGRATION_STATUS.md`** - Comprehensive checklist of completed tasks and roadmap
- **`IMPLEMENTATION_GUIDE.md`** - 7 common patterns with copy-paste code examples
- **`API_REFERENCE.md`** - Complete API documentation for all systems
- **`INTEGRATION_COMPLETE.md`** - Detailed summary of Phase 1-2 completion

### Quick Start Examples

**Animate a page:**
```javascript
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'

<motion.div variants={prefersReducedMotion ? {} : pageVariants} {...} />
```

**Show toast notification:**
```javascript
import { useToast } from '../context/ToastContext'

const { success, error } = useToast()
success('Saved!')  // Auto-dismisses after 3s
```

**Load with skeleton:**
```javascript
import { SkeletonWrapper, SongRowSkeleton } from '../components/Skeleton'

<SkeletonWrapper isLoading={loading} skeleton={<SongRowSkeleton />}>
  {songs.map(s => <SongRow key={s._id} song={s} />)}
</SkeletonWrapper>
```

**Animated list:**
```javascript
import { AnimatedList, AnimatedListItem } from '../components/motion/MotionWrappers'

<AnimatedList>
  {items.map(item => (
    <AnimatedListItem key={item.id}>{item.name}</AnimatedListItem>
  ))}
</AnimatedList>
```

### Next Implementation Steps

**High Priority (Core Pages):**
1. Home.jsx - Add page animations + skeleton loading
2. Search.jsx - Result animations + loading states
3. Library.jsx - List animations + skeletons

**Medium Priority (Forms):**
4. Login.jsx - Form animations + toast integration
5. AddSong.jsx - Upload animation + notifications
6. ManageSongs.jsx - Modal + list animations

**Polish & Optimization:**
7. Navbar.jsx, Sidebar.jsx, PlayerBar.jsx - Component animations
8. Album/Featured Cards - Hover effects
9. Accessibility audit - prefers-reduced-motion testing
10. Performance profiling - Frame rate optimization

### Build Status
✅ **Successful** - Build: 477.43 KB (148.58 KB gzipped), 523 modules, 7.96s compile time

## Debugging Checklist

1. Check `client/vercel.json` rewrites.
2. Check Render env vars, especially `CLIENT_ORIGIN`, `JWT_SECRET`, `MONGO_URI`.
3. Verify `GET /api/health`.
4. Verify `GET /api/songs/albums`.
5. Verify direct media URLs under `/songs/...`.
6. If images fail only on Vercel, test the same `/songs/...` path on both Vercel and Render.
7. If auth fails, clear `localStorage` token/user and test `/api/auth/login` again.
8. If uploads fail, inspect song title folder generation and file extensions.
