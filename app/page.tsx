import { Cycle, monthlyCost } from "@/lib/recurrence";
import { prisma } from "@/lib/prisma";
import { deleteSubscription, createSubscription } from "./actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";
import ThemeToggle from "./theme-toggle";
import SubscriptionRow from "./subscription-row";

export const dynamic = "force-dynamic";

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
const money = (n: number) => aud.format(n);

const cycleWord: Record<Cycle, string> = {
  weekly: "week",
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

  const totalMonthly = subscriptions.reduce(
    (acc, current) => acc + monthlyCost(current.amount, current.cycle as Cycle),
    0
  );
  const totalAnnual = totalMonthly * 12;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-2xl px-6 py-10">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-sm bg-emerald-700" />
            <span className="font-semibold tracking-tight">SubManager</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
            <ThemeToggle />
            <span>Signed in as {session.user.name}</span>
            <span className="text-stone-300 dark:text-stone-600">·</span>
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
            {subscriptions.map((sub) => (
              <SubscriptionRow key={sub.id} sub={sub} />
            ))}
          </ul>
        )}

        <h2 className="mt-12 mb-3 text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Add a subscription
        </h2>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <form action={createSubscription}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input name="name" placeholder="Name" required className={field} />
              <input name="amount" type="number" step="0.01" placeholder="Amount" required className={`${field} sm:w-32`} />
              <input name="billingDate" type="date" required className={field} />
              <select name="cycle" className={`${field} sm:w-40`}>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
                <option value="quarterly">quarterly</option>
                <option value="yearly">yearly</option>
              </select>
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