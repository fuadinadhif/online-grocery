import { hash, genSalt } from "bcryptjs";

import { prisma } from "../src/configs/prisma.js";

async function main() {
  try {
    /* -------------------------------------------------------------------------- */
    /*                                 Reset Data                                 */
    /* -------------------------------------------------------------------------- */
    await prisma.user.deleteMany();

    /* -------------------------------------------------------------------------- */
    /*                                  User Seed                                 */
    /* -------------------------------------------------------------------------- */
    const salt = await genSalt(10);
    const hashedPassword = await hash("newpass", salt);

    await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@mail.com",
        password: hashedPassword,
        profileImage:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    });

    await prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@mail.com",
        password: hashedPassword,
        profileImage:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    });

    console.info(`Seeding successfully 🌱`);
  } catch (error) {
    console.error(`Seeding error: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
