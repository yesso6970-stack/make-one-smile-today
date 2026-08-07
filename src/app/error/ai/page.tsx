import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";

export default function AiErrorPage() {
  return (
    <AppShell>
      <main id="main-content">
        <ErrorState
          emoji="💭"
          title="아이디어가 잠시 생각 중이에요"
          description="현재 저장된 추천 문구는 계속 사용할 수 있어요. 잠시 뒤 다시 추천을 눌러주세요."
        />
      </main>
    </AppShell>
  );
}
