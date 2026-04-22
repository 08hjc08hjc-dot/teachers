export type UserName = "황주찬" | "이예은" | "김혜원" | "전은지";

export const ALLOWED_USERS: UserName[] = ["황주찬", "이예은", "김혜원", "전은지"];

export interface Milestone {
  id: string;
  phaseId: string;        // 어떤 주차(W1~D-Day)에 속하는지
  title: string;
  done: boolean;
  createdBy: UserName;
  createdAt: number;      // timestamp
  doneAt?: number;
  doneBy?: UserName;
}

export interface Comment {
  id: string;
  milestoneId: string;
  text: string;
  author: UserName;
  createdAt: number;
}

export interface Phase {
  id: string;
  weekLabel: string;      // "W1", "W2", ... , "D-Day"
  badge: string;          // "KICKOFF", "W2", "REVIEW 1", ...
  date: string;           // "4. 24"
  weekday: string;        // "금요일"
  title: string;          // "TF 1차 회의\n방향 설정"
  defaultActions: string[]; // 참고용 기본 액션 리스트
  tone: "kickoff" | "default" | "review" | "dday";
}

export const PHASES: Phase[] = [
  {
    id: "w1",
    weekLabel: "W1",
    badge: "KICKOFF",
    date: "4. 24",
    weekday: "금요일",
    title: "TF 1차 회의\n방향 설정",
    defaultActions: ["기획안 공유", "콘셉트 방향 의견 수렴", "협업 구조 설계", "후배 기수 섭외 계획"],
    tone: "kickoff",
  },
  {
    id: "w2",
    weekLabel: "W2",
    badge: "W2",
    date: "4. 28",
    weekday: "화요일",
    title: "콘셉트 · 모듈 확정\n2차 회의",
    defaultActions: ["콘셉트 최종 선택", "무드보드 · 팔레트 고정", "모듈 선별 & 타임라인 초안", "영상 인터뷰 섭외 시작"],
    tone: "default",
  },
  {
    id: "w3",
    weekLabel: "W3",
    badge: "W3",
    date: "5. 1",
    weekday: "금요일",
    title: "디자인 1차 착수\n영상 촬영",
    defaultActions: ["로고 · 키비주얼 시안", "인쇄물 시안 — 네임카드 · 상장", "축전 영상 인터뷰 촬영"],
    tone: "default",
  },
  {
    id: "w4",
    weekLabel: "W4",
    badge: "REVIEW 1",
    date: "5. 4",
    weekday: "월요일",
    title: "1차 검수 · 자재 견적\n교수님 안내",
    defaultActions: ["TF 1차 검수 · 피드백", "후배 기수 수정안 제작", "자재 견적 정리", "교수님 사전 안내장 발송"],
    tone: "review",
  },
  {
    id: "w5",
    weekLabel: "W5",
    badge: "REVIEW 2",
    date: "5. 7",
    weekday: "목요일",
    title: "2차 검수 · 발주\n영상 편집",
    defaultActions: ["최종안 확정", "인쇄물 · 자재 발주", "영상 1차 편집본 완성"],
    tone: "review",
  },
  {
    id: "w6",
    weekLabel: "W6",
    badge: "FINAL",
    date: "5. 11",
    weekday: "월요일",
    title: "입고 · 최종 검수\n패키징",
    defaultActions: ["인쇄물 입고 · 검수", "영상 최종 수정", "웰컴 키트 패키징"],
    tone: "default",
  },
  {
    id: "dday",
    weekLabel: "D-Day",
    badge: "D-DAY",
    date: "5. 15",
    weekday: "금요일 · 스승의 날",
    title: "본행사",
    defaultActions: ["오전: 세팅 · 리허설 · 브리핑", "오후: 본행사 실행", "전 구간: 현장 기록"],
    tone: "dday",
  },
];
