# Gmail SMTP – Email password reset

Client users can request a **reset link by email** (in addition to OTP by phone). The backend sends the link via Gmail SMTP using Nodemailer.

## Required env vars (server `.env`)

```env
# Gmail SMTP (for password reset emails)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Frontend base URL (used in reset link)
FRONTEND_URL=http://localhost:3000
```

- **GMAIL_USER** – Gmail address that sends the emails.
- **GMAIL_APP_PASSWORD** – [App Password](https://myaccount.google.com/apppasswords), not your normal Gmail password. Requires 2-Step Verification.
- **FRONTEND_URL** – Base URL of your Next.js app (no trailing slash). Reset link will be `{FRONTEND_URL}/auth/reset-password-email?token=...`.

## Gmail App Password

1. Turn on [2-Step Verification](https://myaccount.google.com/security).
2. Go to [App passwords](https://myaccount.google.com/apppasswords).
3. Create an app password for “Mail” (or “Other”).
4. Copy the 16-character password into `GMAIL_APP_PASSWORD`.

## Security (reset link)

- **Random token:** 32 bytes (64 hex chars), generated with `crypto.randomBytes(32)`.
- **Stored hashed:** Token is hashed with bcrypt before saving in DB.
- **Expiry:** 60 minutes (configurable in `passwordResetEmailService.js`).
- **One-time use:** Token is cleared after a successful password reset.

## API

- **POST** `/api/client/auth/forgot-password`  
  Body: `{ "email": "user@example.com" }`  
  Sends reset link to that email (or generic message if account not found).

- **POST** `/api/client/auth/reset-password-email`  
  Body: `{ "token": "<from link>", "newPassword": "..." }`  
  Validates token and sets new password.

- **GET** `/api/client/auth/check-email-service`  
  Returns `{ configured: true|false }` for Gmail SMTP.

## Database

Ensure `Client_User` has:

- `passwordResetToken` (TEXT, nullable)
- `passwordResetTokenExpiresAt` (TIMESTAMP(3), nullable)

If you use Prisma, run:

```bash
cd server
npx prisma db execute --stdin --schema=prisma/schema.prisma
```

Then paste:

```sql
ALTER TABLE "Client_User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "Client_User" ADD COLUMN IF NOT EXISTS "passwordResetTokenExpiresAt" TIMESTAMP(3);
```

Then Ctrl+Z and Enter (Windows) or Ctrl+D (Unix) to send stdin.

Or run the migration in `prisma/migrations/20250126000001_add_password_reset_token/migration.sql` manually in your DB client.
