"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#FFFDF8] text-[#333]">
        <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center px-8 text-center">
          <div className="text-6xl">🌤️</div>
          <h1 className="mt-6 text-2xl font-black">앱을 다시 깨워볼까요?</h1>
          <p className="mt-3 text-sm leading-6 text-[#807b70]">
            핵심 화면을 불러오지 못했어요. 다시 시도하면 저장된 기록부터
            안전하게 불러옵니다.
          </p>
          <button
            className="mt-8 rounded-2xl bg-[#FFD54F] px-6 py-3 text-sm font-black"
            onClick={reset}
          >
            다시 시도
          </button>
        </main>
      </body>
    </html>
  );
}
