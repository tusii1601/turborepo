import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireAdmin } from "@repo/auth";
import { prisma } from "@repo/database";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    await requireAdmin(session);

    const link = await prisma.shortLink.findUnique({
      where: { id: params.id },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Delete link and associated clicks
    await prisma.shortLink.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Link deleted" });
  } catch (error: any) {
    console.error("Delete link error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
