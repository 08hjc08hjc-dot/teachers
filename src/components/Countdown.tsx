"use client";

import { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

// 본행사: 2026년 5월 15일 (금) 오전 9시 기준
const TARGET = new Date("2026-05-15T09:00:00+09:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function calc(): TimeLeft {
  const diff = TARGET - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, totalMs: diff };
}

export function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    // SSR/초기 렌더링 시 깜박임 방지를 위해 자리만 잡기
    return (
      <div className={styles.box}>
        <div className={styles.placeholder} />
      </div>
    );
  }

  if (time.totalMs <= 0) {
    return (
      <div className={`${styles.box} ${styles.boxDday}`}>
        <div className={styles.label}>오늘은</div>
        <div className={styles.dday}>D-DAY</div>
        <div className={styles.sublabel}>2026 스승의 날 · 5월 15일</div>
      </div>
    );
  }

  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} />
          COUNTDOWN TO D-DAY
        </div>
        <div className={styles.targetLabel}>2026. 5. 15 (금) 09:00</div>
      </div>

      <div className={styles.dDay}>
        D-<span className={styles.dDayNum}>{time.days}</span>
      </div>

      <div className={styles.units}>
        <Unit label="일" value={time.days} pad={3} />
        <Sep />
        <Unit label="시간" value={time.hours} pad={2} />
        <Sep />
        <Unit label="분" value={time.minutes} pad={2} />
        <Sep />
        <Unit label="초" value={time.seconds} pad={2} accent />
      </div>
    </div>
  );
}

function Unit({ label, value, pad, accent }: { label: string; value: number; pad: number; accent?: boolean }) {
  return (
    <div className={styles.unit}>
      <div className={`${styles.unitValue} ${accent ? styles.unitValueAccent : ""}`}>
        {String(value).padStart(pad, "0")}
      </div>
      <div className={styles.unitLabel}>{label}</div>
    </div>
  );
}

function Sep() {
  return <div className={styles.sep}>:</div>;
}
