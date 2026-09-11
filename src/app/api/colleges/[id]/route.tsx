import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  collegeDetailCacheKey,
  getCache,
  REDIS_TTL,
  setCache,
} from "@/lib/redis";

const idSchema = z.string().trim().min(1).max(100);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const validation = idSchema.safeParse(id);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid college ID",
        },
        { status: 400 }
      );
    }

    const collegeId = validation.data;

    const cacheKey = collegeDetailCacheKey(collegeId);

    const cached = await getCache(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        cached: true,
        data: cached,
      });
    }


    const college = await prisma.college.findUnique({
      where: {
        id: collegeId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        fees: true,
        rating: true,
        averagePlacement: true,
        highestPlacement: true,
        overview: true,
        createdAt: true,
        updatedAt: true,

        courses: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
          orderBy: {
            name: "asc",
          },
        },

        reviews: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          error: "College not found",
        },
        { status: 404 }
      );
    }

    await setCache(
      cacheKey,
      college,
      REDIS_TTL.COLLEGE_DETAIL
    );

    return NextResponse.json({
      success: true,
      cached: false,
      data: college,
    });
  } catch (error) {
    console.error(
      "GET /api/colleges/[id] failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch college",
      },
      { status: 500 }
    );
  }
}