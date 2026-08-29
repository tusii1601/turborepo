import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { prisma } from "@repo/database";

/**
 * Base Auth.js configuration
 * This is used by all applications (web, dashboard, admin)
 * Providers will be configured differently per app
 */
export const baseConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut() {
      console.log("User signed out");
    },
  },
};

/**
 * Credentials provider configuration for email/password auth
 * This is a separate export so it can be conditionally included
 */
export function getCredentialsProvider() {
  return Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Invalid credentials");
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user) {
        throw new Error("No user found with this email");
      }

      if (!user.passwordHash) {
        throw new Error("This account was not created with a password");
      }

      const passwordsMatch = await compare(
        credentials.password as string,
        user.passwordHash
      );

      if (!passwordsMatch) {
        throw new Error("Invalid password");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  });
}

/**
 * Google OAuth provider configuration
 */
export function getGoogleProvider() {
  return Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  });
}

/**
 * GitHub OAuth provider configuration
 */
export function getGithubProvider() {
  return GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  });
}
