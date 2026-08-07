"use client";

import { Cloud, LogIn, LogOut, Sparkles } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ProfileCard({
  googleConfigured,
}: {
  googleConfigured: boolean;
}) {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return <div className="bg-border/60 h-52 animate-pulse rounded-[2rem]" />;
  }

  if (!user) {
    return (
      <section className="bg-surface shadow-warm rounded-[2rem] border p-6 text-center">
        <div className="bg-primary/25 mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl">
          😊
        </div>
        <h1 className="mt-5 text-xl font-black">체험 모드로 사용 중이에요</h1>
        <p className="text-muted mt-2 text-sm leading-6 font-semibold">
          로그인하면 이 기기의 미션, 일지, 포인트와 배지가 계정에 자동 연결돼요.
        </p>
        <Button
          className="mt-6 w-full"
          disabled={!googleConfigured}
          onClick={() => void signIn("google", { callbackUrl: "/profile" })}
        >
          <LogIn className="h-4 w-4" /> Google로 계속하기
        </Button>
        {!googleConfigured && (
          <p className="text-muted mt-3 text-xs font-semibold">
            운영자의 Google OAuth 설정을 기다리고 있어요. 체험 모드는 계속
            사용할 수 있습니다.
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="from-primary/35 to-surface shadow-warm rounded-[2rem] border bg-gradient-to-br p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-4 ring-white/70">
          <AvatarImage
            src={user.image ?? undefined}
            alt={`${user.name ?? "사용자"} 프로필 사진`}
          />
          <AvatarFallback>{user.name?.slice(0, 1) ?? "😊"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-black">
              {user.name ?? "미소 친구"}
            </h1>
            {user.plan === "premium" && (
              <Sparkles className="text-accent h-4 w-4" />
            )}
          </div>
          <p className="text-muted truncate text-xs font-semibold">
            {user.email}
          </p>
          <span className="bg-success/12 text-success mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black">
            <Cloud className="h-3 w-3" /> Neon 자동 동기화
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-6 w-full"
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        <LogOut className="h-4 w-4" /> 로그아웃
      </Button>
    </section>
  );
}
