# Proposed Frontend Folder Structure

Aligned with the backend contract and React/Vite conventions.

```
/
├─ Context/                  # Project context and conventions
├─ public/                   # Static assets served as-is
├─ src/
│  ├─ api/                   # Fetch helpers, endpoints, error normalization
│  │  ├─ api-client.js
│  │  └─ endpoints.js
│  ├─ store/                 # Global state (auth/session)
│  │  └─ auth-store.jsx
│  ├─ routes/                # Routing and guards
│  │  ├─ AppRouter.jsx
│  │  └─ ProtectedRoute.jsx
│  ├─ features/
│  │  └─ applications/       # Domain feature: list/add/edit/delete
│  │     ├─ components/      # Feature UI (tables, forms, filters)
│  │     ├─ hooks/           # Data fetching and mutations
│  │     ├─ services/        # Feature-level helpers (mappers, validators)
│  │     └─ index.js
│  ├─ pages/                 # Page-level composition
│  │  ├─ Login.jsx
│  │  ├─ Register.jsx
│  │  └─ Applications.jsx
│  ├─ components/            # Reusable UI (inputs, buttons, layout)
│  ├─ hooks/                 # Shared hooks (e.g., useForm, useToast)
│  ├─ utils/                 # Pure utilities (validation, formatting)
│  ├─ styles/                # Global styles, CSS variables
│  └─ main.jsx               # App entry
├─ .env.example              # Environment variables (VITE_API_BASE_URL)
├─ package.json
└─ vite.config.js
```

Notes:
- Group by feature to keep domain logic localized; share only generic UI/utilities.
- Keep API-only logic in `src/api/`; UI should consume hooks/services, not raw fetch.
- Tests may live adjacent to files (`*.test.js`) or under `__tests__/` within each area.
- Prefer co-located styles per component/feature; minimize global CSS.

