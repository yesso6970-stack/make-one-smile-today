import { and, eq, gt, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { getDb, reportDatabaseError } from "@/db";
import { friendInvites, friendships, userStats, users } from "@/db/schema";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

async function readFriends(userId: string) {
  return getDb()
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      points: userStats.points,
    })
    .from(friendships)
    .innerJoin(users, eq(users.id, friendships.friendId))
    .leftJoin(userStats, eq(userStats.userId, users.id))
    .where(eq(friendships.userId, userId));
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  return Response.json(
    { friends: await readFriends(session.user.id) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null)
    return Response.json({ error: "INVALID_BODY" }, { status: 400 });
  const candidate = body as Record<string, unknown>;
  try {
    if (candidate.action === "createInvite") {
      const inviteCode = crypto
        .randomUUID()
        .replaceAll("-", "")
        .slice(0, 8)
        .toUpperCase();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await getDb().insert(friendInvites).values({
        id: crypto.randomUUID(),
        code: inviteCode,
        inviterId: session.user.id,
        expiresAt,
      });
      return Response.json({
        code: inviteCode,
        expiresAt: expiresAt.toISOString(),
      });
    }
    if (candidate.action === "acceptInvite") {
      const inviteCode =
        typeof candidate.code === "string"
          ? candidate.code.trim().toUpperCase()
          : "";
      const [invite] = await getDb()
        .select()
        .from(friendInvites)
        .where(
          and(
            eq(friendInvites.code, inviteCode),
            gt(friendInvites.expiresAt, new Date()),
          ),
        )
        .limit(1);
      if (
        !invite ||
        invite.inviterId === session.user.id ||
        invite.acceptedById
      )
        return Response.json({ error: "INVALID_CODE" }, { status: 404 });
      await getDb().transaction(async (transaction) => {
        await transaction
          .insert(friendships)
          .values([
            { userId: session.user.id, friendId: invite.inviterId },
            { userId: invite.inviterId, friendId: session.user.id },
          ])
          .onConflictDoNothing();
        await transaction
          .update(friendInvites)
          .set({ acceptedById: session.user.id })
          .where(
            and(
              eq(friendInvites.id, invite.id),
              isNull(friendInvites.acceptedById),
            ),
          );
      });
      return Response.json({ friends: await readFriends(session.user.id) });
    }
    return Response.json({ error: "INVALID_ACTION" }, { status: 400 });
  } catch (error) {
    reportDatabaseError("update friend graph", error);
    return Response.json({ error: "FRIEND_UPDATE_FAILED" }, { status: 503 });
  }
}
