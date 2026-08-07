import type { Metadata } from "next";

import { InformationPage } from "@/components/layout/information-page";

export const metadata: Metadata = { title: "오픈소스 라이선스" };

export default function LicensesPage() {
  return (
    <InformationPage
      title="오픈소스 라이선스"
      eyebrow="LICENSES"
      description="이 앱은 훌륭한 오픈소스 생태계 위에서 만들어졌습니다."
      sections={[
        {
          title: "MIT License",
          body: (
            <>
              Next.js, React, Tailwind CSS, Framer Motion, Lucide React,
              next-themes, Drizzle ORM, Radix UI와 각 종속 패키지는 해당
              프로젝트의 라이선스를 따릅니다.
            </>
          ),
        },
        {
          title: "Font",
          body: <>Pretendard는 SIL Open Font License 1.1에 따라 사용합니다.</>,
        },
        {
          title: "고지",
          body: (
            <>
              각 패키지의 전체 저작권 및 라이선스 문서는 배포 번들에 포함된
              패키지 원문과 공식 저장소에서 확인할 수 있습니다.
            </>
          ),
        },
      ]}
    />
  );
}
