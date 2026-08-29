import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireAdmin } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    await requireAdmin(session);

    const links = await prisma.shortLink.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(links);
  } catch (error: any) {
    console.error("Admin links error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
