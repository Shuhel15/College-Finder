import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  getCache,
  invalidateQuestionsCache,
  setCache,
} from "@/lib/redis";

const questionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title cannot exceed 150 characters"),

  content: z
    .string()
    .trim()
    .min(10, "Question must be at least 10 characters")
    .max(5000, "Question cannot exceed 5000 characters"),
});

const QUESTIONS_CACHE_KEY = "questions:all";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              title: {
                contains: search,
              },
            },
            {
              content: {
                contains: search,
              },
            },
          ],
        }
      : {};

    const cacheKey = `${QUESTIONS_CACHE_KEY}:${search}:${page}:${limit}`;

    const cached = await getCache<typeof response>(cacheKey);

    if (cached) {
      return NextResponse.json(cached);
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              answers: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.question.count({ where }),
    ]);

    const response = {
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, 60);

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to ask a question" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
  where: {
    id: session.user.id,
  },
  select: {
    id: true,
  },
});

if (!user) {
  return NextResponse.json(
    {
      error: "Your session is invalid. Please log out and log in again.",
    },
    { status: 401 }
  );
}

    const body = await request.json();

    const result = questionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          issues: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: user.id,
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

    await invalidateQuestionsCache();

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("CREATE QUESTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}