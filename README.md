# JTracker Frontend

React + Vite frontend for job application tracking.

## Requirements
- Node 18+
- Backend API deployed and accessible
- Backend CORS configured to allow frontend origin

## Quick Start

### Local Development
```bash
cp env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL
npm install
npm run dev
```

### Render Deployment
See `Context/render-env-vars.md` for Render environment variables.

## Integration Guide

**Full integration steps**: See `Context/integration-guide.md` for detailed backend connection instructions.

**Backend configuration checklist**: See `Context/backend-config-checklist.md` for backend setup requirements.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview build

## Environment Variables

### Required
- `VITE_API_BASE_URL` – Backend API base URL (HTTPS in production)
  - Example: `https://jtracker-backend.onrender.com`
  - Local: `http://localhost:3000`

### Optional
- `VITE_APP_NAME` – Override app display name
  - Default: Uses package.json name

## Folder Structure
- `src/api/` – Fetch client with in-memory access token + refresh retry
- `src/store/auth-store.jsx` – Auth context/actions; ProtectedRoute in `src/routes/`
- `src/features/applications/` – CRUD UI, filters, pagination
- `src/utils/healthCheck.js` – Optional backend health check utility
- `Context/` – Project conventions, integration guides, and structure references

## Auth Behavior
- Access token kept in memory only (never stored in localStorage/sessionStorage)
- Refresh via httpOnly cookie with automatic retry on 401
- On failed refresh, user is automatically logged out
- All API calls include `credentials: 'include'` for cookie support

## Backend Requirements

### CORS Configuration
Backend `CORS_ORIGINS` must include:
- Frontend production URL: `https://<your-frontend-url>`
- Local dev URL: `http://localhost:5173`

### Cookie Configuration
Backend refresh cookie must have:
- `httpOnly: true`
- `sameSite: 'lax'` (or `'none'` for cross-domain)
- `secure: true` (in production/HTTPS environments)

### API Endpoints
Backend must implement:
- `POST /auth/register` – User registration
- `POST /auth/login` – User login
- `GET /auth/me` – Get current user
- `POST /auth/refresh` – Refresh access token (uses cookie)
- `POST /auth/logout` – Logout user
- `GET /health` – Health check (optional)
- `GET /health/db` – Database health check (optional)
- `POST /applications` – Create application
- `GET /applications` – List applications (with filters/sort/pagination)
- `PATCH /applications/:id` – Update application (URL immutable)
- `DELETE /applications/:id` – Delete application

See `Context/frontend-context.md` for full API contract details.

## Manual Test Checklist
- [ ] Register: Valid rules, shows errors on invalid input
- [ ] Login: Success redirects to Applications; bad creds show error
- [ ] Refresh: After token expiry, first API call refreshes once then retries
- [ ] `/auth/me`: User info loads on page after login/refresh
- [ ] Applications: List loads with status/sort/pagination; create/edit (URL readonly on edit); delete confirm
- [ ] Logout: Clears session; protected route redirects to login
- [ ] Cookies: Refresh call sent with `credentials: 'include'`; no tokens in storage
- [ ] CORS: No CORS errors in browser console
- [ ] Health check: Backend connectivity verified (if health check implemented)

