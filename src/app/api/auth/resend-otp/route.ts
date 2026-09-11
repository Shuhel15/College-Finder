import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOtp, storeOtp } from "@/lib/otp";
import { sendVerificationOtp } from "@/lib/email";
import { checkRateLimit } from "@/lib/redis";

const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
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


    const result = resendOtpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 },
      );
    }

    const { email } = result.data;

    //Rate limiting
    const rateLimit = await checkRateLimit(
      "resend-otp",
      email,
      3,
      15 * 60,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many OTP requests. Please try again later.",
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
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email",
        },
        { status: 404 },
      );
    }

    //No OTP resend for already verified accounts
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

    // Store new OTP in Redis.
    const stored = await storeOtp(email, otp);

    if (!stored) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to generate verification code. Please try again.",
        },
        { status: 503 },
      );
    }

    try {
      await sendVerificationOtp(
        user.email,
        user.name,
        otp,
      );
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send verification code. Please try again.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "A new verification code has been sent.",
      },
      { status: 200 },
    );
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

