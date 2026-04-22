"use client";

import { useEffect } from "react";
import styles from "./HelpGuide.module.css";

interface Props {
  onClose: () => void;
}

export function HelpGuide({ onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            HOW TO USE
          </div>
          <h2 className={styles.title}>스승의 날 TF<br />대시보드 사용법</h2>
          <p className={styles.subtitle}>이 도구로 우리가 무얼 어떻게 할지 안내해요</p>
        </div>

        <div className={styles.body}>
          {/* 무엇을 위한 도구인가 */}
          <Section icon="🎯" title="이게 뭔가요?">
            <p>
              2026 스승의 날 행사를 함께 준비하기 위한 TF 전용 작업 진행 대시보드예요.
              4명(황주찬·이예은·김혜원·전은지)이 같은 화면을 보면서 마일스톤을 등록·체크하고
              코멘트로 소통합니다. 모든 변경사항은 <Strong>실시간으로 동기화</Strong>돼요.
            </p>
          </Section>

          {/* 로그인 */}
          <Section icon="👤" title="로그인">
            <ol className={styles.list}>
              <li>이름을 직접 입력하거나, 하단 멤버 칩을 눌러 자동 입력</li>
              <li>4명 외의 이름은 로그인 불가</li>
              <li>한 번 로그인하면 같은 브라우저에서는 자동 유지</li>
              <li>우측 상단 <Strong>로그아웃</Strong> 버튼으로 종료</li>
            </ol>
          </Section>

          {/* 카운트다운 */}
          <Section icon="⏱" title="카운트다운">
            <p>
              상단 검은색 박스는 본행사(2026. 5. 15 금)까지 남은 시간을
              <Strong> 1초마다 자동 갱신</Strong>해서 보여줘요. D-Day 당일이 되면
              자동으로 빨간색 "D-DAY" 화면으로 전환됩니다.
            </p>
          </Section>

          {/* 진행률 */}
          <Section icon="📊" title="진행률">
            <p>
              7개 타임라인이 각각 <Strong>14%씩 균등 가중치</Strong>를 가져요.
              한 단계 안에 마일스톤이 5개 있고 3개가 완료되면, 그 단계는 60% 진행 →
              전체 진행률에는 약 8.6%(60% × 1/7) 만큼 반영됩니다.
            </p>
          </Section>

          {/* 타임라인 이동 */}
          <Section icon="🧭" title="타임라인 이동">
            <ul className={styles.list}>
              <li><Strong>PC:</Strong> 좌우 화살표 버튼, 키보드 ← →, 상단 단계 칩 클릭</li>
              <li><Strong>모바일:</Strong> 좌우 스와이프, 화살표 버튼, 단계 칩 탭</li>
              <li>현재 단계는 더 또렷하게, 다른 단계는 흐리게 표시돼요</li>
            </ul>
          </Section>

          {/* 마일스톤 */}
          <Section icon="✅" title="마일스톤 등록 · 체크 · 삭제">
            <ol className={styles.list}>
              <li>각 주차 카드 하단의 <Strong>"+ 마일스톤 추가"</Strong> 클릭</li>
              <li>제목 입력 후 Enter (취소는 Esc)</li>
              <li>왼쪽 체크박스로 완료/미완료 토글 — 작성자 · 완료자 · 시각이 자동 기록</li>
              <li>모바일은 항상, PC는 hover 시 우측 X 버튼으로 삭제 가능</li>
              <li>누구나 누구의 마일스톤이든 체크·삭제 가능 (의도된 단순함)</li>
            </ol>
          </Section>

          {/* 코멘트 */}
          <Section icon="💬" title="코멘트로 소통">
            <ol className={styles.list}>
              <li>마일스톤 본문을 클릭하면 상세 모달이 열려요</li>
              <li>하단 입력창에 메시지 작성 후 <Strong>⌘+Enter</Strong> (Mac) / <Strong>Ctrl+Enter</Strong> (Win)</li>
              <li>본인이 쓴 코멘트는 우측 "삭제" 버튼으로 삭제 가능</li>
              <li>Esc 또는 배경 클릭으로 모달 닫기</li>
            </ol>
          </Section>

          {/* 협업 원칙 */}
          <Section icon="🤝" title="우리의 협업 원칙">
            <ul className={styles.list}>
              <li>고정된 역할 분담보다 <Strong>유기적인 소통</Strong>으로 진행</li>
              <li>혼자 막히지 말고 코멘트로 빠르게 공유</li>
              <li>실행 노동은 후배 기수에게, 디렉션·검수는 TF가 책임</li>
              <li>완벽한 1안보다 빠른 시안 → 검수 → 수정 사이클로</li>
            </ul>
          </Section>

          {/* 단계 컬러 */}
          <Section icon="🎨" title="단계별 컬러 의미">
            <div className={styles.colorGrid}>
              <div className={styles.colorItem}>
                <div className={`${styles.colorDot} ${styles.colorGreen}`} />
                <div>
                  <Strong>KICKOFF</Strong>
                  <span className={styles.colorDesc}>W1 — 시작 단계</span>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={`${styles.colorDot} ${styles.colorBlue}`} />
                <div>
                  <Strong>일반 단계</Strong>
                  <span className={styles.colorDesc}>W2 · W3 · W6</span>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={`${styles.colorDot} ${styles.colorYellow}`} />
                <div>
                  <Strong>REVIEW</Strong>
                  <span className={styles.colorDesc}>W4 · W5 — 검수 단계</span>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={`${styles.colorDot} ${styles.colorRed}`} />
                <div>
                  <Strong>D-DAY</Strong>
                  <span className={styles.colorDesc}>5월 15일 본행사</span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className={styles.footer}>
          <button className={styles.gotItBtn} onClick={onClose}>
            확인했어요
          </button>
          <p className={styles.footerHint}>
            언제든 우측 상단 <Strong>"사용법"</Strong> 버튼으로 다시 열 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>{icon}</span>
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className={styles.strong}>{children}</strong>;
}
