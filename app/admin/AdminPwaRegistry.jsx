"use client";

import { useEffect } from "react";

export default function AdminPwaRegistry() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-admin.js', { scope: '/admin/' })
        .then((registration) => console.log('Admin SW registered with scope:', registration.scope))
        .catch((err) => console.error('Admin SW registration failed:', err));
    }
  }, []);
  
  return null;
}
