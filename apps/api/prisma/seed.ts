import { hash, genSalt } from "bcryptjs";

import { prisma } from "../src/configs/prisma.js";
import { Category } from "@prisma/client";

async function main() {
  try {
    /* -------------------------------------------------------------------------- */
    /*                                 Reset Data                                 */
    /* -------------------------------------------------------------------------- */
    await prisma.inventoryJournal.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productInventory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.image.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.store.deleteMany();
    await prisma.token.deleteMany();
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
        provider: "CREDENTIALS",
        referralCode: "ABC-1234",
        isVerified: true,
        Cart: { create: { totalPrice: 0 } },
      },
    });

    await prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@mail.com",
        password: hashedPassword,
        profileImage:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        provider: "CREDENTIALS",
        referralCode: "EFG-5678",
        isVerified: true,
        Cart: { create: { totalPrice: 0 } },
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                Category Seed                               */
    /* -------------------------------------------------------------------------- */
    const categoriesData = [
      { name: "Electronics", description: "Electronic gadgets and devices" },
      {
        name: "Home Appliances",
        description: "Essential appliances for home use",
      },
      { name: "Fashion", description: "Clothing and accessories" },
      { name: "Books", description: "Wide range of books and literature" },
      { name: "Toys", description: "Fun and educational toys for children" },
      { name: "Sports", description: "Sports equipment and accessories" },
      { name: "Health & Beauty", description: "Health and beauty products" },
      { name: "Groceries", description: "Daily essentials and food items" },
      { name: "Automotive", description: "Vehicle parts and accessories" },
      { name: "Furniture", description: "Comfortable and stylish furniture" },
    ];

    const categories: Category[] = [];
    for (const category of categoriesData) {
      const newCategory = await prisma.category.create({ data: category });
      categories.push(newCategory);
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Image Seed                                 */
    /* -------------------------------------------------------------------------- */
    const imagesArray = [
      [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2118&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1612442058361-178007e5e498?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      [
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      [
        "https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?q=80&w=2155&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1622818426197-d54f85b88690?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=2105&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/flagged/photo-1578972454730-7dd68a7063a9?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      [
        "https://images.unsplash.com/photo-1562183241-840b8af0721e?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1597892657493-6847b9640bac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1617625802912-cde586faf331?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1619037961428-e6410a7afd38?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1619037961390-f2047d89bc55?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1542541864-4abf21a55761?q=80&w=2006&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    ];

    const images = await Promise.all(
      imagesArray.map((images) =>
        Promise.all(
          images.map(
            async (image) =>
              await prisma.image.create({ data: { imageUrl: image } })
          )
        )
      )
    );

    /* -------------------------------------------------------------------------- */
    /*                                Product Seed                                */
    /* -------------------------------------------------------------------------- */
    const productsData = [
      {
        name: "Smartphone X",
        description: "A high-end smartphone with advanced features.",
        price: 2_500_000,
        weight: 0.5,
        categories: [
          { category: categories[0] },
          { category: categories[1] },
          { category: categories[4] },
        ],
      },
      {
        name: "Laptop Pro",
        description: "A powerful laptop for professionals.",
        price: 15_000_000,
        weight: 2.5,
        categories: [
          { category: categories[0] },
          { category: categories[1] },
          { category: categories[4] },
        ],
      },
      {
        name: "Blender 3000",
        description: "A high-speed kitchen blender.",
        price: 300_000,
        weight: 1.8,
        categories: [
          { category: categories[1] },
          { category: categories[6] },
          { category: categories[7] },
        ],
      },
      {
        name: "Running Shoes",
        description: "Lightweight and comfortable running shoes.",
        price: 1_000_000,
        weight: 0.8,
        categories: [
          { category: categories[0] },
          { category: categories[1] },
          { category: categories[4] },
        ],
      },
      {
        name: "Smartwatch Z",
        description: "A feature-packed smartwatch with health tracking.",
        price: 2_500_000,
        weight: 0.3,
        categories: [
          { category: categories[2] },
          { category: categories[5] },
          { category: categories[6] },
        ],
      },
    ];

    await Promise.all(
      productsData.map(
        async (product, index) =>
          await prisma.product.create({
            data: {
              name: product.name,
              description: product.description,
              price: product.price,
              weight: product.weight,
              ProductImage: {
                create: images[index].map((image) => ({ imageId: image.id })),
              },
              ProductCategory: {
                create: product.categories.map((category) => ({
                  categoryId: category.category.id,
                })),
              },
            },
          })
      )
    );

    console.info(`Seeding successfully 🌱`);
  } catch (error) {
    console.error(`Seeding error: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
