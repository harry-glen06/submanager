import { Cycle } from "./recurrence";

export interface Subscription {
  name: string;
  amount: number;
  cycle: Cycle;
}

export const subscriptions: Subscription[] = [
  { name: "Netflix", amount: 18.99, cycle: "monthly" },
  { name: "Spotify", amount: 133.99, cycle: "yearly" },
  { name: "Gym",     amount: 22.0,  cycle: "weekly" },
];