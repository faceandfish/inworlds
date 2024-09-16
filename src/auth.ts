import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      // 可以在这里自定义 session
      return session;
    }
  }
});
