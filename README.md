# Make One Smile Today 😊

> Make One Smile Today — 하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관

바이브 코딩 챌린지를 위해 제작한 모바일 퍼스트 PWA입니다. 카드 콘텐츠는 정적 데이터로 안정적으로 제공하고, 공용 미소 합계는 Neon Postgres에 저장합니다.

## 주요 화면

- 2초 페이드 스플래시와 홈 대시보드
- 가족, 친구, 연인, 직장동료, 모르는 사람, 랜덤 대상 선택
- 대상별로 구성된 유머, 칭찬, 응원, 미션, 농담 카드 36개와 카드 플립
- 공유 미리보기 다이얼로그와 성공 축하 애니메이션
- 성공 카운트, 연속 기록, 날짜별 추천 카드와 칭찬 스티커 컬렉션
- 핵심 문장 복사와 Web Share API 기반 앱 링크 공유
- Asia/Seoul 기준 날짜 자동 갱신과 날짜별 카드 전체 순서 변경
- 계절·복날·기념일·서울 실시간 날씨를 반영하는 오늘의 맞춤 카드
- 시스템 테마를 따르는 라이트/다크 모드
- Web App Manifest, 앱 아이콘, 서비스 워커, 오프라인 안내 화면

## 기술 스택

- Next.js 15 / App Router / TypeScript
- Tailwind CSS 4 / shadcn/ui 패턴
- Framer Motion / Lucide React / next-themes
- Pretendard Variable
- Drizzle ORM / Neon Postgres

## 시작하기

Node.js 20 이상을 권장합니다.

```bash
npm install
npm run db:migrate
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 검증 명령어

```bash
npm run lint
npm run typecheck
npm run build
npm run format:check
npm run db:generate
npm run db:migrate
```

## 프로젝트 구조

```text
src/
├─ app/                 # App Router 페이지와 전역 스타일
├─ components/
│  ├─ animations/      # Confetti 등 모션
│  ├─ buttons/         # 재사용 버튼
│  ├─ cards/           # 도메인 카드
│  ├─ layout/          # Header, BottomNavigation, AppShell
│  ├─ providers/       # Theme, PWA, Toast
│  └─ ui/              # shadcn/ui 기반 원자 컴포넌트
├─ constants/          # 더미 데이터
├─ db/                 # Drizzle 스키마와 Postgres 연결
├─ hooks/              # 카드 덱, 서비스 워커 훅
├─ lib/                # 공통 유틸리티
├─ styles/             # 스타일 확장 지점
└─ types/              # 도메인 타입
```

## 데이터와 개인정보

Firebase, Firestore, AI는 연결하지 않았습니다. 카드 기본 문구는 정적 데이터로 관리하며, 날씨 맥락에 한해 Open-Meteo를 사용합니다.

상단의 전체 미소 수는 `상대가 웃었어요` 성공 기록을 Neon Postgres에서 합산한 실제 공용 통계입니다. 한 기기에서는 Asia/Seoul 기준 하루 한 번만 전체 합계에 반영됩니다. 서버에는 브라우저에서 만든 임의 ID의 SHA-256 해시와 날짜만 저장하며, 원본 ID나 개인정보는 저장하지 않습니다. 개인 횟수·연속 기록·스티커는 브라우저에 저장됩니다.

## Vercel 배포

GitHub 저장소를 Vercel에 연결하면 Next.js 프로젝트로 자동 인식됩니다. Vercel Marketplace의 Neon 리소스를 연결해 `DATABASE_URL`과 `DATABASE_URL_UNPOOLED`을 주입해야 합니다.

실시간 날씨는 키 없이 사용할 수 있는 [Open-Meteo Weather API](https://open-meteo.com/en/docs)를 사용하며, 네트워크 연결이 없으면 계절 카드로 자동 전환됩니다.
