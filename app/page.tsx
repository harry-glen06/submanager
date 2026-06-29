import { Cycle, monthlyCost } from "@/lib/recurrence";
import { prisma } from "@/lib/prisma";
import { deleteSubscription, createSubscription } from "./actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";
import ThemeToggle from "./theme-toggle";
import SubscriptionRow from "./subscription-row";
import { nextOccurrence } from "@/lib/recurrence";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const dynamic = "force-dynamic";

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
const money = (n: number) => aud.format(n);

const cycleWord: Record<Cycle, string> = {
  weekly: "week",
  fortnightly: "fortnightly",
  monthly: "month",
  quarterly: "quarter",
  yearly: "year",
};

const field =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
  });

  const sorted = [...subscriptions].sort((a, b) => {
    const dateA = nextOccurrence(new Date(a.nextBillingDate), a.cycle as Cycle);
    const dateB = nextOccurrence(new Date(b.nextBillingDate), b.cycle as Cycle);
    const dateDiff = dateA.getTime() - dateB.getTime();
    if (dateDiff !== 0) return dateDiff;                                                              // dates differ → date decides
    return (monthlyCost(b.amount, b.cycle as Cycle) - monthlyCost(a.amount, a.cycle as Cycle));       // dates tie → price breaks it
  });

  const totalMonthly = subscriptions.reduce(
    (acc, current) => acc + monthlyCost(current.amount, current.cycle as Cycle),
    0
  );
  const totalAnnual = totalMonthly * 12;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-2xl px-6 pt-10 pb-28">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-sm bg-emerald-700" />
            <span className="font-semibold tracking-tight">SubManager</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
            <ThemeToggle />
            <span className="hidden sm:inline" >Signed in as {session.user.name}</span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-600">·</span>
            <SignOutButton />
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Your monthly spend
          </p>
          <p className="mt-3 font-mono text-6xl font-semibold tabular-nums tracking-tight">
            {money(totalMonthly)}
          </p>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
            That's <span className="font-mono tabular-nums text-stone-700 dark:text-stone-300">{money(totalAnnual)}</span> a
            year across {subscriptions.length} subscription{subscriptions.length !== 1 ? "s" : ""}.
          </p>
        </div>

        <h2 className="mt-12 mb-3 text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Subscriptions
        </h2>
        {subscriptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
            No subscriptions yet. Add your first one below.
          </div>
        ) : (
          <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
            {sorted.map((sub) => (
              <SubscriptionRow key={sub.id} sub={sub} />
            ))}
          </ul>
        )}

        <h2 className="mt-12 mb-3 text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Add a subscription
        </h2>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <form action={createSubscription}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
              <div className="sm:col-span-2">
                <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">Name</label>
                <input name="name" placeholder="Name" required className={field}/>
              </div>
              <div>
                <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">Amount</label>
                <input name="amount" type="number" step="0.01" placeholder="$0.00" required className={field} />
              </div>
              <div>
                <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">Billing Date</label>
                <input name="billingDate" type="date" required className={`${field} min-w-0 max-w-full appearance-none`} />
              </div>
              <div>
                <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">Cycle</label>
                <select name="cycle" className={field}>
                  <option value="weekly">weekly</option>
                  <option value="fortnightly">fortnightly</option>
                  <option value="monthly">monthly</option>
                  <option value="quarterly">quarterly</option>
                  <option value="yearly">yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">Category</label>
                  <select name="category" className={field}>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Productivity & Software">Productivity & Software</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Education">Education</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 sm:w-auto dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Add subscription
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}