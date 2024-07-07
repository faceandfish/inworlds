import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    id: "1",
    name: "lianlian",
    email: "lianlian@123.com",
    username: "lian123",
    password: "password123",
  },
  {
    id: "2",
    name: "xiaoli",
    email: "li@123.com",
    username: "lili",
    password: "password456",
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null;
        }
        const user = users.find(
          (user) =>
            user.email === credentials.emailOrUsername ||
            user.username === credentials.emailOrUsername
        );

        if (user && user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: {
    strategy: "jwt",
  },
});
