import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireUser } from "@repo/auth";
import { prisma } from "@repo/database";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = await requireUser(session);

    // Verify ownership
    const link = await prisma.shortLink.findUnique({
      where: { id: params.id },
    });

    if (!link || link.userId !== user.id) {
      return NextResponse.json(
        { error: "Link not found or unauthorized" },
        { status: 403 }
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
