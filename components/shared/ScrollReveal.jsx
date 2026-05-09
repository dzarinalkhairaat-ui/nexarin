"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 46,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    let observer = null;
    let fallbackTimer = null;
    let isMounted = true;

    const showElement = () => {
      if (!isMounted) {
        return;
      }

      setIsVisible(true);
    };

    if (!element) {
      showElement();
      return () => {
        isMounted = false;
      };
    }

    try {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
        showElement();
        return () => {
          isMounted = false;
        };
      }

      fallbackTimer = window.setTimeout(() => {
        showElement();

        if (observer) {
          observer.disconnect();
        }
      }, 900);

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            window.requestAnimationFrame(() => {
              showElement();
            });

            if (fallbackTimer) {
              window.clearTimeout(fallbackTimer);
            }

            observer.disconnect();
          }
        },
        {
          threshold: 0.02,
          rootMargin: "0px 0px 80px 0px",
        }
      );

      observer.observe(element);
    } catch {
      showElement();
    }

    return () => {
      isMounted = false;

      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }

      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(0, ${y}px, 0) scale(0.975)`,
        filter: isVisible ? "blur(0px)" : "blur(2px)",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "850ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}