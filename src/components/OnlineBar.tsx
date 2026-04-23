"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { subscribePresence, startPresence, PresenceEntry } from "@/lib/presence";
import styles from "./OnlineBar.module.css";

export function OnlineBar() {
  const { user } = useAuth();
  const [online, setOnline] = useState<PresenceEntry[]>([]);

  // 내 presence 송신
  useEffect(() => {
    if (!user) return;
    const cleanup = startPresence(user);
    return cleanup;
  }, [user]);

  // 전체 presence 구독
  useEffect(() => {
    const unsub = subscribePresence(setOnline);
    // 온라인 판별 시간 임계값을 넘는 유저를 제거하려면 주기적 재계산 필요
    const tick = setInterval(() => {
      setOnline((prev) => [...prev]); // threshold 재평가는 subscribe 안에서 처리됨
    }, 15_000);
    return () => {
      unsub();
      clearInterval(tick);
    };
  }, []);

  if (!user) return null;

  // 정렬: 내가 먼저, 나머지는 이름 가나다순
  const sorted = [...online].sort((a, b) => {
    if (a.userName === user) return -1;
    if (b.userName === user) return 1;
    return a.userName.localeCompare(b.userName);
  });

  return (
    <div className={styles.bar}>
      <div className={styles.label}>
        <span className={styles.pulseDot} />
        지금 접속 중
        <span className={styles.count}>{sorted.length}</span>
      </div>
      <div className={styles.chips}>
        {sorted.map((e) => {
          const isMe = e.userName === user;
          return (
            <div key={e.userName} className={`${styles.chip} ${isMe ? styles.chipMe : ""}`}>
              <span className={styles.avatar}>{e.userName[0]}</span>
              <span className={styles.name}>{e.userName}</span>
              {isMe && <span className={styles.meTag}>나</span>}
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className={styles.empty}>연결 중…</div>
        )}
      </div>
    </div>
  );
}
