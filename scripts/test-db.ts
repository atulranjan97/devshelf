import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const userCount = await prisma.user.count();
  const itemTypeCount = await prisma.itemType.count();
  console.log("Connected to database.");
  console.log(`Users: ${userCount}`);
  console.log(`Item types: ${itemTypeCount}`);
}

main()
  .catch((error) => {
    console.error("Database connection test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });