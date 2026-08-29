import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireAdmin } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    await requireAdmin(session);

    // Get top links by clicks
    const topLinks = await prisma.shortLink.findMany({
      orderBy: { clickCount: "desc" },
      take: 10,
      select: { slug: true, clickCount: true },
    });

    // Get top users by link count
    const topUsers = await prisma.user.findMany({
      orderBy: { shortLinks: { _count: "desc" } },
      take: 10,
      select: {
        email: true,
        _count: { select: { shortLinks: true } },
      },
    });

    // Calculate average clicks
    const allLinks = await prisma.shortLink.findMany({
      select: { clickCount: true },
    });

    const averageClicks = allLinks.length > 0
      ? allLinks.reduce((sum, link) => sum + link.clickCount, 0) / allLinks.length
      : 0;

    return NextResponse.json({
      topLinks,
      topUsers: topUsers.map(u => ({ email: u.email, linkCount: u._count.shortLinks })),
      averageClicks,
      clicksPerDay: [],
    });
  } catch (error: any) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
