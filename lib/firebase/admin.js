/**
 * Verifikasi Firebase ID Token menggunakan Node.js built-in crypto.
 * TIDAK menggunakan firebase-admin SDK agar terbebas dari konflik ESM (jose/jwks-rsa).
 * Tetap 100% aman: memverifikasi signature JWT menggunakan Google Public Keys.
 */

import { createVerify } from "node:crypto";

function decodeBase64Url(str) {
  return Buffer.from(str, "base64url").toString("utf8");
}

/**
 * Ambil Google Public Keys untuk Firebase token verification.
 * Di-cache 1 jam sesuai standar Firebase.
 */
async function getGooglePublicKeys() {
  const response = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
    { next: { revalidate: 3600 } }
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil Google Public Keys.");
  }
  return response.json();
}

/**
 * Verifikasi Firebase ID Token secara manual (tanpa firebase-admin).
 * @param {string} idToken - Firebase ID token dari client
 * @returns {{ email: string, uid: string }} - Decoded token payload
 */
export async function verifyFirebaseIdToken(idToken) {
  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Format JWT tidak valid.");
  }

  const [rawHeader, rawPayload, rawSignature] = parts;

  let header, payload;
  try {
    header = JSON.parse(decodeBase64Url(rawHeader));
    payload = JSON.parse(decodeBase64Url(rawPayload));
  } catch {
    throw new Error("Gagal mendekode JWT.");
  }

  // --- Verifikasi Claims ---
  const now = Math.floor(Date.now() / 1000);
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID belum diatur.");
  }
  if (payload.exp < now) {
    throw new Error("Token sudah kedaluwarsa.");
  }
  if (payload.iat > now + 300) {
    throw new Error("Token diterbitkan di masa depan (clock skew).");
  }
  if (payload.aud !== projectId) {
    throw new Error(`Audience token tidak cocok: ${payload.aud}`);
  }
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error(`Issuer token tidak valid: ${payload.iss}`);
  }
  if (!payload.sub || payload.sub.length === 0) {
    throw new Error("Token tidak memiliki subject (uid).");
  }
  if (header.alg !== "RS256") {
    throw new Error(`Algoritma tidak didukung: ${header.alg}`);
  }

  // --- Verifikasi Signature ---
  const publicKeys = await getGooglePublicKeys();
  const publicKey = publicKeys[header.kid];

  if (!publicKey) {
    throw new Error(`Public key tidak ditemukan untuk kid: ${header.kid}`);
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${rawHeader}.${rawPayload}`);
  const isValid = verifier.verify(publicKey, rawSignature, "base64url");

  if (!isValid) {
    throw new Error("Signature JWT tidak valid.");
  }

  return {
    email: payload.email || payload.firebase?.identities?.email?.[0] || null,
    uid: payload.sub,
  };
}
