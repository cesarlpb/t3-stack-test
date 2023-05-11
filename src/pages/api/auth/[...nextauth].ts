import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID || "",
        clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      })
    ],
    theme: {
      colorScheme: "dark",
    },
      callbacks: {
    async jwt({ token }) {
      token.userRole = "user" // check: valores posibles?
      return token
      },
    },
}

export default NextAuth(authOptions);