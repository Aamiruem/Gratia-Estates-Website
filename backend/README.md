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

Open `/video-admin/signup`, enter an owner name, an email address you can
access, and a password. The owner account is created only after the email OTP
is verified, and only when no owner account is already configured. Public
sign-up cannot replace an existing owner. To change an existing owner's email,
sign in and use **Videos → Change owner email**. Only the single
`video_admin` owner can manage project videos.

Email OTP requires SMTP settings in private backend configuration. Phone OTP
can be selected for later sign-ins after SMS delivery is configured. Public
visitors can read the video list. The first backend startup seeds the current
public sample videos only if the project-video table is empty.

Do not put database credentials, JWT secrets, or service-provider credentials
into frontend code or commit them. For deployment, use the hosting provider's
secret environment configuration, HTTPS, `COOKIE_SECURE=true`, and a
production CORS origin.

### Change the existing owner's email

While signed in, open **Videos → Change owner email**. Confirm the current
password, enter the new email, then enter the one-time verification code sent
to that address. This updates the existing owner account; it does not reopen
public registration or create another owner. The verified account keeps the
`video_admin` role, so no private configuration change is required.

### Configure email and phone OTP delivery

OTP delivery needs real credentials from your email and SMS providers. Create
an SMTP-enabled email account (for Gmail, use an app password) and a Twilio
account with an active sender or Messaging Service. Do not paste these
credentials into chat or frontend files.

From the repository's `backend/` directory (not `backend/app/`), run:

```powershell
.\.venv\Scripts\python.exe -m app.configure_otp
```

If your PowerShell prompt currently ends in `backend\app>`, first move up to
the backend directory and run the module with the already activated Python:

```powershell
Set-Location ..
python -m app.configure_otp
```

The helper prompts for SMTP settings first, hides password/token input,
validates the SMTP connection and login, and saves values to
`%LOCALAPPDATA%\GratiaEstates\backend.env`. It preserves unrelated backend
settings. SMS/Twilio setup is optional, so email OTP can be enabled first.
Choose `y` at the SMS prompt only if you also have Twilio credentials. Restart
the backend after configuration, then refresh the sign-in page. Sign-up
verifies the email address; subsequent sign-ins can use email, and phone when
Twilio is configured.

If you prefer to configure values manually, keep them in the same private
backend config file, never in frontend code or a committed file:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-address@example.com
SMTP_PASSWORD=your-email-app-password
SMTP_FROM=your-address@example.com
OWNER_PHONE_NUMBER=+15551234567
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=+15557654321
```

You can use `TWILIO_MESSAGING_SERVICE_SID` instead of `TWILIO_FROM_NUMBER`.

### Set up the initial owner email/password

Open `/video-admin/signup`, enter an email inbox you can access, and choose a
password. The initial owner account is created only after the email OTP is
verified and only if no owner is already configured. This does not delete the
video library. It requires valid SMTP delivery settings. Later sign-ins can
use either email OTP or phone OTP after the corresponding provider is
configured. Existing owner credentials cannot be replaced through public
sign-up.

### Reset the existing owner's password locally

If the existing password is no longer available, run this command from the
`backend/` directory in PowerShell. It uses the local backend configuration,
updates only the account matching `VIDEO_ADMIN_EMAIL`, and prompts for the new
password without displaying it:

```powershell
.\.venv\Scripts\python.exe -m app.reset_owner_password
```

The password must be 8-128 characters. A missing owner account, invalid
password, or confirmation mismatch leaves the database unchanged. After an
email change, the utility finds the owner by role and falls back to
`VIDEO_ADMIN_EMAIL` for an account that has not changed its email yet.
