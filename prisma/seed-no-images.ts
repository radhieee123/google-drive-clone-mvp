// prisma/seed-no-images.ts
// Alternative seed without external image URLs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo users (without image URLs)
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: "password", // In production, hash this!
      image: null, // No external image
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: "password",
      image: null, // No external image
    },
  });

  console.log("✅ Created users:", {
    demo: demoUser.email,
    test: testUser.email,
  });

  // Create sample folder for demo user
  const documentsFolder = await prisma.folder.create({
    data: {
      folderName: "Documents",
      userId: demoUser.id,
    },
  });

  const imagesFolder = await prisma.folder.create({
    data: {
      folderName: "Images",
      userId: demoUser.id,
    },
  });

  console.log("✅ Created sample folders");

  // Create sample files
  const sampleFile1 = await prisma.file.create({
    data: {
      fileName: "Welcome.txt",
      fileLink: "/uploads/welcome.txt",
      fileExtension: "txt",
      fileSize: 1024,
      userId: demoUser.id,
      folderId: documentsFolder.id,
    },
  });

  const sampleFile2 = await prisma.file.create({
    data: {
      fileName: "Sample.pdf",
      fileLink: "/uploads/sample.pdf",
      fileExtension: "pdf",
      fileSize: 2048,
      userId: demoUser.id,
      folderId: documentsFolder.id,
      isStarred: true,
    },
  });

  console.log("✅ Created sample files");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
