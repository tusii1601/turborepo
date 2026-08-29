import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireUser } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = await requireUser(session);

    const links = await prisma.shortLink.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        clickCount: true,
        createdAt: true,
        expiresAt: true,
        isActive: true,
      },
    });

    return NextResponse.json(links);
  } catch (error: any) {
    console.error("Dashboard links error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
