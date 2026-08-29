import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireAdmin } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    await requireAdmin(session);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { shortLinks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
