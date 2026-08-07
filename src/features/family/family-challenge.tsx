"use client";

import { Copy, Crown, Link2, Plus, Share2, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_URL } from "@/constants/app";
import { useDailyActivity } from "@/hooks/use-daily-activity";
import { copyText } from "@/lib/clipboard";

interface FamilyMember {
  id: string;
  name: string;
  image: string | null;
  role: string;
  points: number | null;
  smiles: number | null;
}
interface Family {
  id: string;
  name: string;
  inviteCode: string;
  members: FamilyMember[];
}
interface Friend {
  id: string;
  name: string;
  image: string | null;
  points: number | null;
}

export function FamilyChallenge() {
  const { status } = useSession();
  const { todayMission } = useDailyActivity();
  const [family, setFamily] = useState<Family | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [createdFriendCode, setCreatedFriendCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    void Promise.all([
      fetch("/api/family", { cache: "no-store" }),
      fetch("/api/friends", { cache: "no-store" }),
    ]).then(async ([familyResponse, friendsResponse]) => {
      if (familyResponse.ok)
        setFamily(
          ((await familyResponse.json()) as { family: Family | null }).family,
        );
      if (friendsResponse.ok)
        setFriends(
          ((await friendsResponse.json()) as { friends: Friend[] }).friends,
        );
    });
  }, [status]);

  if (status !== "authenticated")
    return (
      <div className="bg-surface shadow-warm rounded-[2rem] border p-6 text-center">
        <span className="text-4xl">👨‍👩‍👧‍👦</span>
        <h1 className="mt-4 text-xl font-black">가족과 함께 웃어요</h1>
        <p className="text-muted mt-2 text-sm font-semibold">
          가족 그룹과 친구 초대는 로그인 후 안전하게 사용할 수 있어요.
        </p>
        <Button asChild className="mt-5">
          <Link href="/profile">Google 로그인</Link>
        </Button>
      </div>
    );

  const familyAction = async (action: "create" | "join") => {
    setLoading(true);
    try {
      const response = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "create" ? { action, name } : { action, code: joinCode },
        ),
      });
      const data = (await response.json()) as {
        family?: Family;
        error?: string;
      };
      if (!response.ok || !data.family) throw new Error(data.error);
      setFamily(data.family);
      toast.success(
        action === "create"
          ? "가족 그룹을 만들었어요"
          : "가족 그룹에 참여했어요",
      );
    } catch {
      toast.error("가족 그룹을 연결하지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  const createFriendInvite = async () => {
    const response = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createInvite" }),
    });
    const data = (await response.json()) as { code?: string };
    if (data.code) {
      setCreatedFriendCode(data.code);
      await copyText(data.code);
      toast.success("친구 초대 코드를 복사했어요");
    }
  };
  const acceptFriend = async () => {
    const response = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acceptInvite", code: friendCode }),
    });
    const data = (await response.json()) as { friends?: Friend[] };
    if (!response.ok || !data.friends)
      return toast.error("유효한 초대 코드인지 확인해주세요");
    setFriends(data.friends);
    setFriendCode("");
    toast.success("친구와 연결됐어요");
  };

  const shareMission = async () => {
    const text = `😊 오늘의 가족 미션\n${todayMission.message}`;
    if (navigator.share) {
      await navigator
        .share({ title: APP_NAME, text, url: APP_URL })
        .catch(() => undefined);
      return;
    }
    await copyText(`${text}\n${APP_URL}`);
    toast.success("오늘의 미션을 복사했어요");
  };

  return (
    <div className="space-y-4">
      {family ? (
        <section className="from-primary/45 to-surface shadow-warm rounded-[2rem] border bg-gradient-to-br p-6">
          <p className="text-accent text-xs font-black">FAMILY CHALLENGE</p>
          <h1 className="mt-1 text-2xl font-black">{family.name}</h1>
          <button
            type="button"
            onClick={() =>
              void copyText(family.inviteCode).then(() =>
                toast.success("가족 초대 코드를 복사했어요"),
              )
            }
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-xs font-black text-[#333]"
          >
            <Copy className="h-3.5 w-3.5" /> {family.inviteCode}
          </button>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => void shareMission()}
          >
            <Share2 className="h-4 w-4" /> 오늘의 미션 가족에게 공유
          </Button>
          <h2 className="mt-6 text-sm font-black">이번 주 가족 랭킹</h2>
          <div className="mt-3 space-y-2">
            {family.members.map((member, index) => (
              <div
                key={member.id}
                className="bg-surface/75 flex items-center gap-3 rounded-2xl p-3"
              >
                <span className="w-5 text-center font-black">
                  {index === 0 ? "👑" : index + 1}
                </span>
                <Avatar>
                  <AvatarImage src={member.image ?? undefined} alt="" />
                  <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-black">{member.name}</p>
                  <p className="text-muted text-[10px] font-bold">
                    미소 {member.smiles ?? 0}명
                  </p>
                </div>
                <strong>{member.points ?? 0}P</strong>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-surface shadow-warm rounded-[2rem] border p-6">
          <Users className="text-accent h-7 w-7" />
          <h1 className="mt-3 text-xl font-black">가족 챌린지 시작하기</h1>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="우리 가족 이름"
            className="mt-5 h-12 w-full rounded-2xl border bg-transparent px-4 text-sm font-bold"
          />
          <Button
            className="mt-2 w-full"
            disabled={loading}
            onClick={() => void familyAction("create")}
          >
            <Plus className="h-4 w-4" /> 그룹 만들기
          </Button>
          <div className="my-4 flex items-center gap-3">
            <span className="bg-border h-px flex-1" />
            <span className="text-muted text-xs">또는</span>
            <span className="bg-border h-px flex-1" />
          </div>
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder="가족 초대 코드"
            className="h-12 w-full rounded-2xl border bg-transparent px-4 text-sm font-bold uppercase"
          />
          <Button
            variant="outline"
            className="mt-2 w-full"
            disabled={loading}
            onClick={() => void familyAction("join")}
          >
            <Link2 className="h-4 w-4" /> 코드로 참여
          </Button>
        </section>
      )}
      <section className="bg-surface shadow-warm rounded-[2rem] border p-5">
        <h2 className="flex items-center gap-2 text-lg font-black">
          <Crown className="text-accent h-5 w-5" /> 함께하는 친구
        </h2>
        <div className="mt-4 flex gap-2">
          <input
            value={friendCode}
            onChange={(event) =>
              setFriendCode(event.target.value.toUpperCase())
            }
            placeholder="친구 코드"
            className="h-11 min-w-0 flex-1 rounded-2xl border bg-transparent px-3 text-sm font-bold"
          />
          <Button onClick={() => void acceptFriend()}>추가</Button>
        </div>
        <Button
          variant="outline"
          className="mt-2 w-full"
          onClick={() => void createFriendInvite()}
        >
          {createdFriendCode || "내 초대 코드 만들기"}
        </Button>
        <div className="mt-4 space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-surface-soft flex items-center gap-3 rounded-2xl p-3"
            >
              <Avatar>
                <AvatarImage src={friend.image ?? undefined} alt="" />
                <AvatarFallback>{friend.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <p className="flex-1 text-sm font-black">{friend.name}</p>
              <span className="text-xs font-black">{friend.points ?? 0}P</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
