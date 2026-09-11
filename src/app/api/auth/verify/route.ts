import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getOtp, deleteOtp } from "@/lib/otp";
import { checkRateLimit } from "@/lib/redis";

const verifySchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
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
          message: "Invalid JSON body",
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

    const { email, otp } = result.data;

    const rateLimit = await checkRateLimit(
      "verify-otp",
      email,
      5,
      10 * 60,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many verification attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
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
      return NextResponse.json(
        {
          success: true,
          message: "Email is already verified",
        },
        { status: 200 },
      );
    }

    const storedOtp = await getOtp(email);

    if (!storedOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please request a new code.",
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
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}