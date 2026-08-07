import { asc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { getDb, reportDatabaseError } from "@/db";
import { familyGroups, familyMembers, userStats, users } from "@/db/schema";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

function code() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
}

async function readFamily(userId: string) {
  const database = getDb();
  const [membership] = await database
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId))
    .limit(1);
  if (!membership) return null;
  const [group] = await database
    .select()
    .from(familyGroups)
    .where(eq(familyGroups.id, membership.familyId))
    .limit(1);
  if (!group) return null;
  const members = await database
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      role: familyMembers.role,
      points: userStats.points,
      smiles: userStats.peopleSmiled,
    })
    .from(familyMembers)
    .innerJoin(users, eq(users.id, familyMembers.userId))
    .leftJoin(userStats, eq(userStats.userId, users.id))
    .where(eq(familyMembers.familyId, group.id))
    .orderBy(asc(familyMembers.joinedAt));
  return {
    ...group,
    members: members.sort(
      (left, right) => (right.points ?? 0) - (left.points ?? 0),
    ),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    return Response.json(
      { family: await readFamily(session.user.id) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    reportDatabaseError("read family group", error);
    return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  }
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
    if (candidate.action === "create") {
      const name =
        typeof candidate.name === "string"
          ? candidate.name.trim().slice(0, 60)
          : "";
      if (name.length < 2)
        return Response.json({ error: "INVALID_NAME" }, { status: 400 });
      const existing = await readFamily(session.user.id);
      if (existing)
        return Response.json({ error: "ALREADY_MEMBER" }, { status: 409 });
      const familyId = crypto.randomUUID();
      await getDb().transaction(async (transaction) => {
        await transaction.insert(familyGroups).values({
          id: familyId,
          name,
          inviteCode: code(),
          ownerId: session.user.id,
        });
        await transaction
          .insert(familyMembers)
          .values({ familyId, userId: session.user.id, role: "owner" });
      });
    } else if (candidate.action === "join") {
      const inviteCode =
        typeof candidate.code === "string"
          ? candidate.code.trim().toUpperCase()
          : "";
      const [group] = await getDb()
        .select()
        .from(familyGroups)
        .where(eq(familyGroups.inviteCode, inviteCode))
        .limit(1);
      if (!group)
        return Response.json({ error: "INVALID_CODE" }, { status: 404 });
      await getDb()
        .insert(familyMembers)
        .values({ familyId: group.id, userId: session.user.id })
        .onConflictDoNothing();
    } else {
      return Response.json({ error: "INVALID_ACTION" }, { status: 400 });
    }
    return Response.json({ family: await readFamily(session.user.id) });
  } catch (error) {
    reportDatabaseError("update family group", error);
    return Response.json({ error: "FAMILY_UPDATE_FAILED" }, { status: 503 });
  }
}
