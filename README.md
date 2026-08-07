# Make One Smile Today 😊

하루 한 사람에게 작은 미소를 선물하는 모바일 퍼스트 PWA입니다. 대상별 웃음 카드, 날짜·계절·날씨에 맞춘 콘텐츠, 칭찬 스티커와 공용 미소 카운터를 제공합니다.

## 매일 30초 루틴

- 6개 카테고리에서 고른 오늘의 미션 50개와 하루 한 번 완료 처리
- 완료일을 보여주는 월간 웃음 캘린더와 수정 가능한 200자 감성 기록
- 날짜 기준으로 고정되는 오늘의 명언 100개
- 미션 완료 `+10P`, 7일 연속 `+100P`, 30일 연속 `+500P` 포인트 규칙
- 1일·7일·30일·100일 성취 배지와 Gold Badge
- 향후 OpenAI 연동 경계를 분리한 더미 AI 웃음 아이디어 10개
- 입력 후 자동 저장되고 최근 기록을 다시 볼 수 있는 나만의 칭찬 일지

비회원은 `src/services/daily-storage.ts`의 버전 관리된 브라우저 저장소로 모든 핵심 루틴을 체험할 수 있습니다. Google 로그인 후에는 로컬 미션·칭찬 일지·포인트·배지·연속 기록이 Neon의 사용자 계정으로 병합되고, 다른 기기에서도 다시 동기화됩니다.

## Premium & Smart 기능

- Google OAuth 로그인, 비회원 체험, 프로필과 로그아웃
- 무료 로컬 스트리밍 코치와 선택형 OpenAI Responses API 연동
- 사용자별 일일 활동, 통계, 배지, 설정과 AI 사용량 저장
- 주간 행복 리포트, 월간 차트·Calendar Heatmap, 완료 공유 이미지
- 가족 그룹, 초대 코드, 가족 랭킹과 친구 연결
- 무료 회원 AI 코치 하루 3회, Premium entitlement 기반 무제한 구조
- 알림 시간 저장과 PWA 실행 중 일일·연속 기록 리마인드

OpenAI API는 무료 서비스가 아니므로 `OPENAI_API_KEY`가 없을 때는 서버의 무료 로컬 코치가 동일한 스트리밍 UI로 응답합니다. 결제는 제공자와 상품 정책이 확정되기 전 실제 청구를 발생시키지 않도록 Premium UI와 entitlement 경계까지만 안전하게 구성되어 있습니다.

## Google 로그인

1. Google Cloud Console에서 OAuth 2.0 웹 클라이언트를 만듭니다.
2. 승인된 리디렉션 URI에 `https://make-one-smile-today.vercel.app/api/auth/callback/google`을 추가합니다.
3. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`을 Vercel Production/Preview에 설정합니다.
4. 로컬 환경에는 `http://localhost:3000/api/auth/callback/google`도 등록하고 `.env.local`에 값을 넣습니다.

Google 환경변수가 없으면 로그인 버튼만 비활성화되고 비회원 체험과 기존 기능은 그대로 동작합니다. Secret은 브라우저 번들 또는 Git 저장소에 포함되지 않습니다.

## 기술 스택

- Next.js 15 / App Router / TypeScript
- Tailwind CSS 4 / Framer Motion / Lucide React / next-themes
- Drizzle ORM / Neon PostgreSQL / `node-postgres`
- Vercel Functions / Fluid compute connection pool

## 출시 품질 기능

- 라이트·다크·시스템 모드 선택 및 기기별 설정 유지
- 설치 가능한 Web App Manifest, maskable 아이콘, iOS 설치 안내, Safe Area 대응
- Service Worker 앱 셸·정적 자원 캐시와 오프라인 홈/미션/명언/캘린더/일지 조회
- 온라인 복귀 시 개인 일지 자동 재동기화
- 공통 Skeleton, Toast, Empty State와 404·500·DB·AI·오프라인 오류 화면
- 키보드 포커스, 본문 바로가기, ARIA 상태, 모션 감소 설정 대응
- 개인정보 처리방침, 이용약관, 문의, 라이선스와 버전 정보

Service Worker는 production 빌드에서만 등록됩니다. 로컬 오프라인 동작은 `npm run build && npm start`로 확인하세요. 개인 API 응답은 캐시하지 않으며, 서비스 워커는 문서와 앱 정적 자원만 저장합니다.

### PWA 설치 확인

1. production 또는 HTTPS 환경에서 앱을 엽니다.
2. 설정에서 `홈 화면에 앱 설치`를 선택합니다.
3. iOS Safari에서는 공유 메뉴의 `홈 화면에 추가`를 선택합니다.
4. 설치 후 네트워크를 끄고 홈, 오늘의 미션, 명언, 캘린더와 저장된 일지를 확인합니다.

## 데이터베이스 아키텍처

