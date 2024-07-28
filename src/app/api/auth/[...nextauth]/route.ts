import { login } from "@/app/lib/action";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// export const authConfig: NextAuthConfig = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         loginAct: { label: "Username", type: "text" },
//         loginPwd: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.loginAct || !credentials?.loginPwd) {
//           return null;
//         }
//         try {
//           const result = await login(credentials);
//           if (result.code === 200 && result.data) {
//             // 返回包含 token 的用户对象
//             return { id: result.data.id, token: result.data.token };
//           }
//           return null;
//         } catch (error) {
//           console.error("Login error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user?.token) {
//         token.accessToken = user.token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login", // 自定义登录页面的路径
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
