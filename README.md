# GearGuard

Submission for the **OdooXAdani University Hackathon – Online Qualifier Round**. GearGuard is a full-stack maintenance intelligence platform that unifies equipment health signals, work orders, and team collaboration into a cohesive dashboard.

## Tech Stack
- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind CSS, Radix UI, custom component library.
- **Backend**: FastAPI, Uvicorn, Pydantic.
- **Database**: PostgreSQL with SQL seed scripts and stored procedures.
- **Tooling**: pnpm/bun/npm for the web client, Python virtual environments for the API, Postman collection for manual testing.

## Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ with a reachable instance (local or remote)

## Environment Variables
Create an `.env` (backend) with the connection string below, or export it in your shell:

```
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
```

> Copy `.env.example` if you prefer file-based configuration. Update the credentials/host to match your PostgreSQL instance.

## Local Setup

### 1. Prepare PostgreSQL
1. Create a database (e.g., `mydatabase`).
2. From `backend/app/db`, run the SQL scripts in this order to provision schema, helper procedures, and demo data:
   - `base.sql`
   - `procedures.sql`
   - `seed.sql`
3. Verify the seed accounts (e.g., `admin@gearguard.com / Admin@123`) exist for testing.

### 2. Run the FastAPI backend
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate     # On Windows PowerShell use: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
set DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase   # Windows
export DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase # macOS/Linux
uvicorn app.main:app --reload
```

### 3. Run the Next.js frontend
Choose the package manager you prefer:

```bash
pnpm install   # or: npm install | bun install
pnpm dev       # or: npm run dev | bun dev
```

The web client expects the API at `http://127.0.0.1:8000`. If you change ports, update `NEXT_PUBLIC_API_URL` in `app/.env.local`.

### 4. Use the app
Keep both servers running and visit [http://localhost:3000](http://localhost:3000). Sign in with any seeded account to explore dashboards, maintenance kanban, analytics, and request workflows.

## Additional Notes
- Postman collection is available in `postman/GearGuard.postman_collection.json` for manual endpoint verification.
- Seed data aligns with the UI defaults (departments, priority tags, and request statuses). Re-run `seed.sql` whenever you need a clean demo state.
- For hackathon submissions, capture screenshots/recordings while both servers run locally to reflect the real experience.
