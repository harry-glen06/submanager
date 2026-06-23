import "dotenv/config";
import { prisma } from "../lib/prisma";
import { subscriptions } from "../lib/subscriptions";

async function main() {
  // wipe first so re-running doesn't pile up duplicates
  await prisma.subscription.deleteMany();

  for (const sub of subscriptions) {
    await prisma.subscription.create({
      data: { name: sub.name, amount: sub.amount, cycle: sub.cycle },
    });
  }

  console.log(`Seeded ${subscriptions.length} subscriptions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());