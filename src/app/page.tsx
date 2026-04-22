"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ALLOWED_USERS } from "@/types";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = login(name);
    if (!result.ok) {
      setError(result.error || "로그인 실패");
      return;
    }
    router.push("/dashboard");
  };

  if (loading) return null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.eyebrow}>TF DASHBOARD</div>
        <h1 className={styles.title}>2026 스승의 날<br />행사 준비 대시보드</h1>
        <p className={styles.subtitle}>이름을 입력하고 로그인하세요</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="이름 입력"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            autoFocus
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.button} disabled={!name.trim()}>
            로그인
          </button>
        </form>

        <div className={styles.hint}>
          <div className={styles.hintLabel}>TF 멤버</div>
          <div className={styles.hintList}>
            {ALLOWED_USERS.map((u) => (
              <button
                key={u}
                type="button"
                className={styles.hintChip}
                onClick={() => setName(u)}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
