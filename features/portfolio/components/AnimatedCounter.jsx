"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);
  
  // Extract number and suffix from string (e.g. "10+" -> number: 10, suffix: "+")
  const match = String(value).match(/^(\d+)(.*)$/);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const duration = 2000; // 2 seconds animation

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Disconnect after first intersection to only animate once
          if (elementRef.current) observer.unobserve(elementRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting || targetNumber === 0) return;

    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * targetNumber));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isIntersecting, targetNumber, duration]);

  return (
    <span ref={elementRef}>
      {count}{suffix}
    </span>
  );
}
