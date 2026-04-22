# 2026 스승의 날 TF 대시보드

토스 스타일 UI · 실시간 동기화 · 이름 기반 간이 로그인으로 구성된 Next.js 14 + Firebase Firestore 대시보드입니다.

---

## 주요 기능

- **이름 기반 로그인** — 황주찬 / 이예은 / 김혜원 / 전은지 4명 화이트리스트
- **가로 타임라인** — W1(4/24)부터 D-Day(5/15)까지 주차별 카드 UI
- **마일스톤 관리** — 각 주차에 자유롭게 등록 · 체크 · 삭제. 작성자 · 완료자 자동 기록
- **코멘트** — 마일스톤마다 쓰레드형 코멘트 (실시간 동기화)
- **진행률** — 주차별 미니 진행바 + 전체 진행률 표시
- **실시간 동기화** — 4명이 동시에 작업해도 즉시 반영 (Firestore `onSnapshot`)

---

## 설치 순서

### 1. Firebase 프로젝트 세팅

1. [Firebase 콘솔](https://console.firebase.google.com/) 접속 → **프로젝트 만들기**
2. 프로젝트 이름: `teacher-day-tf` (원하는 이름으로)
3. Google Analytics: 선택 (꺼도 무방)
4. 좌측 메뉴 → **빌드 > Firestore Database** → **데이터베이스 만들기**
   - 위치: `asia-northeast3 (Seoul)` 권장
   - 시작 모드: **테스트 모드로 시작** (아래에서 규칙으로 전환)
5. 좌측 상단 **프로젝트 개요 옆 톱니바퀴** → **프로젝트 설정**
6. **내 앱** 섹션 → **</>** 웹 아이콘 클릭 → 앱 등록
7. 표시되는 `firebaseConfig` 값을 복사해둡니다.

### 2. 보안 규칙 설정

Firebase 콘솔 → **Firestore Database** → **규칙** 탭에서 아래를 붙여넣고 **게시**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /milestones/{milestoneId} {
      allow read, write: if true;
      match /comments/{commentId} {
        allow read, write: if true;
      }
    }
  }
}
```

> ⚠️ 이 규칙은 TF 4명만 쓰는 내부 도구 기준입니다. 외부 공개용이라면 Firebase Auth 연동이 추가로 필요합니다.

### 3. 프로젝트 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Firebase 콘솔에서 복사한 값을 채웁니다:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teacher-day-tf.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=teacher-day-tf
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teacher-day-tf.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

### 4. 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 배포 (Vercel 권장)

1. [Vercel](https://vercel.com/) 로그인 → **Add New > Project**
2. GitHub 저장소 연결 (혹은 CLI `vercel` 명령어)
3. **Environment Variables** 탭에서 `.env.local`의 6개 키를 모두 입력
4. **Deploy** 클릭 → 1~2분 후 배포 완료
5. 생성된 URL을 TF 카톡에 공유

---

## 사용법

### 로그인
- 첫 진입 시 이름 입력 (또는 하단 TF 멤버 칩 클릭)
- 로그인 상태는 localStorage에 저장 → 새로고침/재접속해도 유지
- 우측 상단 "로그아웃" 버튼으로 로그아웃

### 마일스톤 추가
1. 원하는 주차 카드 하단의 **"+ 마일스톤 추가"** 클릭
2. 제목 입력 → Enter 또는 추가 버튼
3. ESC로 취소

### 마일스톤 체크
- 체크박스 클릭으로 완료/미완료 토글
- 완료 시 자동으로 완료자·완료 시각 기록

### 마일스톤 삭제
- 마일스톤에 마우스 올리면 우측에 X 버튼 표시
- 클릭 시 확인 후 삭제

### 코멘트
- 마일스톤 본문 클릭 → 상세 모달 오픈
- 하단 텍스트 영역에 입력 → `⌘+Enter` (Mac) / `Ctrl+Enter` (Win) 또는 등록 버튼
- 자기가 쓴 코멘트는 우측 "삭제" 버튼으로 제거 가능
- ESC 또는 배경 클릭으로 모달 닫기

---

## 기술 스택

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Firebase Firestore** (실시간 동기화)
- **CSS Modules** (토스 스타일 디자인 시스템)
- **Pretendard Variable** (국문 산세리프)

---

## 디렉터리 구조

```
src/
├── types/index.ts              유저 · 마일스톤 · Phase 타입 정의
├── lib/
│   ├── firebase.ts              Firebase 초기화
│   ├── auth.tsx                 이름 기반 로그인 Context
│   └── data.ts                  Firestore CRUD + 실시간 구독
├── app/
│   ├── globals.css              토스 컬러 토큰
│   ├── layout.tsx               Root layout + AuthProvider
│   ├── page.tsx                 로그인 페이지 ("/")
│   ├── login.module.css
│   └── dashboard/
│       ├── page.tsx             대시보드 ("/dashboard")
│       └── dashboard.module.css
└── components/
    ├── PhaseCard.tsx            타임라인 주차 카드
    ├── PhaseCard.module.css
    ├── MilestoneDetail.tsx      코멘트 모달
    └── MilestoneDetail.module.css
```

---

## 데이터 구조 (Firestore)

```
milestones (collection)
└── {milestoneId} (document)
    ├── phaseId: string        ("w1", "w2", ... , "dday")
    ├── title: string
    ├── done: boolean
    ├── createdBy: string      (유저 이름)
    ├── createdAt: number      (timestamp)
    ├── doneBy?: string
    ├── doneAt?: number
    └── comments (subcollection)
        └── {commentId} (document)
            ├── milestoneId: string
            ├── text: string
            ├── author: string
            └── createdAt: number
```

---

## TF 멤버 변경하기

`src/types/index.ts`의 `ALLOWED_USERS` 배열을 수정:

```typescript
export const ALLOWED_USERS: UserName[] = ["황주찬", "이예은", "김혜원", "전은지"];
```

타입도 함께 수정:

```typescript
export type UserName = "황주찬" | "이예은" | "김혜원" | "전은지";
```

---

## 타임라인 단계 변경하기

`src/types/index.ts`의 `PHASES` 배열 수정. 필드:

- `id` — 고유 ID
- `weekLabel` — 원 안에 표시될 짧은 라벨 (예: "W1")
- `badge` — 상단 뱃지 텍스트 (예: "KICKOFF")
- `date` — 날짜 (예: "4. 24")
- `weekday` — 요일 (예: "금요일")
- `title` — 카드 제목, `\n`으로 줄바꿈 가능
- `defaultActions` — 참고용 기본 액션 리스트
- `tone` — `"kickoff" | "default" | "review" | "dday"` (컬러 테마)
