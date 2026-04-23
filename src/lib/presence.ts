"use client";

import {
  collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { getFirebase } from "./firebase";
import { UserName } from "@/types";

export interface PresenceEntry {
  userName: UserName;
  lastSeen: number;
}

const HEARTBEAT_MS = 30_000;   // 30초마다 heartbeat (무료 한도 안전 마진)
const ONLINE_THRESHOLD_MS = 70_000; // 70초 이내면 온라인 간주 (heartbeat 2회분 여유)

/**
 * 현재 사용자의 접속 상태를 Firestore에 기록하고,
 * 주기적으로 heartbeat 송신. 탭 닫힐 때 정리.
 * 반환값: cleanup 함수
 */
export function startPresence(user: UserName): () => void {
  const { db } = getFirebase();
  const ref = doc(db, "presence", user);

  const ping = async () => {
    try {
      await setDoc(ref, { userName: user, lastSeen: Date.now() });
    } catch (e) {
      // 일시적 네트워크 에러는 무시
    }
  };

  // 즉시 1회 + 주기 송신
  ping();
  const interval = setInterval(ping, HEARTBEAT_MS);

  // 탭 종료/숨김 시 정리
  const handleUnload = () => {
    // beforeunload 시점엔 async 호출이 완료 안 될 수 있어 best-effort
    deleteDoc(ref).catch(() => {});
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      ping();
    }
  };

  window.addEventListener("beforeunload", handleUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    clearInterval(interval);
    window.removeEventListener("beforeunload", handleUnload);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    deleteDoc(ref).catch(() => {});
  };
}

/**
 * presence 컬렉션을 구독하여 현재 온라인 유저 목록을 반환.
 */
export function subscribePresence(cb: (online: PresenceEntry[]) => void) {
  const { db } = getFirebase();
  return onSnapshot(collection(db, "presence"), (snap) => {
    const now = Date.now();
    const entries: PresenceEntry[] = snap.docs
      .map((d) => d.data() as PresenceEntry)
      .filter((e) => e.lastSeen && now - e.lastSeen < ONLINE_THRESHOLD_MS);
    cb(entries);
  });
}
