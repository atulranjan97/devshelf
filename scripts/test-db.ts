import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const userCount = await prisma.user.count();
  const itemTypeCount = await prisma.itemType.count();
  console.log("Connected to database.");
  console.log(`Users: ${userCount}`);
  console.log(`Item types: ${itemTypeCount}`);

  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    include: {
      collections: {
        orderBy: { name: "asc" },
        include: {
          defaultType: true,
          items: {
            include: { item: { include: { itemType: true } } },
            orderBy: { addedAt: "asc" },
          },
        },
      },
    },
  });

  if (!demoUser) {
    console.log("\nDemo user not found — run `npx prisma db seed` first.");
    return;
  }

  console.log(`\nDemo user: ${demoUser.name} <${demoUser.email}> (isPro: ${demoUser.isPro})`);

  for (const collection of demoUser.collections) {
    console.log(`\n${collection.name} — ${collection.description ?? "no description"}`);
    console.log(`  default type: ${collection.defaultType?.name ?? "none"}`);
    for (const { item } of collection.items) {
      console.log(`  [${item.itemType.name}] ${item.title}`);
    }
  }
}

main()
  .catch((error) => {
    console.error("Database connection test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });