# JTracker Frontend

React + Vite frontend for job application tracking.

## Requirements
- Node 18+
- API base URL in `env.example` (copy to `.env` locally).

## Setup
```bash
cp env.example .env
npm install
npm run dev
```

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview build

## Environment
- `VITE_API_BASE_URL` (required): backend base URL (HTTPS in prod).
- `VITE_APP_NAME` (optional): override app display name.

## Folder Highlights
- `src/api/` fetch client with in-memory access token + refresh retry.
- `src/store/auth.js` auth context/actions; ProtectedRoute in `src/routes/`.
- `src/features/applications/` CRUD UI, filters, pagination.
- `Context/` project conventions and structure references.

## Auth Behavior
- Access token kept in memory; refresh via httpOnly cookie with one retry on 401.
- On failed refresh, user is logged out.

## Manual Test Checklist
- Register: valid rules, shows errors on invalid input.
- Login: success redirects to Applications; bad creds show error.
- Refresh: after token expiry, first API call refreshes once then retries.
- `/auth/me`: user info loads on page after login/refresh.
- Applications: list loads with status/sort/pagination; create/edit (URL readonly on edit); delete confirm.
- Logout: clears session; protected route redirects to login.
- Cookies: refresh call sent with `credentials: 'include'`; no tokens in storage.

