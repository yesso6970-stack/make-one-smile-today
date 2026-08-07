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

개인 미션·포인트는 인증이 없는 STEP 2에서는 `src/services/daily-storage.ts`의 버전 관리된 브라우저 저장소 어댑터를 사용합니다. 칭찬 일지는 Neon PostgreSQL에 익명 기기 해시와 날짜별로 분리 저장되며, 네트워크가 없을 때는 브라우저에 먼저 저장됩니다. 로그인 전에는 같은 기기·브라우저에서만 자신의 일지를 다시 불러올 수 있습니다.

## 기술 스택

- Next.js 15 / App Router / TypeScript
- Tailwind CSS 4 / Framer Motion / Lucide React / next-themes
- Drizzle ORM / Neon PostgreSQL / `node-postgres`
- Vercel Functions / Fluid compute connection pool

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

## 이후 서비스 연동 위치

- OpenAI: `src/services/ai.ts`의 `recommendSmileIdea` 구현만 서버 Route Handler 호출로 교체합니다. API 키는 클라이언트에 노출하지 않습니다.
- 개인 Neon 저장: 인증 도입 후 `daily_mission_completions`, `daily_journals`, `user_points`, `user_badges` 테이블을 `src/db/schema.ts`에 추가하고 `src/db/migrations`로 배포합니다.
- 저장 API: 사용자 세션을 검증하는 `src/app/api/daily/*` Route Handler에서 Drizzle을 호출하고 `src/services/daily-storage.ts`와 동일한 인터페이스로 연결합니다.
