"use client";

import React, { useEffect } from "react";

interface UnicornBackgroundProps {
  projectId: string;
  className?: string;
}

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
      destroy?: () => void;
      [key: string]: any;
    };
  }
}

export function UnicornBackground({ projectId, className = "" }: UnicornBackgroundProps) {
  useEffect(() => {
    let scriptEl = document.querySelector(
      'script[src*="unicornStudio.umd.js"]'
    ) as HTMLScriptElement | null;

    const initUnicorn = () => {
      if (window.UnicornStudio && typeof window.UnicornStudio.init === "function") {
        try {
          window.UnicornStudio.init();
        } catch (e) {
          console.warn("UnicornStudio init:", e);
        }
      }
    };

    if (!scriptEl) {
      window.UnicornStudio = window.UnicornStudio || { isInitialized: false };
      scriptEl = document.createElement("script");
      scriptEl.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.3/dist/unicornStudio.umd.js";
      scriptEl.async = true;
      scriptEl.onload = () => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", initUnicorn);
        } else {
          initUnicorn();
        }
      };
      (document.head || document.body).appendChild(scriptEl);
    } else {
      initUnicorn();
    }
  }, [projectId]);

  return (
    <div
      data-us-project={projectId}
      className={`absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden ${className}`}
      suppressHydrationWarning
    />
  );
}
