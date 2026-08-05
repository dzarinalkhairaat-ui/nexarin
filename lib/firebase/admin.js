import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export const adminAuth = getAuth();
