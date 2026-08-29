"use client";

import React, { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tryInit = () => {
      if (typeof window !== "undefined" && window.UnicornStudio && typeof window.UnicornStudio.init === "function") {
        try {
          window.UnicornStudio.init();
        } catch (e) {
          // ignore
        }
      }
    };

    // Trigger immediate & deferred initializations
    tryInit();
    const t1 = setTimeout(tryInit, 80);
    const t2 = setTimeout(tryInit, 300);
    const t3 = setTimeout(tryInit, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [projectId]);

  return (
    <div
      ref={containerRef}
      data-us-project={projectId}
      data-us-scale="1"
      data-us-dpi="1.5"
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ minHeight: "100%", width: "100%", height: "100%" }}
      suppressHydrationWarning
    />
  );
}
