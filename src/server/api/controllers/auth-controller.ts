import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";
import {
  CreateUserInput,
  LoginUserInput,
  VerifyUserSchema,
} from "prisma/user-schema";
import { generateOTP } from "../utils.ts/otp_generator";
import { sendEmail } from "../utils.ts/nodemailer";

export const registerHandler = async ({
  input,
}: {
  input: CreateUserInput;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(input.password, 12);

    const otp_code = generateOTP();

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        otp: otp_code,
        password: hashedPassword,
      },
    });
    const { password, otp, ...protectedUser } = user;

    const subject = "Email Verification";
    const message = `Your OTP code is: ${otp_code}`;

    sendEmail(input.email, subject, message);

    return {
      status: "success",
      data: {
        user: protectedUser,
      },
    };
  } catch (err: any) {
    if (err.code && err.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already exists",
      });
    }
    throw err;
  }
};

export const verifyOTPHandler = async ({
  input,
}: {
  input: VerifyUserSchema;
}) => {
  // try {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || user.otp !== input.otp) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid OTP",
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: null,
      isVerified: true,
    },
  });

  return {
    status: "success",
  };
  // } catch (err: any) {
  //   throw err;
  // }
};

export const loginHandler = async ({ input }: { input: LoginUserInput }) => {
  // try {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { categories: true },
  });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid email or password",
    });
  }

  if (!user.isVerified) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email not verified",
    });
  }

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ sub: user.id }, secret, {
    expiresIn: 60 * 60,
  });

  const { password, otp, ...protectedUser } = user;

  return {
    status: "success",
    token,
    data: {
      user: protectedUser,
    },
  };
  // } catch (err: any) {
  //   throw err;
  // }
};
