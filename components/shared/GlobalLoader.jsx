"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function GlobalLoader() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loader when path or search params change
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e) => {
      // Find the closest anchor tag or a specific button marked to trigger loading
      const targetLink = e.target.closest('a');
      const targetForm = e.target.closest('form');
      const submitButton = e.target.closest('button[type="submit"]');

      // 1. Handle Links Navigation
      if (targetLink && targetLink.href && targetLink.target !== '_blank') {
        try {
          const targetUrl = new URL(targetLink.href);
          const currentUrl = new URL(window.location.href);
          
          // Only show loader if we are actually changing the path or query
          // (Don't show it for hash links on the same page, or mailto/tel)
          if (
            targetUrl.origin === currentUrl.origin && 
            (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search)
          ) {
            setIsNavigating(true);
          }
        } catch (error) {
          // Ignore invalid URLs
        }
      }
      
      // 2. Handle Form Submissions (where applicable)
      if (submitButton && targetForm) {
        // Just a simple heuristic: if they submit a form, show loader
        // Not perfect for AJAX forms, but for traditional forms or NextJS server actions it works well
        // We will assume any form submission might take time.
        setIsNavigating(true);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/40 backdrop-blur-[4px] animate-in fade-in duration-200">
      <div className="flex flex-col items-center justify-center">
        <LoadingSpinner className="h-10 w-10 text-emerald-400 mb-3" />
        <span className="text-sm font-black tracking-widest text-emerald-300 uppercase animate-pulse">
          Memuat...
        </span>
      </div>
    </div>
  );
}
