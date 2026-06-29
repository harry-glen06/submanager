import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "../sign-out-button";
import ThemeToggle from "../theme-toggle";
import { prisma } from "@/lib/prisma";
import { Cycle, monthlyCost } from "@/lib/recurrence";
import CategoryChart from "../category-chart";
import { nextOccurrence } from "@/lib/recurrence";



export default async function AnalyticsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/sign-in");

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: session.user.id },
    });

    const byCategory = subscriptions.reduce((acc, sub) => {
        const cost = monthlyCost(sub.amount, sub.cycle as Cycle);
        acc[sub.category] = (acc[sub.category] || 0) + cost
        return acc
    }, {} as Record<string, number>);

    const chartData = Object.entries(byCategory).map((pair) => {
            return { name: pair[0], value: pair[1] };
    })


    const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
    const money = (n: number) => aud.format(n);

    const totalMonthly = subscriptions.reduce(
    (acc, current) => acc + monthlyCost(current.amount, current.cycle as Cycle), 0);

    const sorted = [...subscriptions].sort((a, b) => {
        const dateA = nextOccurrence(new Date(a.nextBillingDate), a.cycle as Cycle);
        const dateB = nextOccurrence(new Date(b.nextBillingDate), b.cycle as Cycle);
        const dateDiff = dateA.getTime() - dateB.getTime();
        if (dateDiff !== 0) return dateDiff;                                                              // dates differ → date decides
        return (monthlyCost(b.amount, b.cycle as Cycle) - monthlyCost(a.amount, a.cycle as Cycle));       // dates tie → price breaks it
    });

    
    
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
                </div>
                <p className="mt-12 mb-3 text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500">
                    Spend by category
                </p>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                    <CategoryChart data={chartData} />
                </div>
            </div>
        </main>
    );
}