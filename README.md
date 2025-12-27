## GearGuard Stack

- **Frontend**: Next.js 16 App Router (TypeScript, Tailwind, Radix UI)
- **Backend**: FastAPI + PostgreSQL (see `backend/`)

Both servers talk over REST. Set the frontend base URL before running the UI:

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_API_URL if your FastAPI server is not on http://127.0.0.1:8000
```

## Running Locally

1. **Backend**
	```bash
	cd backend
	uvicorn app.main:app --reload
	```
2. **Frontend**
	```bash
	pnpm install
	pnpm dev
	```

Visit [http://localhost:3000](http://localhost:3000) and log in with a user from the database seed (e.g. `admin@gearguard.com` / `Admin@123`).

## Features Wired to the API

- Authentication (login + signup) stores FastAPI JWT tokens locally and attaches them to protected routes.
- Equipment dashboard, detail pages, analytics insights, teams view, maintenance kanban, and request form all consume live FastAPI data.
- Drag-and-drop board updates call `PATCH /requests/{id}/status`, ensuring state stays in sync.
- Maintenance request form creates records through `POST /requests`.

## Development Notes

- Adjust `NEXT_PUBLIC_API_URL` whenever the backend host/port changes.
- The UI expects the seed data provided in `backend/app/db/seed.sql` (departments, teams, request statuses, etc.).
- Any auth-protected endpoints rely on the `authToken` in `localStorage`; clear it to force a logout.
