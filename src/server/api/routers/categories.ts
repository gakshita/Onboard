import { z } from "zod";
import { faker } from "@faker-js/faker";
import { prisma } from "prisma/prisma";
// import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getUserCategory } from "../controllers/category-controller";
import { getCategorySchema } from "prisma/user-schema";

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
    const products = [];
    for (let i = 0; i < 10; i++) {
      const product = faker.commerce.productName();
      products.push({
        name: product,
      });
    }
    await prisma.category.createMany({
      data: products,
      skipDuplicates: true, // Skip 'Bobo'
    });
    return {
      status: "success",
    };
  }),

  all: publicProcedure
    .input(getCategorySchema)
    .query(({ input }) => getUserCategory({ input })),
});
