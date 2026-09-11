import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { generateOtp, storeOtp } from "@/lib/otp";
import { sendVerificationOtp } from "@/lib/email";

const resendSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),
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

    const result = resendSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
        },
        { status: 400 },
      );
    }

    const { email } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to resend verification code",
        },
        { status: 400 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already verified",
        },
        { status: 400 },
      );
    }

    const otp = generateOtp();

    await storeOtp(email, otp);

    await sendVerificationOtp(
      email,
      user.name,
      otp,
    );

    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to resend verification code",
      },
      { status: 500 },
    );
  }
}