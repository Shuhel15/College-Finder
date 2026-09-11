import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        college: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: savedColleges,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch saved colleges",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

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

    if (
      typeof body !== "object" ||
      body === null ||
      !("collegeId" in body) ||
      typeof body.collegeId !== "string" ||
      !body.collegeId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
        },
        { status: 400 },
      );
    }

    const collegeId = body.collegeId.trim();

    const college = await prisma.college.findUnique({
      where: {
        id: collegeId,
      },
      select: {
        id: true,
      },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found",
        },
        { status: 404 },
      );
    }

    const existingSaved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (existingSaved) {
      return NextResponse.json(
        {
          success: false,
          message: "College is already saved",
        },
        { status: 409 },
      );
    }

    await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "College saved successfully",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to save college",
      },
      { status: 500 },
    );
  }
}