import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { generateOtp, storeOtp } from "@/lib/otp";
import { sendVerificationOtp } from "@/lib/email";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
        },
        { status: 400 },
      );
    }

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
        },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      password,
    } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        emailVerified: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const otp = generateOtp();

    await storeOtp(user.email, otp);

    try {
      await sendVerificationOtp(
        user.email,
        user.name,
        otp,
      );
    } catch {
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send verification code. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful. Please verify your email.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete registration",
      },
      { status: 500 },
    );
  }
}