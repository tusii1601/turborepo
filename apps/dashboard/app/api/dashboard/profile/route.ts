import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth/auth";
import { requireUser } from "@repo/auth";
import { prisma } from "@repo/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = await requireUser(session);

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const user = await requireUser(session);

    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
