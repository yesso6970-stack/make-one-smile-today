import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";

export default function NotFound() {
  return (
    <AppShell>
      <main id="main-content">
        <ErrorState
          emoji="🧭"
          title="길을 잠시 잃었어요"
          description="찾으시는 페이지가 없거나 주소가 바뀌었어요. 홈에서 다시 미소를 시작해보세요."
        />
      </main>
    </AppShell>
  );
}
