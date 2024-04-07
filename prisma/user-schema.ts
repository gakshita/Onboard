import { number, object, string, TypeOf } from "zod";

export const createUserSchema = object({
  name: string({ required_error: "Name is required" }).min(
    1,
    "Name is required",
  ),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const loginUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email or password"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required",
  ),
});

export const verifyUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  otp: string({ required_error: "OTP is required" }),
});
export const addCategorySchema = object({
  userId: string({ required_error: "User ID is required" }),
  categoryId: string({ required_error: "Category ID is required" }),
});
export const getCategorySchema = object({
  userId: string({ required_error: "User ID is required" }),
  limit: number({ required_error: "Limit is required" }),
  skip: number({ required_error: "Skip is required" }),
});
export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type VerifyUserSchema = TypeOf<typeof verifyUserSchema>;
export type AddCategoryInput = TypeOf<typeof addCategorySchema>;
export type GetCategorySchema = TypeOf<typeof getCategorySchema>;
