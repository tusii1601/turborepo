import { Session } from "next-auth";
import { prisma } from "@repo/database";

/**
 * Get current user from session
 * Returns null if not authenticated
 */
export async function getCurrentUser(session: Session | null) {
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user;
}

/**
 * Require user to be authenticated
 * Throws an error if user is not authenticated
 */
export async function requireUser(session: Session | null) {
  const user = await getCurrentUser(session);

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  return user;
}

/**
 * Require user to be admin
 * Throws an error if user is not admin
 */
export async function requireAdmin(session: Session | null) {
  const user = await getCurrentUser(session);

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user?.id;
}

/**
 * Check if user is admin
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}

/**
 * Get user's short links (respects authorization)
 */
export async function getUserLinks(
  userId: string,
  requesterSession: Session | null
) {
  // Check authorization - users can only access their own links
  // except admins can access any
  if (requesterSession?.user?.id !== userId && requesterSession?.user?.role !== "ADMIN") {
    throw new Error("Forbidden: Cannot access other users' links");
  }

  return prisma.shortLink.findMany({
    where: { userId },
    include: {
      clicks: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}
