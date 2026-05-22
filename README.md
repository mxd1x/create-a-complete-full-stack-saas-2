# Pipeline CRM

Pipeline CRM is a full-stack SaaS platform for sales teams to manage leads, companies, pipelines, and conversions. It includes authentication, a protected dashboard, lead CRM with kanban, analytics, team assignment, PostgreSQL persistence, and Docker support.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS with shadcn-style UI primitives
- Prisma ORM
- PostgreSQL
- NextAuth credentials auth with JWT sessions
- Server Actions and REST API routes
- @dnd-kit drag-and-drop pipeline board
- Docker and docker-compose

## Features

- Premium dark Linear-inspired landing page
- Signup (creates organization workspace), login, forgot-password, password reset
- Dashboard with pipeline metrics and recent leads
- Lead CRM: search, filters, pagination, add/edit/delete modals
- Drag-and-drop kanban pipeline (New → Contacted → Qualified → Proposal Sent → Won → Lost)
- Companies management with lead counts
- Analytics: conversions, sales growth, employee performance
- Settings: profile, company, notifications
- CSV and JSON exports

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Push schema and seed demo data:

```bash
npm run db:push
npm run seed
```

4. Start the dev server:

```bash
npm run dev
```

Demo login (after seed):

- Email: `founder@pipelinecrm.test` (or your `ADMIN_EMAIL`)
- Password: `password123`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Sign in |
| `/signup` | Create account + organization |
| `/dashboard` | Overview |
| `/leads` | Lead table + kanban |
| `/companies` | Company accounts |
| `/analytics` | Metrics and charts |
| `/settings` | Profile, company, notifications |
