# Symponify – Fixes Applied

## What was fixed

- Added a reusable GSAP ambient visual layer for the landing page and app dashboard.
- Added a premium dashboard hero with animated vinyl, waveform, glass cards, and live library stats.
- Fixed broken dashboard navigation buttons:
  - `/library` → `/home/library`
  - `/liked` → `/home/liked`
- Improved guest mode liked songs by saving guest likes in `localStorage` instead of silently failing.
- Improved local development upload behavior by allowing the existing local disk fallback when Cloudinary credentials are not configured.
- Split Vite production bundles into `react`, `animation`, and `network` chunks to remove the large single-bundle warning.
- Cleaned environment examples for local development.

## Run locally

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Set your real `MONGO_URI` and `JWT_SECRET` in `server/.env`.
Cloudinary values are optional for local development. When empty, uploads use local disk storage.

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Verified

```bash
cd client && npm run build
```

The production build completes successfully.
