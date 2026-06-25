"use client";

import { useState } from "react";
import { updateSubscription, deleteSubscription } from "./actions";
import { monthlyCost, Cycle } from "@/lib/recurrence";

type Sub = { id: number; name: string; amount: number; cycle: string };
const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
const money = (n: number) => aud.format(n);
const cycleWord: Record<Cycle, string> = {
    weekly: "week",
    monthly: "month",
    quarterly: "quarter",
    yearly: "year",
};


export default function SubscriptionRow({ sub }: { sub: Sub }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    const field = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500";

    return (
      <li className="px-5 py-4">
        <form
          action={async (formData) => {
            await updateSubscription(sub.id, formData);
            setIsEditing(false);
          }}
        >
                <div className="flex flex-col gap-3 sm:flex-row">
                <input name="name" defaultValue={sub.name} required className={field} />
                <input name="amount" defaultValue={sub.amount} type="number" step="0.01" placeholder="Amount" required className={`${field} sm:w-32`} />
                <select name="cycle" defaultValue={sub.cycle} className={`${field} sm:w-40`}>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                    <option value="quarterly">quarterly</option>
                    <option value="yearly">yearly</option>
                </select>
                </div>
                <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 sm:w-auto dark:bg-emerald-600 dark:hover:bg-emerald-500">
                    Save
                </button>
                <button className="mt-4 ml-2 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100" 
                type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                </button>
        </form>
      </li>
    );
  }
    return (
        <li className="flex items-center gap-4 px-5 py-4">
        <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
            <span className="truncate font-medium">{sub.name}</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                {sub.cycle}
            </span>
            </div>
            <div className="mt-0.5 font-mono text-xs tabular-nums text-stone-400 dark:text-stone-500">
            {money(sub.amount)} / {cycleWord[sub.cycle as Cycle]}
            </div>
        </div>
        <div className="font-mono text-base font-semibold tabular-nums">
            {money(monthlyCost(sub.amount, sub.cycle as Cycle))}
            <span className="font-normal text-stone-400 dark:text-stone-500">/mo</span>
        </div>
        <button type="button" onClick={() => setIsEditing(true)} className="text-xs text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
            Edit
        </button>
        <form action={deleteSubscription.bind(null, sub.id)}>
            <button
            type="submit"
            aria-label={`Delete ${sub.name}`}
            className="text-xs text-stone-300 hover:text-red-500 dark:text-stone-600 dark:hover:text-red-400"
            >
            Delete
            </button>
        </form>
        </li>
    );
    }