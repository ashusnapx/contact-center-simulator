import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const email = "admin@vaaniverse.ai";
  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existing) {
    console.log(`User ${email} already exists, skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  await db.insert(users).values({
    name: "Admin",
    email,
    passwordHash,
  });

  console.log(`Created user: ${email} / admin123`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
