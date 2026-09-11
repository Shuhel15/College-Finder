import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getOtp, deleteOtp } from "@/lib/otp";

const verifySchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),

  otp: z
    .string()
    .regex(/^\d{6}$/, "Invalid OTP"),
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

    const result = verifySchema.safeParse(body);

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
      email,
      otp,
    } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification request",
        },
        { status: 400 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified",
      });
    }

    const storedOtp = await getOtp(email);

    if (!storedOtp) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please request a new code.",
        },
        { status: 400 },
      );
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await deleteOtp(email);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify email",
      },
      { status: 500 },
    );
  }
}