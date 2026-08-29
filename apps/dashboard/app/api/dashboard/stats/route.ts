import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireUser } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = await requireUser(session);

    const stats = await prisma.$transaction(async (tx) => {
      const totalLinks = await tx.shortLink.count({
        where: { userId: user.id },
      });

      const activeLinks = await tx.shortLink.count({
        where: { userId: user.id, isActive: true, expiresAt: { gt: new Date() } },
      });

      const totalClicks = await tx.click.count({
        where: { shortLink: { userId: user.id } },
      });

      return { totalLinks, activeLinks, totalClicks };
    });

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