- `DATABASE_URL`: 앱 런타임이 사용하는 Neon pooled URL입니다. 호스트에 `-pooler`가 포함된 Vercel 연동 값을 사용합니다.
- `DATABASE_URL_UNPOOLED`: Drizzle migration 전용 direct URL입니다.
- `src/db/index.ts`: 프로세스마다 하나의 `pg.Pool`과 Drizzle 인스턴스를 재사용하고 `attachDatabasePool`로 Vercel Fluid compute 수명 주기에 연결합니다.
- `smile_events`: 익명 기기 해시와 서울 날짜를 저장하는 이벤트 원장입니다. 복합 기본 키로 한 기기당 하루 한 번만 집계합니다.
- `smile_counters`: 전체 이벤트를 매번 세지 않고 단일 행을 원자적으로 증가시키는 집계 테이블입니다.
- `praise_journal_entries`: SHA-256 익명 기기 해시와 날짜를 복합 키로 사용하는 개인 칭찬 일지입니다. 같은 날짜의 수정은 upsert로 즉시 반영됩니다.

브라우저에서 생성한 UUID는 서버에서 SHA-256으로 해시한 뒤 날짜와 함께 저장됩니다. 원본 UUID 및 개인 식별 정보는 데이터베이스에 저장하지 않습니다.

## Neon 연결

1. Vercel 프로젝트의 Marketplace에서 Neon 데이터베이스를 연결합니다.
2. Development, Preview, Production 환경에 `DATABASE_URL`과 `DATABASE_URL_UNPOOLED`이 연결되었는지 확인합니다.
3. 로컬에서는 `.env.example`을 `.env.local`로 복사하고 실제 값을 입력합니다. `.env.local`은 Git에서 제외됩니다.
4. `DATABASE_URL`은 pooled endpoint, `DATABASE_URL_UNPOOLED`은 direct endpoint여야 하며 두 URL 모두 `sslmode=require` 이상의 TLS 설정이 필요합니다. 앱은 `require`와 `verify-ca`를 명시적으로 `verify-full`로 강화해 인증서와 호스트명을 검증합니다.

```bash
cp .env.example .env.local
```

Windows PowerShell에서는 다음 명령을 사용할 수 있습니다.

```powershell
Copy-Item .env.example .env.local
```

## Migration

스키마 변경 후 SQL migration을 생성합니다.

```bash
npm run db:generate -- --name describe_change
npm run db:check
```

검토한 migration은 direct URL을 사용해 적용합니다.

```bash
npm run db:migrate
```

마이그레이션 스크립트는 연결 문자열을 출력하지 않으며, 실패 시 종료 코드 `1`을 반환하고 풀을 안전하게 닫습니다. 배포 빌드 중 자동 migration은 동시 배포 충돌을 피하기 위해 실행하지 않습니다.

## 개발 환경 실행

Node.js 20 이상을 권장합니다.

```bash
npm install
npm run db:migrate
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 검증

```bash
npm run lint
npm run typecheck
npm run db:check
npm run build
npm run format:check
```

## Production 배포

1. Neon의 production branch와 Vercel Production 환경변수 연결을 확인합니다.
2. 배포할 커밋의 migration SQL을 검토합니다.
3. production direct URL로 `npm run db:migrate`를 한 번 실행합니다.
4. GitHub의 `main` 브랜치를 Vercel에 배포합니다.
5. `/api/smiles` 응답과 공용 카운터 증가를 확인합니다.

애플리케이션 URL은 `NEXT_PUBLIC_APP_URL`에 설정합니다. 현재 운영 주소는 [make-one-smile-today.vercel.app](https://make-one-smile-today.vercel.app)입니다.

## 프로젝트 구조

```text
src/
├── app/                    # App Router 페이지와 Route Handlers
├── components/             # 재사용 UI 컴포넌트
│   ├── mission/            # 오늘의 미션과 AI 아이디어
│   ├── calendar/           # 월간 웃음 캘린더
│   ├── journal/            # 오늘의 기록
│   ├── quote/              # 날짜 고정 명언
│   ├── points/             # 포인트 진행 상태
│   └── badge/              # 성취 배지
├── constants/              # 미션·명언·배지·포인트 데이터
├── db/
│   ├── index.ts            # pooled Drizzle client
│   ├── schema.ts           # PostgreSQL schema
│   ├── relations.ts        # Drizzle relations
│   └── migrations/         # 생성·검토된 SQL migrations
├── hooks/                  # 카드·저장·날씨 훅
├── lib/                    # 공통 유틸리티
├── services/               # 로컬 저장소 및 AI 서비스 경계
└── types/                  # 애플리케이션 타입
```

## 스마트 서비스 경계

- AI: `src/services/ai.ts` → `src/app/api/ai/coach/route.ts`로 연결되며 API 키는 서버에서만 읽습니다. 키가 없으면 무료 로컬 스트리밍 응답을 사용합니다.
- 사용자 저장: `src/app/api/activity/sync/route.ts`가 세션을 검증하고 로컬 활동과 Neon 데이터를 병합합니다.
- 가족·친구: `src/app/api/family`와 `src/app/api/friends`가 초대 코드와 관계를 사용자 ID 기준으로 처리합니다.
- 리포트: `src/app/api/reports/weekly`가 주간 데이터를 날짜 키로 한 번 생성해 재사용합니다.
- Premium: `users.plan` entitlement를 서버에서 확인합니다. 실제 결제 연결 시 검증된 결제 Webhook만 이 값을 변경해야 합니다.
- 백그라운드 Push: Service Worker의 push 수신 구조는 준비되어 있습니다. 앱이 완전히 종료된 상태의 원격 Push는 향후 VAPID 구독 저장소와 예약 전송 작업을 연결합니다.
