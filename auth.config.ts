import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isProtectedPath = nextUrl.pathname.startsWith("/dashboard");
      const isLoggedIn = !!auth?.user;

      if (isProtectedPath) {
        return isLoggedIn;
      }

      if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
