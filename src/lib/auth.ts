import { eq } from "drizzle-orm";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { getDb, reportDatabaseError } from "@/db";
import { userPreferences, userStats, users } from "@/db/schema";

export const GOOGLE_AUTH_CONFIGURED = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

const googleProviders = GOOGLE_AUTH_CONFIGURED
  ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: { params: { prompt: "select_account" } },
      }),
    ]
  : [];

export const authOptions: NextAuthOptions = {
  providers: googleProviders,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/profile", error: "/profile" },
  // A public guest-only fallback keeps session reads healthy when OAuth is disabled.
  // Once Google is configured, NEXTAUTH_SECRET remains mandatory.
  secret:
    process.env.NEXTAUTH_SECRET ??
    (GOOGLE_AUTH_CONFIGURED ? undefined : "make-one-smile-guest-only"),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return false;
      const userId = `google:${account.providerAccountId}`;
      try {
        await getDb().transaction(async (transaction) => {
          await transaction
            .insert(users)
            .values({
              id: userId,
              email: user.email as string,
              name: user.name?.slice(0, 80) || "미소 친구",
              image: user.image,
            })
            .onConflictDoUpdate({
              target: users.id,
              set: {
                email: user.email as string,
                name: user.name?.slice(0, 80) || "미소 친구",
                image: user.image,
                updatedAt: new Date(),
              },
            });
          await transaction
            .insert(userStats)
            .values({ userId })
            .onConflictDoNothing();
          await transaction
            .insert(userPreferences)
            .values({ userId })
            .onConflictDoNothing();
        });
        user.id = userId;
        return true;
      } catch (error) {
        reportDatabaseError("upsert OAuth user", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        token.userId = `google:${account.providerAccountId}`;
      } else if (user?.id) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.userId === "string") {
        session.user.id = token.userId;
        try {
          const [profile] = await getDb()
            .select({ plan: users.plan })
            .from(users)
            .where(eq(users.id, token.userId))
            .limit(1);
          session.user.plan = profile?.plan === "premium" ? "premium" : "free";
        } catch {
          session.user.plan = "free";
        }
      }
      return session;
    },
  },
};
