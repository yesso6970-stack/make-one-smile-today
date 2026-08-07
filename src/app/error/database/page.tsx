import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";

export default function DatabaseErrorPage() {
  return (
    <AppShell>
      <main id="main-content">
        <ErrorState
          emoji="📚"
          title="기록장을 연결하지 못했어요"
          description="기기의 기록은 그대로 보관돼요. 인터넷 연결 후 홈으로 돌아가면 자동으로 다시 동기화합니다."
        />
      </main>
    </AppShell>
  );
}
