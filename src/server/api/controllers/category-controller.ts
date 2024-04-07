import { prisma } from "prisma/prisma";
import { TRPCError } from "@trpc/server";

export const addUserCategory = async ({
  input,
}: {
  input: { userId: string; categoryId: string };
}) => {
  try {
    // Check if the user and category exist
    const user = await prisma.user.findUnique({
      where: { id: parseInt(input.userId) },
    });
    const category = await prisma.category.findUnique({
      where: { id: parseInt(input.categoryId) },
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found",
      });
    }

    if (!category) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Category not found",
      });
    }

    // Add the category to the user's categories list
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(input.userId) },
      data: { categories: { connect: { id: parseInt(input.categoryId) } } },
    });

    return { status: "success" };
  } catch (err: any) {
    throw err;
  }
};

export const getUserCategory = async ({
  input,
}: {
  input: { userId: string };
}) => {
  try {
    // Fetch all categories
    const allCategories = await prisma.category.findMany();

    // Fetch the user to check their associated categories
    const userCategories = await prisma.user.findUnique({
      where: { id: parseInt(input.userId) },
      include: { categories: true },
    });

    if (!userCategories) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found",
      });
    }

    // Create a map to track category presence
    const categoryPresenceMap = new Map(
      allCategories.map((category) => [category.id, false]),
    );

    // Update presence status for categories associated with the user
    userCategories.categories.forEach((category) => {
      categoryPresenceMap.set(category.id, true);
    });

    // Convert the map to an array of objects with true/false values
    const categoriesPresence = allCategories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      isPresent: categoryPresenceMap.get(category.id),
    }));

    return { status: "success", data: categoriesPresence };
  } catch (err: any) {
    throw err;
  }
};
