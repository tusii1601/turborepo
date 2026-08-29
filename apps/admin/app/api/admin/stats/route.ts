import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireAdmin } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    await requireAdmin(session);

    const [totalUsers, totalLinks, totalClicks, inactiveLinks] = await Promise.all([
      prisma.user.count(),
      prisma.shortLink.count(),
      prisma.click.count(),
      prisma.shortLink.count({
        where: {
          OR: [
            { isActive: false },
            { expiresAt: { lt: new Date() } },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalLinks,
      totalClicks,
      inactiveLinks,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
