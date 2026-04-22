"use client";

import { useState } from "react";
import { Phase, Milestone } from "@/types";
import { useAuth } from "@/lib/auth";
import { addMilestone, toggleMilestone, deleteMilestone } from "@/lib/data";
import styles from "./PhaseCard.module.css";

interface Props {
  phase: Phase;
  milestones: Milestone[];
  onSelectMilestone: (id: string) => void;
}

export function PhaseCard({ phase, milestones, onSelectMilestone }: Props) {
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  if (!user) return null;

  const doneCount = milestones.filter((m) => m.done).length;
  const totalCount = milestones.length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await addMilestone(phase.id, newTitle, user);
    setNewTitle("");
    setAdding(false);
  };

  const handleToggle = async (m: Milestone) => {
    await toggleMilestone(m, user);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("이 마일스톤을 삭제할까요?")) {
      await deleteMilestone(id);
    }
  };

  return (
    <div className={`${styles.step} ${styles[phase.tone]}`}>
      <div className={styles.stepHeader}>
        <span className={styles.stepBadge}>{phase.badge}</span>
        <div className={styles.stepCircle}>
          {phase.id === "dday" ? "D" : phase.weekLabel}
        </div>
        <div className={styles.stepDate}>{phase.date}</div>
        <div className={styles.stepWeekday}>{phase.weekday}</div>
      </div>

      <div className={styles.stepCard}>
        <div className={styles.stepTitle}>
          {phase.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < phase.title.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>

        {totalCount > 0 && (
          <div className={styles.miniProgress}>
            <div className={styles.miniProgressBar}>
              <div
                className={styles.miniProgressFill}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className={styles.miniProgressText}>
              {doneCount} / {totalCount}
            </div>
          </div>
        )}

        <div className={styles.defaultActions}>
          <div className={styles.defaultActionsLabel}>참고 액션</div>
          {phase.defaultActions.map((a, i) => (
            <div key={i} className={styles.defaultAction}>{a}</div>
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.milestones}>
          <div className={styles.milestonesHeader}>
            <span>마일스톤</span>
            <span className={styles.milestonesCount}>{totalCount}</span>
          </div>

          {milestones.map((m) => (
            <div
              key={m.id}
              className={`${styles.milestone} ${m.done ? styles.done : ""}`}
              onClick={() => onSelectMilestone(m.id)}
            >
              <button
                className={styles.check}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(m);
                }}
                aria-label="완료 토글"
              >
                {m.done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5L5 9L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <div className={styles.milestoneBody}>
                <div className={styles.milestoneTitle}>{m.title}</div>
                <div className={styles.milestoneMeta}>
                  <span>{m.createdBy}</span>
                  <span className={styles.metaDot}>·</span>
                  <span>{formatDate(m.createdAt)}</span>
                </div>
              </div>
              <button
                className={styles.delete}
                onClick={(e) => handleDelete(m.id, e)}
                aria-label="삭제"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}

          {adding ? (
            <div className={styles.addForm}>
              <input
                className={styles.addInput}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") {
                    setAdding(false);
                    setNewTitle("");
                  }
                }}
                placeholder="마일스톤 제목"
                autoFocus
              />
              <div className={styles.addActions}>
                <button className={styles.addCancel} onClick={() => { setAdding(false); setNewTitle(""); }}>
                  취소
                </button>
                <button className={styles.addConfirm} onClick={handleAdd} disabled={!newTitle.trim()}>
                  추가
                </button>
              </div>
            </div>
          ) : (
            <button className={styles.addBtn} onClick={() => setAdding(true)}>
              <span className={styles.addIcon}>+</span> 마일스톤 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}
