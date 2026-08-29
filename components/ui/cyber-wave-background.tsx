"use client";

import React, { useEffect, useRef } from "react";

interface CyberWaveBackgroundProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  pulseSpeed: number;
  color: string;
}

export function CyberWaveBackground({ className = "" }: CyberWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates for interactive wave displacement
    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
      radius: 200,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate Starlight Particles
    const starColors = ["#2DD4F5", "#7CF2C3", "#A78BFA", "#38BDF8", "#FFFFFF"];
    const starCount = Math.min(Math.floor((width * height) / 12000), 90);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    let time = 0;

    // 3D Sine Wave configuration
    const waveCount = 5;
    const waveColors = [
      { stroke: "rgba(45, 212, 245, 0.45)", glow: "#2DD4F5", width: 2.2 },
      { stroke: "rgba(124, 242, 195, 0.40)", glow: "#7CF2C3", width: 1.8 },
      { stroke: "rgba(129, 140, 248, 0.35)", glow: "#818CF8", width: 2.0 },
      { stroke: "rgba(192, 132, 252, 0.30)", glow: "#C084FC", width: 1.5 },
      { stroke: "rgba(56, 189, 248, 0.35)", glow: "#38BDF8", width: 1.8 },
    ];

    const render = () => {
      time += 0.012;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

// 1. Pure dark background without blurry gradient circles

      // =========================================================================
      // 2. PERSPECTIVE DIGITAL TECH GRID
      // =========================================================================
      const gridSize = 54;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(45, 212, 245, 0.035)";

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // =========================================================================
      // 3. TWINKLING STARLIGHT PARTICLES
      // =========================================================================
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y -= s.z * 0.25;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        const alpha = s.baseAlpha + Math.sin(time * 3 + i) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      // =========================================================================
      // 4. 3D GEOMETRIC GLOWING SINE WAVES & RIBBONS
      // =========================================================================
      const waveBaseY = height * 0.55;
      const step = 8;

      for (let w = 0; w < waveCount; w++) {
        const cfg = waveColors[w];
        const freq = 0.0025 + w * 0.0008;
        const amp = 50 + w * 18;
        const speed = time * (0.8 + w * 0.25);
        const yOffset = (w - 2) * 28;

        ctx.beginPath();
        ctx.lineWidth = cfg.width;
        ctx.strokeStyle = cfg.stroke;
        ctx.shadowBlur = 14;
        ctx.shadowColor = cfg.glow;

        for (let x = 0; x <= width + step; x += step) {
          // Interactive displacement from mouse position
          const dx = x - mouse.x;
          const dy = waveBaseY + yOffset - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let mouseEffect = 0;

          if (dist < mouse.radius) {
            mouseEffect = Math.sin((1 - dist / mouse.radius) * Math.PI) * 45;
          }

          const waveY =
            waveBaseY +
            yOffset +
            Math.sin(x * freq + speed) * amp +
            Math.cos(x * freq * 1.5 - speed * 0.8) * (amp * 0.45) -
            mouseEffect;

          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
