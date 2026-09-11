import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const answerSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "Answer must be at least 2 characters")
    .max(5000, "Answer cannot exceed 5000 characters"),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to answer" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = answerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          issues: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        content: result.data.content,
        userId: session.user.id,
        questionId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    );
  }
}