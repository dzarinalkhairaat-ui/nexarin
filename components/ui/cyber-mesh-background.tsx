"use client";

import React, { useEffect, useRef } from "react";

interface CyberMeshBackgroundProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseAlpha: number;
  alpha: number;
}

export function CyberMeshBackground({ className = "" }: CyberMeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse interactive coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Particle Palette
    const colors = ["#2DD4F5", "#7CF2C3", "#38BDF8", "#818CF8", "#A78BFA"];

    const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = 0.2 + Math.random() * 0.55;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 1.2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha,
        alpha: baseAlpha,
      });
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Tech Grid Lines
      const gridSize = 48;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";

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

      // 2. Draw Flowing Aurora Ambient Glows
      const auroraX1 = width * 0.3 + Math.sin(time * 0.7) * 80;
      const auroraY1 = height * 0.4 + Math.cos(time * 0.5) * 60;
      const g1 = ctx.createRadialGradient(auroraX1, auroraY1, 10, auroraX1, auroraY1, 380);
      g1.addColorStop(0, "rgba(45, 212, 245, 0.12)");
      g1.addColorStop(0.5, "rgba(45, 212, 245, 0.04)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const auroraX2 = width * 0.7 + Math.cos(time * 0.6) * 90;
      const auroraY2 = height * 0.55 + Math.sin(time * 0.8) * 70;
      const g2 = ctx.createRadialGradient(auroraX2, auroraY2, 10, auroraX2, auroraY2, 360);
      g2.addColorStop(0, "rgba(124, 242, 195, 0.09)");
      g2.addColorStop(0.5, "rgba(124, 242, 195, 0.03)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      const auroraX3 = width * 0.5 + Math.sin(time * 0.4) * 110;
      const auroraY3 = height * 0.7 + Math.cos(time * 0.7) * 80;
      const g3 = ctx.createRadialGradient(auroraX3, auroraY3, 10, auroraX3, auroraY3, 400);
      g3.addColorStop(0, "rgba(99, 102, 241, 0.08)");
      g3.addColorStop(0.6, "rgba(99, 102, 241, 0.02)");
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      // 3. Connect Nearby Particles with Constellation Laser Lines
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45, 212, 245, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Update and Draw Particles with Mouse Wave Interaction
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interactive force
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.radius && mDist > 0) {
          const force = (1 - mDist / mouse.radius) * 1.5;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
          p.alpha = Math.min(1, p.baseAlpha + 0.4);
        } else {
          p.alpha = p.baseAlpha;
        }

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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
