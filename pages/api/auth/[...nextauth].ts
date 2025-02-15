import NextAuth from "next-auth/next";
import type { AuthCallbacks } from "@/types/next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthAdapter } from "@/infrastructure/auth/NextAuthAdapter";
import { container } from "@/infrastructure/di/container";

// Initialize database schema when the API route is first loaded
container.initializeDatabase().catch(console.error);

const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const user = await NextAuthAdapter.verifyCredentials(
            credentials.email,
            credentials.password
          );

          return user;
        } catch (error) {
          console.error("Error authorizing user:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }: AuthCallbacks["jwt"]) => {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.credits = user.credits;
        token.membershipTier = user.membershipTier;
        token.membershipExpiry = user.membershipExpiry;
      } else if (trigger === "update" && session?.user) {
        // Handle session updates
        return { ...token, ...session.user };
      } else if (token.email) {
        // Subsequent requests: refresh user data
        const updatedUser = await NextAuthAdapter.getUserByEmail(token.email);
        if (updatedUser) {
          token.credits = updatedUser.credits;
          token.membershipTier = updatedUser.membershipTier;
          token.membershipExpiry = updatedUser.membershipExpiry;
        }
      }
      return token;
    },
    // @ts-ignore: workaround for user type mismatch in session callback
    session: async ({ session, token }: AuthCallbacks["session"]) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name || "";
        session.user.email = token.email || "";
        session.user.credits = token.credits;
        session.user.membershipTier = token.membershipTier;
        session.user.membershipExpiry = token.membershipExpiry;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authConfig as any);
export const authOptions = authConfig as any;
