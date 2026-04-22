"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { PHASES, Milestone } from "@/types";
import { subscribeMilestones } from "@/lib/data";
import { PhaseCard } from "@/components/PhaseCard";
import { MilestoneDetail } from "@/components/MilestoneDetail";
import { Countdown } from "@/components/Countdown";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeMilestones(setMilestones);
    return () => unsub();
  }, [user]);

  // 화면 크기 감지
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // activeIndex 변경 시 해당 카드로 스크롤 이동
  useEffect(() => {
    if (!timelineRef.current || !wrapperRef.current) return;
    const cards = timelineRef.current.querySelectorAll<HTMLElement>(`.${styles.phaseSlot}`);
    const target = cards[activeIndex];
    if (!target) return;

    const wrapper = wrapperRef.current;
    const wrapperWidth = wrapper.clientWidth;
    const targetLeft = target.offsetLeft;
    const targetWidth = target.offsetWidth;
    const offset = targetLeft - (wrapperWidth - targetWidth) / 2;

    wrapper.scrollTo({ left: offset, behavior: "smooth" });
  }, [activeIndex, isMobile]);

  // 키보드 좌우 화살표
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedMilestoneId) return; // 모달 열려있으면 무시
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMilestoneId]);

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(PHASES.length - 1, i + 1));

  // 모바일 스와이프
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (dx > threshold) goPrev();
    else if (dx < -threshold) goNext();
    touchStartX.current = null;
  };

  if (loading || !user) return null;

  // 각 타임라인이 동일한 가중치(1/N)를 가지고, 각자 내부 완료율에 비례하여 전체 진행률 계산
  const phaseProgressList = PHASES.map((phase) => {
    const items = milestones.filter((m) => m.phaseId === phase.id);
    if (items.length === 0) return 0;
    const done = items.filter((m) => m.done).length;
    return done / items.length;
  });
  const progressPct = Math.round(
    (phaseProgressList.reduce((a, b) => a + b, 0) / PHASES.length) * 100
  );

  const totalCount = milestones.length;
  const doneCount = milestones.filter((m) => m.done).length;

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) || null;
  const activePhase = PHASES[activeIndex];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrow}>TF DASHBOARD · LIVE</div>
          <h1 className={styles.title}>2026 스승의 날 기념 행사</h1>
          <p className={styles.subtitle}>각 일정에 마일스톤을 등록하고 체크하세요</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userChip}>
            <div className={styles.userLabel}>로그인</div>
            <div className={styles.userName}>{user}</div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>로그아웃</button>
        </div>
      </header>

      <Countdown />

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>킥오프</div>
          <div className={styles.statValue}>
            4. 24 <span className={styles.statSmall}>금</span>
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>본행사</div>
          <div className={`${styles.statValue} ${styles.accent}`}>
            5. 15 <span className={styles.statSmall}>금</span>
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>등록된 마일스톤</div>
          <div className={styles.statValue}>{totalCount}<span className={styles.statSmall}>개</span></div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>완료</div>
          <div className={styles.statValue}>{doneCount}<span className={styles.statSmall}>개</span></div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressTop}>
          <div className={styles.progressTitle}>전체 진행률</div>
          <div className={styles.progressPct}>{progressPct}%</div>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
        <div className={styles.progressHint}>
          타임라인 {PHASES.length}개 · 각 단계 {Math.round(100 / PHASES.length)}%씩 균등 배분
        </div>
      </div>

      {/* 페이지네이션 도트 */}
      <div className={styles.dots}>
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""} ${styles[`dot_${p.tone}`]}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`${p.weekLabel} 단계로 이동`}
          >
            <span className={styles.dotLabel}>{p.weekLabel}</span>
          </button>
        ))}
      </div>

      <div className={styles.timelineSection}>
        {/* 좌측 버튼 */}
        <button
          className={`${styles.navBtn} ${styles.navPrev}`}
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="이전 단계"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div
          className={styles.timelineWrapper}
          ref={wrapperRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.timeline} ref={timelineRef}>
            {PHASES.map((phase, i) => {
              const items = milestones.filter((m) => m.phaseId === phase.id);
              return (
                <div
                  key={phase.id}
                  className={`${styles.phaseSlot} ${i === activeIndex ? styles.phaseSlotActive : ""}`}
                >
                  <PhaseCard
                    phase={phase}
                    milestones={items}
                    onSelectMilestone={setSelectedMilestoneId}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 버튼 */}
        <button
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={goNext}
          disabled={activeIndex === PHASES.length - 1}
          aria-label="다음 단계"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 모바일 단계 인디케이터 */}
      <div className={styles.mobileIndicator}>
        <span className={styles.mobileCurrent}>{activePhase.weekLabel}</span>
        <span className={styles.mobileSep}>·</span>
        <span>{activePhase.date}</span>
        <span className={styles.mobileSep}>·</span>
        <span className={styles.mobileCount}>{activeIndex + 1} / {PHASES.length}</span>
      </div>

      {selectedMilestone && (
        <MilestoneDetail
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestoneId(null)}
        />
      )}
    </div>
  );
}
