import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    collegeId: string;
  }>;
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
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

    const { collegeId } = await context.params;

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid college",
        },
        { status: 400 },
      );
    }

    const savedCollege = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (!savedCollege) {
      return NextResponse.json(
        {
          success: false,
          message: "College is not saved",
        },
        { status: 404 },
      );
    }

    await prisma.savedCollege.delete({
      where: {
        id: savedCollege.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "College removed successfully",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to remove college",
      },
      { status: 500 },
    );
  }
}