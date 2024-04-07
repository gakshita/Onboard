import { z } from "zod";
import { faker } from "@faker-js/faker";
import { prisma } from "prisma/prisma";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getUserCategory } from "../controllers/category-controller";

export const categoryRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure.mutation(async () => {
    // simulate a slow db call
    let products = [];
    for (let i = 0; i < 10; i++) {
      const product = faker.commerce.productName();
      products.push({
        name: product,
      });
    }
    const createMany = await prisma.category.createMany({
      data: products,
      skipDuplicates: true, // Skip 'Bobo'
    });
    return {
      status: "success",
    };
  }),

  all: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        skip: z.number().optional(),
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
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
      } catch (error) {
        throw error;
      }
    }),
  userCategories: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => getUserCategory({ input })),
});
