"use client";

import {
  collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot,
} from "firebase/firestore";
import { getFirebase } from "./firebase";
import { Milestone, Comment, UserName } from "@/types";

export function subscribeMilestones(cb: (items: Milestone[]) => void) {
  const { db } = getFirebase();
  const q = query(collection(db, "milestones"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Milestone, "id">) }));
    cb(items);
  });
}

export async function addMilestone(phaseId: string, title: string, user: UserName) {
  const { db } = getFirebase();
  await addDoc(collection(db, "milestones"), {
    phaseId,
    title: title.trim(),
    done: false,
    createdBy: user,
    createdAt: Date.now(),
  });
}

export async function toggleMilestone(m: Milestone, user: UserName) {
  const { db } = getFirebase();
  const ref = doc(db, "milestones", m.id);
  if (!m.done) {
    await updateDoc(ref, { done: true, doneAt: Date.now(), doneBy: user });
  } else {
    await updateDoc(ref, { done: false, doneAt: null, doneBy: null });
  }
}

export async function deleteMilestone(id: string) {
  const { db } = getFirebase();
  await deleteDoc(doc(db, "milestones", id));
}

export function subscribeComments(milestoneId: string, cb: (items: Comment[]) => void) {
  const { db } = getFirebase();
  const q = query(
    collection(db, "milestones", milestoneId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }));
    cb(items);
  });
}

export async function addComment(milestoneId: string, text: string, author: UserName) {
  const { db } = getFirebase();
  await addDoc(collection(db, "milestones", milestoneId, "comments"), {
    milestoneId,
    text: text.trim(),
    author,
    createdAt: Date.now(),
  });
}

export async function deleteComment(milestoneId: string, commentId: string) {
  const { db } = getFirebase();
  await deleteDoc(doc(db, "milestones", milestoneId, "comments", commentId));
}
