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

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user and cascade delete their links and clicks
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
