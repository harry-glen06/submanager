# SubManager

A full-stack web app for tracking recurring subscriptions and bills. It normalises every billing cycle to a common monthly cost — so a $120/year service and a $10/month service are compared honestly — and shows your true monthly spend across everything you pay for.

**Live demo:** https://submanager-lyart.vercel.app

<!-- Add a screenshot for the recruiter who reads this first:
     drop an image in the repo (e.g. screenshot.png) and uncomment the line below.
![SubManager](./screenshot.png)
-->

## Features

- Add subscriptions with a name, amount, and billing cycle (weekly / monthly / quarterly / yearly)
- Automatic cycle normalisation — every subscription is converted to an equivalent monthly cost so totals are comparable
- Live monthly spend total across all subscriptions
- Delete subscriptions
- All data persists in a PostgreSQL database

## Tech stack

- **Next.js 16** (App Router) with **React** and **TypeScript**
- **Tailwind CSS** for styling
- **PostgreSQL**, hosted on **Neon**
- **Prisma 7** (ORM) with the `@prisma/adapter-pg` driver adapter
- Deployed on **Vercel**

## Technical highlights

The parts worth a closer look:

- **Recurrence engine** (`lib/recurrence.ts`) — a pure, unit-testable function that converts any billing cycle into an equivalent monthly cost (e.g. weekly × 52 ÷ 12, yearly ÷ 12). This is the core logic the rest of the app is built around.
- **React Server Components** — the subscription list is fetched on the server, querying Postgres directly via Prisma. No client-side data fetching or loading states required.
- **Server Actions** (`app/actions.ts`) — create and delete are implemented as Next.js Server Actions, mutating the database straight from the UI without separate API route handlers, with `revalidatePath` to keep the view in sync.
- **End-to-end type safety** — a shared `Cycle` union type (`"weekly" | "monthly" | ...`) flows from the UI through the recurrence logic, and the Prisma client is fully typed against the database schema.

## Project structure

```
app/
  page.tsx        # homepage — Server Component that reads + renders subscriptions
  actions.ts      # Server Actions for create / delete
lib/
  recurrence.ts   # Cycle type + monthlyCost engine
  subscriptions.ts# typed seed data
  prisma.ts       # Prisma client (pg adapter + dev singleton)
prisma/
  schema.prisma   # Subscription model
  seed.ts         # seeds the database
  migrations/      # migration history
```

## Running locally

**Prerequisites:** Node.js 20.9+ and a PostgreSQL database (a free one on [Neon](https://neon.com) works well).

```bash
# 1. Clone and install
git clone https://github.com/harry-glen06/submanager.git
cd submanager
npm install

# 2. Add your database connection string
#    Create a .env file in the project root:
#    DATABASE_URL="postgresql://..."

# 3. Set up the database and generate the client
npx prisma migrate dev
npx prisma generate

# 4. (Optional) seed some example subscriptions
npx tsx prisma/seed.ts

# 5. Run it
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Roadmap

Planned improvements, roughly in priority order:

- **Postgres enum for billing cycle** — enforce the four valid cycle values at the database level so invalid data can't be stored (and drop the `as Cycle` assertions).
- **User accounts** — authentication so each user sees only their own subscriptions.
- **PWA with payment reminders** — installable app with push notifications for upcoming charges and free-trial-ending alerts.
- **Spend analytics** — breakdown by category and spend-over-time charts.

## Author

Harry Glen — [GitHub](https://github.com/harry-glen06)
