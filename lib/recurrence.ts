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