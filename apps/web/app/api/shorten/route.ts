import { NextRequest, NextResponse } from "next/server";
import { prisma, generateSlug, urlSchema, slugSchema, calculateExpiration, EXPIRATION_OPTIONS } from "@repo/database";
import { auth } from "@repo/auth/auth";
import { z } from "zod";

const shortenSchema = z.object({
  originalUrl: z.string().min(1).pipe(urlSchema),
  customSlug: z.string().min(3).max(20).regex(/^[a-z0-9-]+$/).optional(),
  expirationMinutes: z.number().positive().or(z.null()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl, customSlug, expirationMinutes } = shortenSchema.parse(body);

    const session = await auth();
    
    let slug = customSlug;

    // If custom slug provided, validate it's unique
    if (slug) {
      const existing = await prisma.shortLink.findUnique({
        where: { slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Slug already taken" },
          { status: 400 }
        );
      }
    } else {
      // Generate random slug
      let attempts = 0;
      while (attempts < 5) {
        slug = generateSlug(8);
        const existing = await prisma.shortLink.findUnique({
          where: { slug },
        });
        if (!existing) break;
        attempts++;
      }
      if (attempts === 5) {
        return NextResponse.json(
          { error: "Could not generate unique slug" },
          { status: 500 }
        );
      }
    }

    // Calculate expiration
    const expiresAt = calculateExpiration(expirationMinutes || null);

    // Create short link
    const shortLink = await prisma.shortLink.create({
      data: {
        slug: slug!,
        originalUrl,
        userId: session?.user?.id || null,
        expiresAt,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        slug: shortLink.slug,
        originalUrl: shortLink.originalUrl,
        expiresAt: shortLink.expiresAt,
        shortUrl: `${new URL(request.url).origin}/s/${shortLink.slug}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Shorten error:", error);
    return NextResponse.json(
      { error: "Failed to create short link" },
      { status: 500 }
    );
  }
}
