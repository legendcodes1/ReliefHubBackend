# ReliefHub Frontend

Frontend client for the Pain Relief / Rehab Hub project.

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

- `/login`
- `/signup`
- `/recommendations`
- `/exercises/:id`
- `/saved`

## Auth Notes

- Login and signup call backend endpoints under `/api/v1/auth`.
- Access and refresh tokens are stored in local storage.
