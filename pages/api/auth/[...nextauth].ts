import NextAuth from "next-auth/next";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { databaseAPI, User as DbUser } from "@lib/DatabaseAPI";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    credits?: number;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      credits: number;
    }
  }
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  credits: number;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        await databaseAPI.initialize();
        try {
          const user = await databaseAPI.verifyUserCredentials(
            credentials.email,
            credentials.password
          );
          if (user) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              credits: user.credits,
            };
          }
          return null;
        } catch (error) {
          console.error("Error authorizing user:", error);
          return null;
        } finally {
          await databaseAPI.close();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.id = authUser.id;
        token.name = authUser.name;
        token.email = authUser.email;
        token.credits = authUser.credits;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          credits: token.credits as number,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});

export default handler;
