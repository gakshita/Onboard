import { createUserSchema, loginUserSchema } from "prisma/user-schema";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  loginHandler,
  registerHandler,
  verifyOTPHandler,
} from "../controllers/auth-controller";
import {
  addUserCategory,
  getUserCategory,
} from "../controllers/category-controller";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(createUserSchema)
    .mutation(({ input }) => registerHandler({ input })),
  verify: publicProcedure
    .input(z.object({ email: z.string(), otp: z.string() }))
    .mutation(({ input }) => verifyOTPHandler({ input })),
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(({ input }) => loginHandler({ input })),
  addCategory: publicProcedure
    .input(z.object({ userId: z.string(), categoryId: z.string() }))
    .mutation(({ input }) => addUserCategory({ input })),
});
