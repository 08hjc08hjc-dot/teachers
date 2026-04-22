"use client";

import { useEffect, useState } from "react";
import { Milestone, Comment } from "@/types";
import { useAuth } from "@/lib/auth";
import { subscribeComments, addComment, deleteComment, toggleMilestone } from "@/lib/data";
import styles from "./MilestoneDetail.module.css";

interface Props {
  milestone: Milestone;
  onClose: () => void;
}

export function MilestoneDetail({ milestone, onClose }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = subscribeComments(milestone.id, setComments);
    return () => unsub();
  }, [milestone.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await addComment(milestone.id, text, user);
    setText("");
    setSubmitting(false);
  };

  const handleToggle = async () => {
    await toggleMilestone(milestone, user);
  };

  const handleDeleteComment = async (id: string) => {
    if (confirm("코멘트를 삭제할까요?")) {
      await deleteComment(milestone.id, id);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>

        <div className={styles.header}>
          <button
            className={`${styles.check} ${milestone.done ? styles.checked : ""}`}
            onClick={handleToggle}
          >
            {milestone.done && (
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.5L5 9L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <div className={styles.headerBody}>
            <h2 className={`${styles.title} ${milestone.done ? styles.doneTitle : ""}`}>
              {milestone.title}
            </h2>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>작성</span>
                <span className={styles.metaValue}>{milestone.createdBy}</span>
                <span className={styles.metaDate}>{formatFull(milestone.createdAt)}</span>
              </span>
              {milestone.done && milestone.doneBy && milestone.doneAt && (
                <span className={styles.metaItem}>
                  <span className={`${styles.metaLabel} ${styles.doneLabel}`}>완료</span>
                  <span className={styles.metaValue}>{milestone.doneBy}</span>
                  <span className={styles.metaDate}>{formatFull(milestone.doneAt)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.commentsHeader}>
            <span>코멘트</span>
            <span className={styles.count}>{comments.length}</span>
          </div>

          <div className={styles.commentList}>
            {comments.length === 0 && (
              <div className={styles.empty}>아직 코멘트가 없어요</div>
            )}
            {comments.map((c) => (
              <div key={c.id} className={styles.comment}>
                <div className={styles.commentHead}>
                  <span className={styles.commentAuthor}>{c.author}</span>
                  <span className={styles.commentDate}>{formatFull(c.createdAt)}</span>
                  {c.author === user && (
                    <button
                      className={styles.commentDelete}
                      onClick={() => handleDeleteComment(c.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className={styles.commentText}>{c.text}</div>
              </div>
            ))}
          </div>

          <div className={styles.inputRow}>
            <textarea
              className={styles.commentInput}
              placeholder="코멘트 남기기..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
              rows={3}
            />
            <div className={styles.inputActions}>
              <div className={styles.inputHint}>⌘ + Enter</div>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
              >
                {submitting ? "등록 중..." : "코멘트 등록"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFull(ts: number): string {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min}`;
}
