import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { v4 as uuidv4 } from "uuid";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seeding...");

  // 1. Create Finance/Idea Categories
  const financeCategories = ["Hosting", "Software Subscriptions", "Hardware", "Marketing", "Consulting", "Freelance Income"];
  const ideaCategories = ["Product Feature", "Marketing Strategy", "Business Process"];
  
  const categories = [];
  for (const name of financeCategories) {
    categories.push(await prisma.category.create({ data: { name, type: "FINANCE" } }));
  }
  for (const name of ideaCategories) {
    categories.push(await prisma.category.create({ data: { name, type: "IDEA" } }));
  }
  console.log("Created Categories");

  console.log("Seeding finished successfully. (Demo data has been removed)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
