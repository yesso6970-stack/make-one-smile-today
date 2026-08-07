import type { Metadata } from "next";

import { InformationPage } from "@/components/layout/information-page";

export const metadata: Metadata = { title: "개인정보 처리방침" };

export default function PrivacyPage() {
  return (
    <InformationPage
      title="개인정보 처리방침"
      eyebrow="PRIVACY"
      description="최종 업데이트: 2026년 8월 7일"
      sections={[
        {
          title: "수집하는 정보",
          body: (
            <>
              앱은 로그인 없이 생성된 익명 기기 식별자, 미션 완료 기록, 사용자가
              직접 작성한 칭찬 일지를 처리합니다. 이름, 전화번호, 정확한 위치는
              요구하지 않습니다.
            </>
          ),
        },
        {
          title: "이용 목적",
          body: (
            <>
              웃음 기록 동기화, 중복 카운트 방지, 개인 캘린더와 일지 제공을
              위해서만 사용합니다.
            </>
          ),
        },
        {
          title: "보관과 보호",
          body: (
            <>
              기기 데이터는 브라우저 저장소에, 동기화한 일지는 암호화된 HTTPS
              연결을 통해 Neon PostgreSQL에 저장됩니다. 운영 비밀키는 서버
              환경변수로만 관리합니다.
            </>
          ),
        },
        {
          title: "사용자의 선택",
          body: (
            <>
              설정에서 이 기기의 데이터를 초기화할 수 있습니다. 서버 동기화
              일지의 삭제 요청은 문의하기를 통해 접수할 수 있습니다.
            </>
          ),
        },
      ]}
    />
  );
}
