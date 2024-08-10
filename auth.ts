import type { User } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

async function getUser(email: string): Promise<User | undefined> {
  "use server";

  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid credentials");
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await getUser(email);

        if (!user) {
          console.log("E-mail not found");
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          console.log("Wrong password");
          return null;
        }

        return user;
      },
    }),
  ],
});
