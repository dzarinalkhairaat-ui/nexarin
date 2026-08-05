import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

let adminAuthInstance = null;

function getAdminAuth() {
  if (adminAuthInstance) return adminAuthInstance;

  if (!getApps().length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin config tidak lengkap. Pastikan NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY sudah diatur."
      );
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  adminAuthInstance = getAuth();
  return adminAuthInstance;
}

export { getAdminAuth };
