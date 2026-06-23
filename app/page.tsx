import { subscriptions } from "@/lib/subscriptions"
import { Cycle } from "@/lib/recurrence";
import { monthlyCost } from "@/lib/recurrence";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function Home() {
  const subscriptions = await prisma.subscription.findMany();

  const totalMonthly = subscriptions.reduce((acc, current) => acc + monthlyCost(current.amount, current.cycle as Cycle), 0);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub.name}>
            {sub.name} - ${sub.amount} ({sub.cycle}) → ${monthlyCost(sub.amount, sub.cycle as Cycle).toFixed(2)}/mo
          </li>
        ))}
      </ul>
      <p className="mt-4 font-bold">Monthly total: ${totalMonthly.toFixed(2)}</p>
    </main>
  );
}