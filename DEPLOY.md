# Deploy Pipeline CRM (GitHub + Vercel)

## Part 1 — Install GitHub tools (one time)

### Option A: GitHub Desktop (easiest)

1. Download: https://desktop.github.com
2. Install and sign in with your GitHub account.
3. **File → Add Local Repository** → select this folder:
   ```
   pipeline crm
   ```
4. Click **Publish repository** → name it `pipeline-crm` → Publish.

### Option B: Terminal (already set up on this machine)

Git and GitHub CLI (`gh`) are installed. Log in once:

```bash
gh auth login
```

Choose: **GitHub.com** → **HTTPS** → **Login with a web browser** → paste the code.

Then create the repo and push:

```bash
cd "/Users/dave/Documents/Codex/2026-05-18/create-a-complete-full-stack-saas-2/pipeline crm"
gh repo create pipeline-crm --public --source=. --remote=origin --push
```

---

## Part 2 — Database (production)

Use a free hosted PostgreSQL:

1. **Neon** (recommended): https://neon.tech → New project → copy **connection string**.
2. Or **Supabase**: https://supabase.com → New project → Settings → Database → connection string.

Keep this URL — you need it as `DATABASE_URL`.

---

## Part 3 — Deploy on Vercel

1. Go to https://vercel.com and sign in with **GitHub**.
2. **Add New → Project** → import your `pipeline-crm` repo.
3. **Environment variables** (Settings → Environment Variables):

| Name | Value |
|------|--------|
| `DATABASE_URL` | Your Neon/Supabase PostgreSQL URL |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` (set after first deploy, then redeploy) |
| `ADMIN_EMAIL` | Your email for admin signup |

4. **Deploy**.

5. After first deploy, update `NEXTAUTH_URL` to your real Vercel URL and **Redeploy**.

6. Initialize the database (run locally once, pointing at production DB):

```bash
cd "/Users/dave/Documents/Codex/2026-05-18/create-a-complete-full-stack-saas-2/pipeline crm"
# Temporarily set DATABASE_URL in .env to your Neon URL, then:
npx prisma db push
npm run seed
```

Or in Vercel: **Settings → Functions** is not needed; use local `db push` + `seed` against prod `DATABASE_URL`.

---

## Part 4 — Verify

- Open your Vercel URL → landing page loads.
- **Sign up** or use seed user (if you ran seed on prod DB).
- Log in → dashboard, leads, companies work.

---

## Docker (alternative — VPS)

```bash
docker compose up -d --build
docker compose exec app npx prisma db push
docker compose exec app npm run seed
```

Set `NEXTAUTH_URL` to your server domain in `docker-compose.yml`.
