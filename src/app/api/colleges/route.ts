import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  collegeListCacheKey,
  getCache,
  REDIS_TTL,
  setCache,
} from "@/lib/redis";

const querySchema = z.object({
  search: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),

  minFees: z.coerce.number().finite().nonnegative().optional(),

  maxFees: z.coerce.number().finite().nonnegative().optional(),

  minRating: z.coerce
    .number()
    .finite()
    .min(0)
    .max(5)
    .optional(),

  sort: z
    .enum([
      "rating_desc",
      "rating_asc",
      "fees_low",
      "fees_high",
      "placement_high",
      "name_asc",
    ])
    .default("rating_desc"),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(10),
}).superRefine((data, ctx) => {
  if (
    data.minFees !== undefined &&
    data.maxFees !== undefined &&
    data.minFees > data.maxFees
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["minFees"],
      message: "minFees cannot be greater than maxFees",
    });
  }
});

type CollegeListResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: unknown[];
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const rawParams = {
      search: searchParams.get("search") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      minFees: searchParams.get("minFees") ?? undefined,
      maxFees: searchParams.get("maxFees") ?? undefined,
      minRating: searchParams.get("minRating") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    };

    const result = querySchema.safeParse(rawParams);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      search,
      location,
      minFees,
      maxFees,
      minRating,
      sort,
      page,
      limit,
    } = result.data;

    const skip = (page - 1) * limit;

    const cacheParams = new URLSearchParams();

    if (search) cacheParams.set("search", search);
    if (location) cacheParams.set("location", location);
    if (minFees !== undefined) {
      cacheParams.set("minFees", String(minFees));
    }
    if (maxFees !== undefined) {
      cacheParams.set("maxFees", String(maxFees));
    }
    if (minRating !== undefined) {
      cacheParams.set("minRating", String(minRating));
    }

    cacheParams.set("sort", sort);
    cacheParams.set("page", String(page));
    cacheParams.set("limit", String(limit));

    const cacheKey = collegeListCacheKey(cacheParams.toString());

    const cached =
      await getCache<CollegeListResponse>(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        cached: true,
        ...cached,
      });
    }

    const where = {
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                overview: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(location
        ? {
            location: {
              contains: location,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(minFees !== undefined || maxFees !== undefined
        ? {
            fees: {
              ...(minFees !== undefined
                ? { gte: minFees }
                : {}),
              ...(maxFees !== undefined
                ? { lte: maxFees }
                : {}),
            },
          }
        : {}),

      ...(minRating !== undefined
        ? {
            rating: {
              gte: minRating,
            },
          }
        : {}),
    };

    let orderBy;

    switch (sort) {
      case "rating_asc":
        orderBy = { rating: "asc" as const };
        break;

      case "fees_low":
        orderBy = { fees: "asc" as const };
        break;

      case "fees_high":
        orderBy = { fees: "desc" as const };
        break;

      case "placement_high":
        orderBy = { averagePlacement: "desc" as const };
        break;

      case "name_asc":
        orderBy = { name: "asc" as const };
        break;

      case "rating_desc":
      default:
        orderBy = { rating: "desc" as const };
        break;
    }

    const [total, colleges] = await Promise.all([
      prisma.college.count({
        where,
      }),

      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: CollegeListResponse = {
      page,
      limit,
      total,
      totalPages,
      data: colleges,
    };


    await setCache(
      cacheKey,
      response,
      REDIS_TTL.COLLEGE_LIST
    );

    return NextResponse.json({
      success: true,
      cached: false,
      ...response,
    });
  } catch (error) {
    console.error(
      "GET /api/colleges failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch colleges",
      },
      { status: 500 }
    );
  }
}