import NextAuth, { type NextAuthConfig } from "next-auth";
import { prisma } from "@repo/database";
import { hashPassword } from "@repo/auth";
import {
  baseConfig,
  getCredentialsProvider,
} from "@repo/auth/config";

/**
 * Auth configuration for the monorepo
 * Used by all applications
 */
const authConfig: NextAuthConfig = {
  ...baseConfig,
  providers: [getCredentialsProvider()],
  callbacks: {
    ...baseConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers, create or update user
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
          },
        });
      }

      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
