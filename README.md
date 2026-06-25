# SubManager

A full-stack web app for tracking recurring subscriptions and bills. It normalises every billing cycle to a common monthly cost — so a $120/year service and a $10/month service are compared honestly — and shows your true monthly spend across everything you pay for.

**Live demo:** https://submanager-lyart.vercel.app

<!-- Add a screenshot for the recruiter who reads this first:
     drop an image in the repo (e.g. screenshot.png) and uncomment the line below.
![SubManager](./screenshot.png)
-->

## Features

- Sign up and log in — each user sees and manages only their own subscriptions
- Add subscriptions with a name, amount, and billing cycle (weekly / monthly / quarterly / yearly)
- Automatic cycle normalisation — every subscription is converted to an equivalent monthly cost so totals are comparable
- Live monthly spend total, plus an annual projection
- Delete subscriptions
- Light and dark mode with a toggle, remembered across visits
- All data persists in a PostgreSQL database

## Tech stack

- **Next.js 16** (App Router) with **React** and **TypeScript**
- **Tailwind CSS v4** for styling, with **next-themes** for theme switching
- **Better Auth** for authentication (email + password)
- **PostgreSQL**, hosted on **Neon**
- **Prisma 7** (ORM) with the \`@prisma/adapter-pg\` driver adapter
- Deployed on **Vercel**

## Technical highlights

The parts worth a closer look:

- **Recurrence engine** (\`lib/recurrence.ts\`) — a pure, unit-testable function that converts any billing cycle into an equivalent monthly cost (e.g. weekly × 52 ÷ 12, yearly ÷ 12). This is the core logic the rest of the app is built around.
- **React Server Components** — the subscription list is fetched on the server, querying Postgres directly via Prisma. No client-side data fetching or loading states required.
- **Server Actions** (\`app/actions.ts\`) — create and delete are implemented as Next.js Server Actions, mutating the database straight from the UI without separate API route handlers, with \`revalidatePath\` to keep the view in sync.
- **Authorisation scoped to the user** — every query and mutation is filtered by the authenticated user's ID, and the session is verified in the server code that touches the data (not just in middleware). This prevents IDOR (insecure direct object reference), where a user could otherwise read or delete another user's records by guessing an ID.
- **End-to-end type safety** — a shared \`Cycle\` union type (\`"weekly" | "monthly" | ...\`) flows from the UI through the recurrence logic, and the Prisma client is fully typed against the database schema.

## Project structure

\`\`\`
app/
  page.tsx          # homepage — Server Component that reads + renders the user's subscriptions
  actions.ts        # Server Actions for create / delete
  sign-in/          # sign-in page
  sign-up/          # sign-up page
  api/auth/         # Better Auth route handler
lib/
  recurrence.ts     # Cycle type + monthlyCost engine
  prisma.ts         # Prisma client (pg adapter + dev singleton)
  auth.ts           # Better Auth server config
  auth-client.ts    # Better Auth client config
prisma/
  schema.prisma     # Subscription + auth models
  migrations/        # migration history
\`\`\`

## Running locally

**Prerequisites:** Node.js 20.9+ and a PostgreSQL database (a free one on [Neon](https://neon.com) works well).

\`\`\`bash
# 1. Clone and install
git clone https://github.com/harry-glen06/submanager.git
cd submanager
npm install

# 2. Create a .env file in the project root with:
#    DATABASE_URL=DATABASE_URL="postgresql://" # your Neon connection string
#    BETTER_AUTH_SECRET= # generate with: openssl rand -base         
#    BETTER_AUTH_URL="http://localhost:3000"

# 3. Set up the database and generate the client
npx prisma migrate dev
npx prisma generate

# 4. Run it
npm run dev
\`\`\`

Then open [http://localhost:3000](http://localhost:3000), and create an account to get started.

## Roadmap

Planned improvements, roughly in priority order:

- **Postgres enum for billing cycle** — enforce the four valid cycle values at the database level so invalid data can't be stored (and drop the \`as Cycle\` assertions).
- **PWA with payment reminders** — installable app with push notifications for upcoming charges and free-trial-ending alerts.
- **Spend analytics** — breakdown by category and spend-over-time charts.

## Author

Harry Glen — [GitHub](https://github.com/harry-glen06)
