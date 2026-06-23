"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Cycle } from "@/lib/recurrence";

export async function deleteSubscription(id: number) {
  await prisma.subscription.delete({
    where: { id },
  });

  revalidatePath("/");
}

export async function createSubscription(formData: FormData) {
  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const cycle = formData.get("cycle") as Cycle;

  await prisma.subscription.create({
    data: { name, amount, cycle },
  });

  revalidatePath("/");
}