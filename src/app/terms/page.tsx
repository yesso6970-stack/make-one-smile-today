import type { Metadata } from "next";

import { InformationPage } from "@/components/layout/information-page";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <InformationPage
      title="이용약관"
      eyebrow="TERMS"
      description="서로를 존중하는 다정한 사용을 위한 약속입니다."
      sections={[
        {
          title: "서비스 목적",
          body: (
            <>
              본 서비스는 일상의 긍정적 소통을 돕는 미션, 문구, 기록 도구를
              제공합니다.
            </>
          ),
        },
        {
          title: "사용자의 책임",
          body: (
            <>
              상대방의 상황과 관계를 존중해 문구를 사용해야 하며,
              괴롭힘·차별·불법적인 목적으로 이용할 수 없습니다.
            </>
          ),
        },
        {
          title: "콘텐츠 안내",
          body: (
            <>
              추천 문구와 명언은 일반적인 아이디어이며 의료·법률·전문 상담을
              대신하지 않습니다.
            </>
          ),
        },
        {
          title: "서비스 변경",
          body: (
            <>
              안정성과 경험 개선을 위해 기능이 변경될 수 있으며 중요한 변경은
              앱에서 안내합니다.
            </>
          ),
        },
      ]}
    />
  );
}
