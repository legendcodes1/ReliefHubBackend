# ReliefHub Frontend

Frontend client for ReliefHub

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file from the example:

```bash
cp .env.example .env
```

3. Ensure the backend API is running and update `.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Scripts

- `npm run dev` - start Vite development server
- `npm run build` - type-check and build production assets
- `npm run lint` - run ESLint
- `npm run preview` - preview production build locally

## Current Routes

- Public-only:
  - `/login`
  - `/signup`
- Protected:
  - `/home`
  - `/recommendations`
  - `/exercises/:id`
  - `/saved`
  - `/routines`
  - `/my-routines`
  - `/community-routines`
  - `/account`

## Auth Notes

- Login and signup call backend endpoints under `/api/v1/auth`.
- Access token is stored client-side.
- Refresh token is managed as an HTTP-only cookie by the backend.

## More Documentation

- Full project docs live at repo root (`../README.md`, `../docs/`, `../CONTEXT.md`).
