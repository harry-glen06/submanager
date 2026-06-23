"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Cycle } from "@/lib/recurrence";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteSubscription(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  await prisma.subscription.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/");
}

export async function createSubscription(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const cycle = formData.get("cycle") as Cycle;

  await prisma.subscription.create({
    data: { name, amount, cycle, userId: session.user.id },
  });

  revalidatePath("/");
}