# Gratia Estates authentication and video API

The website now uses the supplied FastAPI/PostgreSQL authentication app for
owner sign-in and project-video storage. The existing account remains in the
PostgreSQL `users` table; no new account or Supabase project is required.

## Backend files

- `app/` — FastAPI authentication, session-cookie, user-profile, and project-video endpoints
- `requirements.txt` — Python dependencies
- `docker-compose.yml` — optional local PostgreSQL service
- `.env.example` — template for a new installation
- `supabase/` — legacy SQL setup; it is not used by the current FastAPI video flow

The supplied virtual environments and private `.env` files are intentionally
not stored in this folder. On this machine, the previous auth configuration is
loaded from `%LOCALAPPDATA%\GratiaEstates\backend.env` so database and JWT
secrets do not get copied into the OneDrive-synced project.

## Start the backend on this machine

From the repository root in PowerShell:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If `backend\.venv` has not been created yet:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API listens on port `8000` on this computer's network interfaces, so the
frontend can reach it when opened from another device on the same trusted
network. Health is available at `/health` and interactive API documentation
at `/docs`. PostgreSQL must be reachable at the `DATABASE_URL` stored in the
local config.

Run only one backend server on port `8000`. If startup reports that the
address is already in use, check whether the existing server is healthy at
`http://127.0.0.1:8000/health` before starting another copy.

## Start the frontend

In a second PowerShell window:

```powershell
cd frontend
npm run dev
```

The frontend chooses port 8000 on the same host used to open the website.
For a non-local backend, set `VITE_API_URL` in `frontend/.env` using
`frontend/.env.example`, then restart Vite.

## Owner account sign-in and first-time setup

1. Set `OWNER_SETUP_TOKEN` in `%LOCALAPPDATA%\GratiaEstates\backend.env` to a
   private random value of at least 32 characters. For example, in PowerShell:

   ```powershell
   ([guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N"))
   ```

   Copy the generated value into the local backend config as
   `OWNER_SETUP_TOKEN=<generated-value>`. Do not put this code in frontend
   files or commit it.
2. Restart the backend, open `/video-admin/signup`, and enter the email
   configured as `VIDEO_ADMIN_EMAIL`, the private setup code, and a new
   password. This creates the account if it does not exist, or sets a new
   password on the existing owner account.
3. Owner setup succeeds only once per database. After setup, sign in at
   `/video-admin/login` with the configured email and the password you set.
   Use the local reset command below if you need to change it again.
4. The backend checks the account against `VIDEO_ADMIN_EMAIL` and only allows
   that account to create, update, seed, or delete project videos.
5. Public visitors can read the video list. The first backend startup seeds
   the current public sample videos only if the project-video table is empty.

The owner email and setup code belong in private backend configuration and are
not embedded in frontend code. Do not put database credentials, JWT secrets,
setup codes, or service-role keys into the frontend or commit them. For
deployment, use the hosting provider's secret environment configuration, HTTPS,
`COOKIE_SECURE=true`, and a production CORS origin.

### Reset the existing owner's password locally

If the existing password is no longer available, run this command from the
`backend/` directory in PowerShell. It uses the local backend configuration,
updates only the account matching `VIDEO_ADMIN_EMAIL`, and prompts for the new
password without displaying it:

```powershell
.\.venv\Scripts\python.exe -m app.reset_owner_password
```

The password must be 8-128 characters. A missing owner account, invalid
password, or confirmation mismatch leaves the database unchanged.
