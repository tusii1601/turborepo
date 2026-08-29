import { NextRequest, NextResponse } from "next/server";
import { prisma, isLinkExpired } from "@repo/database";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Find the short link
    const shortLink = await prisma.shortLink.findUnique({
      where: { slug },
    });

    // Handle link not found
    if (!shortLink) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Check if link is active
    if (!shortLink.isActive) {
      return NextResponse.json(
        { error: "This link has been disabled" },
        { status: 410 }
      );
    }

    // Check if link has expired
    if (isLinkExpired(shortLink.expiresAt)) {
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 }
      );
    }

    // Record the click
    const headersList = headers();
    const userAgent = headersList.get("user-agent");
    const referer = headersList.get("referer");
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";

    // Extract device from user agent
    let device = "desktop";
    if (userAgent) {
      if (/mobile/i.test(userAgent)) device = "mobile";
      else if (/tablet|ipad/i.test(userAgent)) device = "tablet";
    }

    await Promise.all([
      // Record click
      prisma.click.create({
        data: {
          shortLinkId: shortLink.id,
          ipAddress,
          userAgent: userAgent || undefined,
          referer: referer || undefined,
          device,
        },
      }),
      // Increment click count
      prisma.shortLink.update({
        where: { id: shortLink.id },
        data: { clickCount: { increment: 1 } },
      }),
    ]);

    // Redirect to original URL
    return NextResponse.redirect(shortLink.originalUrl, {
      status: 302,
    });
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { error: "Failed to process link" },
      { status: 500 }
    );
  }
}
