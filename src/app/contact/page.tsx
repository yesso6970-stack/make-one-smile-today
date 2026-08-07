import type { Metadata } from "next";

import { InformationPage } from "@/components/layout/information-page";

export const metadata: Metadata = { title: "문의하기" };

export default function ContactPage() {
  return (
    <InformationPage
      title="문의하기"
      eyebrow="CONTACT"
      description="불편함이나 따뜻한 제안을 들려주세요."
      sections={[
        {
          title: "이메일 문의",
          body: (
            <>
              <a
                className="text-accent font-black underline underline-offset-4"
                href="mailto:hello@makeonesmiletoday.app"
              >
                hello@makeonesmiletoday.app
              </a>
              <p className="mt-2">
                앱 버전, 사용 기기, 문제 화면을 함께 보내면 더 빠르게 확인할 수
                있습니다.
              </p>
            </>
          ),
        },
        {
          title: "데이터 관련 요청",
          body: (
            <>
              개인 일지 삭제나 개인정보 문의 시에는 앱을 사용한 브라우저와
              대략적인 작성 날짜를 알려주세요. 본인 확인에 필요한 최소 정보만
              요청합니다.
            </>
          ),
        },
      ]}
    />
  );
}
