# Frontend Conventions

Standards to keep the React/Vite frontend aligned with the backend and consistent across contributors.

## Naming
- Files: kebab-case for modules (`api-client.js`, `auth-store.jsx`), PascalCase for components (`LoginForm.jsx`).
- Components: PascalCase functions; hooks use `useX`; contexts end with `Provider`.
- State/vars: camelCase; constants in SCREAMING_SNAKE_CASE.
- Routes: lowercase, dash-separated paths (e.g., `/login`, `/applications`).
- Enums/strings: mirror backend status values exactly (`APPLIED`, `INTERVIEWING`, `REJECTED`, `OFFER`, `ACCEPTED`).

## Comments
- Prefer clear naming; add comments only for intent or non-obvious logic (e.g., token refresh flow, retry rules).
- Keep TODOs actionable with owner/context; avoid obsolete comments.
- Document cross-cutting behaviors at module top (e.g., API client retry/refresh rules).

## Separation of Concerns
- Components: keep presentational components stateless where possible; container components handle data fetching and orchestration.
- API layer: `src/api/` owns network concerns (base URL, headers, refresh retry, error normalization).
- State: `src/store/` owns auth/user/session; avoid scattering token logic in UI.
- Features: group by domain (`features/applications/` for list/edit/delete UI + hooks).
- Routing/guards: `src/routes/` for public/protected routing and redirects.
- Styles: colocate component styles (CSS or CSS Modules) and keep globals minimal.

## Cybersecurity Best Practices
- Tokens: store access token only in memory; rely on refresh httpOnly cookie for renewal. Never persist tokens in localStorage/sessionStorage.
- Requests: send `credentials: 'include'` on refresh calls; include Bearer token only when present.
- 401 handling: single refresh + retry; on failure, logout and clear in-memory token.
- Input validation: mirror backend rules before submit (email format, password strength, non-empty trimmed fields, URL validation, status enum, pageSize caps).
- Output encoding: avoid `dangerouslySetInnerHTML`; sanitize any HTML if ever introduced.
- Secrets: load from `.env` (e.g., `VITE_API_BASE_URL`), never commit real secrets.
- Dependencies: keep deps minimal and updated; avoid unused packages; review for known vulns.
- Network: enforce HTTPS in production; ensure CORS origin matches frontend URL.

## Unit Testing Approach
- Scope: cover auth store logic (login/logout/refresh flow), API client retry/refresh behavior, and form validation utilities.
- Tools: prefer Vitest + Testing Library; mock fetch for API client tests.
- Structure: co-locate tests next to modules (`api-client.test.js`) or under `__tests__/`.
- Behavior-first: assert observable outcomes (state transitions, retries invoked once) rather than implementation details.
- Fixtures: reuse sample payloads aligned with backend contract (`user`, `application` objects, status enums).

