import {
  addCategorySchema,
  createUserSchema,
  loginUserSchema,
  verifyUserSchema,
} from "prisma/user-schema";
// import { z } from "zod";
// import { object, string, TypeOf } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  loginHandler,
  registerHandler,
  verifyOTPHandler,
} from "../controllers/auth-controller";
import { addUserCategory } from "../controllers/category-controller";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(createUserSchema)
    .mutation(({ input }) => registerHandler({ input })),
  verify: publicProcedure
    .input(verifyUserSchema)
    .mutation(({ input }) => verifyOTPHandler({ input })),
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(({ input }) => loginHandler({ input })),
  addCategory: privateProcedure
    .input(addCategorySchema)
    .mutation(({ input }) => addUserCategory({ input })),
});
