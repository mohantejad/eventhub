# Deployment: Render + Vercel (Free Tier)

This project is configured for:
- `eventhub-backend` on Render (Django API)
- `frontend` on Vercel (Next.js app)

## 1. Prepare Neon
Create a free Neon Postgres database and copy its connection string.

Example format:
`postgresql://user:password@host.neon.tech/dbname?sslmode=require`

## 2. Deploy Backend on Render
1. Push this repo to GitHub.
2. In Render, click `New` -> `Blueprint`.
3. Select this repo (Render will detect `render.yaml`).
4. Create the backend service.

## 3. Set Backend Environment Variables (Render)

- `DATABASE_URL`: your Neon URL
- `DJANGO_ALLOWED_HOSTS`: backend Render hostname
  - Example: `eventhub-backend.onrender.com`
- `CORS_ALLOWED_ORIGINS`: frontend Vercel URL
  - Example: `https://eventhub.vercel.app`

## 4. Deploy Frontend on Vercel
1. Import this repo in Vercel.
2. Set `Root Directory` to `frontend`.
3. Add env var:
   - `NEXT_PUBLIC_BACKEND_URL=https://eventhub-backend.onrender.com`
4. Deploy.

## 5. Redeploy Order
1. Deploy backend on Render
2. Deploy frontend on Vercel

## 6. Smoke test
1. Open frontend URL
2. Signup/Login
3. Create event
4. List/filter events
5. Book ticket and verify success page

## Notes
- Booking emails are disabled by default (`SEND_BOOKING_EMAILS=False`).
- Media uploads use local disk on Render free web services (ephemeral).
  For durable media, use S3/Cloudinary later if needed.
