import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";

export default function OfflinePage() {
  return (
    <AppShell>
      <main id="main-content">
        <ErrorState
          emoji="🌙"
          title="오프라인에서도 함께해요"
          description="오늘의 미션, 명언, 캘린더와 이 기기에 저장한 일지는 계속 볼 수 있어요. 온라인이 되면 자동으로 다시 연결합니다."
        />
      </main>
    </AppShell>
  );
}
