# Make One Smile Today 😊

하루 한 사람에게 작은 미소를 선물하는 모바일 퍼스트 PWA입니다. 대상별 웃음 카드, 날짜·계절·날씨에 맞춘 콘텐츠, 칭찬 스티커와 공용 미소 카운터를 제공합니다.

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
├── constants/              # 정적 카드 데이터
├── db/
│   ├── index.ts            # pooled Drizzle client
│   ├── schema.ts           # PostgreSQL schema
│   ├── relations.ts        # Drizzle relations
│   └── migrations/         # 생성·검토된 SQL migrations
├── hooks/                  # 카드·저장·날씨 훅
├── lib/                    # 공통 유틸리티
└── types/                  # 애플리케이션 타입
```
