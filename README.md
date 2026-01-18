# Crypto Broker Dashboard (Next.js)

A modern, responsive crypto trading user dashboard built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Public pages
- `/` (Landing)
- `/signup`
- `/login`
- `/forgot-password` (placeholder)

## Protected pages (auth required)
- `/dashboard`
- `/deposit`
- `/withdrawal`
- `/trade`
- `/settings/profile`
- `/settings/account`
- `/settings/security`

## Auth flow (demo)
- Landing redirects to `/dashboard` if `localStorage.auth === "true"`
- Signup redirects to `/login` after success
- Login sets `localStorage.auth = "true"` and routes to `/dashboard`
- Logout clears `auth` and routes to `/login`

## Run
```bash
npm install
npm run dev
```
