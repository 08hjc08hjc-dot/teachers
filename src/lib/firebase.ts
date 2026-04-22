import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpVEHMScdvHFvFrLHqlcNwc79fgHASfYg",
  authDomain: "teacher-day-tf.firebaseapp.com",
  projectId: "teacher-day-tf",
  storageBucket: "teacher-day-tf.firebasestorage.app",
  messagingSenderId: "1058582626943",
  appId: "1:1058582626943:web:ebf24c817abcadd1d3754a",
  measurementId: "G-WKR54SGJ3D",
};

let app: FirebaseApp;
let db: Firestore;

export function getFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  return { app, db };
}
