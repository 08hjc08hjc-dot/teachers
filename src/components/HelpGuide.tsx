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
          <h2 className={styles.title}>사용법</h2>
          <p className={styles.subtitle}>스승의 날 TF 작업 대시보드</p>
        </div>

        <div className={styles.body}>
          <Step num="1" title="할 일 추가">
            주차 카드 아래 <Em>+ 마일스톤 추가</Em> 누르고 입력
          </Step>

          <Step num="2" title="완료 체크">
            왼쪽 네모 칸 누르면 완료 처리
          </Step>

          <Step num="3" title="코멘트 남기기">
            할 일 본문 누르면 코멘트 창 열림
          </Step>

          <Step num="4" title="다른 주차 보기">
            좌우 스와이프 또는 위쪽 단계 칩 누르기
          </Step>

          <Step num="5" title="삭제">
            할 일 오른쪽 X 버튼
          </Step>

          <div className={styles.tipBox}>
            <span className={styles.tipIcon}>💡</span>
            <span>4명이 같은 화면을 봐요. 한 명이 추가하면 모두 실시간으로 보여요.</span>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.gotItBtn} onClick={onClose}>
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepNum}>{num}</div>
      <div className={styles.stepBody}>
        <div className={styles.stepTitle}>{title}</div>
        <div className={styles.stepDesc}>{children}</div>
      </div>
    </div>
  );
}

function Em({ children }: { children: React.ReactNode }) {
  return <span className={styles.em}>{children}</span>;
}
