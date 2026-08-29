import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireUser } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = await requireUser(session);

    // Get link and verify ownership
    const link = await prisma.shortLink.findUnique({
      where: { id: params.id },
    });

    if (!link || link.userId !== user.id) {
      return NextResponse.json(
        { error: "Link not found or unauthorized" },
        { status: 403 }
      );
    }

    // Get all clicks for this link
    const clicks = await prisma.click.findMany({
      where: { shortLinkId: link.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userAgent: true,
        referer: true,
        ipAddress: true,
        deviceType: true,
        createdAt: true,
      },
    });

    // Calculate device breakdown
    const deviceBreakdown = clicks.reduce(
      (acc, click) => {
        const device = click.deviceType || "desktop";
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate top referrers
    const referrerCounts: Record<string, number> = {};
    clicks.forEach(click => {
      let referrer = "direct";
      if (click.referer) {
        try {
          referrer = new URL(click.referer).hostname;
        } catch {
          referrer = click.referer.substring(0, 50);
        }
      }
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    });

    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer: referrer === "direct" ? null : referrer, count }));

    return NextResponse.json({
      link: {
        id: link.id,
        slug: link.slug,
        originalUrl: link.originalUrl,
        clickCount: link.clickCount,
        isActive: link.isActive,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt,
      },
      clicks,
      deviceBreakdown,
      topReferrers,
    });
  } catch (error: any) {
    console.error("Link analytics error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
