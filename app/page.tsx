import { Cycle } from "@/lib/recurrence";
import { monthlyCost } from "@/lib/recurrence";
import { prisma } from "@/lib/prisma";
import { deleteSubscription, createSubscription } from "./actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
  });

  const totalMonthly = subscriptions.reduce((acc, current) => acc + monthlyCost(current.amount, current.cycle as Cycle), 0);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">Signed in as {session.user.name}</span>
        <SignOutButton/>
      </div>
      <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub.id} className="flex items-center gap-3 mb-1">
            <span>
              {sub.name} - ${sub.amount} ({sub.cycle}) → ${monthlyCost(sub.amount, sub.cycle as Cycle).toFixed(2)}/mo
            </span>
            <form action={deleteSubscription.bind(null, sub.id)}>
              <button type="submit" className="text-red-500 hover:text-red-700 text-sm">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-bold">Monthly total: ${totalMonthly.toFixed(2)}</p>
      <form action={createSubscription} className="mt-6 flex flex-col gap-2 max-w-xs">
      <h2 className="font-bold">Add a subscription</h2>
      <input name="name" placeholder="Name" required className="border p-2 rounded" />
      <input name="amount" type="number" step="0.01" placeholder="Amount" required className="border p-2 rounded" />
      <select name="cycle" className="border p-2 rounded">
        <option value="weekly">weekly</option>
        <option value="monthly">monthly</option>
        <option value="quarterly">quarterly</option>
        <option value="yearly">yearly</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add
      </button>
    </form>
    </main>
  );
}