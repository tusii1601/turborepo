import NextAuth, { type NextAuthConfig } from "next-auth";
import { prisma } from "@repo/database";
import { hashPassword } from "@repo/auth";
import {
  baseConfig,
  getCredentialsProvider,
  getGoogleProvider,
  getGithubProvider,
} from "@repo/auth/config";

/**
 * Auth configuration for the monorepo
 * Used by all applications
 * Supports: Credentials (email/password), Google OAuth, GitHub OAuth
 */
const authConfig: NextAuthConfig = {
  ...baseConfig,
  providers: [
    getCredentialsProvider(),
    ...(process.env.AUTH_GOOGLE_ID ? [getGoogleProvider()] : []),
    ...(process.env.AUTH_GITHUB_ID ? [getGithubProvider()] : []),
  ],
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
      } else if (!existingUser.emailVerified) {
        // Verify email if using OAuth
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { emailVerified: new Date() },
        });
      }

      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
