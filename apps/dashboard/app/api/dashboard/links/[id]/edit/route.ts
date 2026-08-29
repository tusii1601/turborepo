import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireUser } from "@repo/auth";
import { prisma } from "@repo/database";
import { z } from "zod";

const updateLinkSchema = z.object({
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = await requireUser(session);

    const body = await request.json();
    const { isActive, expiresAt } = updateLinkSchema.parse(body);

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

    // Update link
    const updated = await prisma.shortLink.update({
      where: { id: params.id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update link error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
