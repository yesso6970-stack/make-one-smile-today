import { WifiOff } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <AppShell>
      <main className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
        <div className="bg-primary/20 flex h-20 w-20 items-center justify-center rounded-3xl">
          <WifiOff className="text-accent h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-black">잠시 연결이 쉬고 있어요</h1>
        <p className="text-muted mt-3 text-sm leading-relaxed font-medium">
          인터넷 연결을 확인한 뒤 다시 시도해주세요.
          <br />곧 따뜻한 미소를 이어갈 수 있어요.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </main>
    </AppShell>
  );
}
