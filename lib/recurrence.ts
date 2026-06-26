export type Cycle = "weekly" | "monthly" | "quarterly" | "yearly";

export function monthlyCost(amount: number, cycle: Cycle): number {
    if (cycle === "weekly") {
        // weekly amount converted to monthly
        const calcAmount = (amount * 52) / 12;
        return calcAmount;
    } else if (cycle === "monthly") {
        return amount;
    } else if (cycle === "quarterly") {
        // quarterly amount converted to monthly
        const calcAmount = amount / 3;
        return calcAmount;
    } else if (cycle === "yearly") {
        // yearly amount converted to monthly
        const calcAmount = amount / 12;
        return calcAmount;
    } else  {
        throw new Error(`Unsupported cycle type: ${cycle}`);
    }
}

export function daysUntil(date: Date): number {
  const now = new Date();
  const ms = date.getTime() - now.getTime();   // gap in milliseconds
  const days = ms / (1000 * 60 * 60 * 24);     // ÷ ms-per-day  (divide!)
  return Math.ceil(days);                       // round up, and return it
}

export function nextOccurrence(date: Date, cycle: Cycle): Date {
    const d = new Date(date);   // copy, never mutate the original
    const now = new Date();

    while (d < now) {
        if (cycle === 'weekly') {
            d.setDate(d.getDate() + 7)
        } else if (cycle === 'monthly'){
            d.setMonth(d.getMonth() + 1)
        } else if (cycle === 'quarterly') {
            d.setMonth(d.getMonth() + 3)
        } else if (cycle == 'yearly') {
            d.setFullYear(d.getFullYear() + 1)
        }
    }

    return d;
}