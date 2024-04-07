import { prisma } from "prisma/prisma";
import { TRPCError } from "@trpc/server";
import { AddCategoryInput, GetCategorySchema } from "prisma/user-schema";

export const addUserCategory = async ({
  input,
}: {
  input: AddCategoryInput;
}) => {
  // try {
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
  await prisma.user.update({
    where: { id: parseInt(input.userId) },
    data: { categories: { connect: { id: parseInt(input.categoryId) } } },
  });

  return { status: "success" };
  // } catch (err: any) {
  //   throw err;
  // }
};

export const getUserCategory = async ({
  input,
}: {
  input: GetCategorySchema;
}) => {
  // try {
  const allCategories = await prisma.category.findMany({
    skip: input.skip,
    take: input.limit,
  });

  const totalCount = await prisma.category.count();
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
    id: category.id,
    name: category.name,
    isInterested: categoryPresenceMap.get(category.id),
  }));

  return {
    data: categoriesPresence,
    status: "success",
    totalCount,
    totalPages: Math.ceil(totalCount / input.limit) - 1,
  };
  // } catch (error) {
  //   throw error;
  // }
};
