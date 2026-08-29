"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

interface ValenceButtonProps {
  href?: string;
  label?: string;
  className?: string;
  target?: string;
  rel?: string;
}

export function ValenceButton({
  href = "https://slendro-ai.com/register-user.php?ref=RINSAI.PRO3734",
  label = "AKSES DISINI",
  className = "",
  target = "_blank",
  rel = "noopener noreferrer"
}: ValenceButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const btn = btnRef.current;
    if (!canvas || !btn) return;

    let animId: number;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // WebGL Initialization
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true });
    if (!gl) {
      btn.style.background = "#062630";
      return;
    }

    const vsSource = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fsSource = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform float u_arcs;
      uniform float u_flash;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
      }
      float fbm(vec2 p){
        float v=0.0; float a=0.5;
        for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.05+vec2(9.7,3.1); a*=0.5; }
        return v;
      }
      float sdRBox(vec2 p, vec2 b, float r){
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }
      void main(){
        vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
        float ar = u_res.x / u_res.y;
        vec2 hs = vec2(ar * 0.5 - 0.2, 0.5 - 0.2);
        float d = sdRBox(p, hs, 0.14);
        float t = u_time;
        float hover = clamp(u_arcs / 6.0, 0.0, 1.0);
        vec3 col = vec3(0.039, 0.039, 0.039);
        float plate = 1.0 - smoothstep(-0.004, 0.004, d);
        vec3 plateCol = vec3(0.04, 0.05, 0.055) + vec3(0.014, 0.022, 0.035) * fbm(p * 9.0);
        plateCol += vec3(0.0, 0.25, 0.3) * exp(d * 9.0) * (0.25 + hover * 0.6);
        col = mix(col, plateCol, plate);
        col *= 1.0 + 0.5 * exp(-max(d, 0.0) * 16.0) * (1.0 - plate);
        float a = atan(p.y, p.x);
        vec3 arcCol = vec3(0.0);
        for (int i = 0; i < 6; i++) {
          float fi = float(i);
          float w = clamp(u_arcs - fi, 0.0, 1.0);
          float n1 = fbm(vec2(a * 2.4 + fi * 11.3, t * (1.6 + fi * 0.27) + fi * 53.1));
          float off = (n1 - 0.5) * (0.11 + u_flash * 0.1);
          float seg = 0.3 + 0.7 * smoothstep(0.35, 0.75, noise(vec2(a * 1.8 + fi * 7.7, t * (0.9 + fi * 0.13) + fi * 19.0)));
          float g = 0.0042 / (abs(d + off) + 0.006);
          arcCol += (vec3(0.0, 0.75, 0.9) * g + vec3(0.6, 1.0, 0.95) * g * g * 0.55) * w * seg;
        }
        float outerMask = 1.0 - smoothstep(0.04, 0.15, d);
        col += arcCol * (0.6 + 0.4 * hover) * outerMask;
        float ring = 0.006 / (abs(d) + 0.006);
        col += vec3(0.8, 0.98, 1.0) * ring * u_flash * 1.5 * outerMask;
        col += vec3(0.7, 0.95, 1.0) * u_flash * 0.16 * outerMask;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, src: string) {
      const s = glCtx.createShader(type);
      if (!s) return null;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      return s;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const locP = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uArcs = gl.getUniformLocation(program, "u_arcs");
    const uFlash = gl.getUniformLocation(program, "u_flash");

    let arcs = 2.4;
    let arcsTarget = 2.4;
    let flash = 0;
    let crawl = 0;
    let last = performance.now();

    function resize() {
      if (!btn || !canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(btn.clientWidth * dpr);
      const h = Math.round(btn.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    const onMouseEnter = () => {
      arcsTarget = 5.8;
      btn.style.transform = "translateY(-2px) scale(1.02)";
    };

    const onMouseLeave = () => {
      arcsTarget = 2.4;
      btn.style.transform = "translateY(0) scale(1)";
    };

    const onMouseDown = () => {
      flash = 1;
      btn.style.transform = "translateY(1px) scale(0.99)";
    };

    const onMouseUp = () => {
      btn.style.transform = "translateY(-2px) scale(1.02)";
    };

    btn.addEventListener("mouseenter", onMouseEnter);
    btn.addEventListener("mouseleave", onMouseLeave);
    btn.addEventListener("mousedown", onMouseDown);
    btn.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", resize);

    resize();

    // Subtle entrance animation
    btn.style.opacity = "1";
    btn.style.transform = "scale(1)";

    function render(now: number) {
      if (!gl || !canvas) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      arcs += (arcsTarget - arcs) * Math.min(1, dt * 5);
      flash *= Math.exp(-3.6 * dt);
      crawl += dt * (0.6 + (arcs / 6) * 1.1 + flash * 2.0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 3.0 : crawl);
      gl.uniform1f(uArcs, arcs);
      gl.uniform1f(uFlash, flash);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      btn.removeEventListener("mouseenter", onMouseEnter);
      btn.removeEventListener("mouseleave", onMouseLeave);
      btn.removeEventListener("mousedown", onMouseDown);
      btn.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative flex justify-center items-center ${className}`}>
      <a
        ref={btnRef}
        href={href}
        target={target}
        rel={rel}
        className="relative flex items-center justify-center w-[280px] h-[84px] sm:h-[96px] bg-transparent cursor-pointer rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 group select-none transition-all duration-300"
        style={{
          transition: "transform .22s cubic-bezier(.34, 1.4, .5, 1), box-shadow .3s ease",
          boxShadow: "0 0 35px -5px rgba(6, 182, 212, 0.25)"
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block rounded-[18px] pointer-events-none"
          style={{ filter: "drop-shadow(0 0 18px rgba(6, 182, 212, 0.4))" }}
        />

        <span
          className="relative z-10 pointer-events-none font-extrabold text-sm sm:text-base tracking-[0.25em] indent-[0.25em] text-[#e0f7f8] flex items-center gap-2 uppercase"
          style={{
            textShadow: "0 0 14px rgba(0, 210, 255, .75), 0 1px 4px rgba(0, 0, 0, .9)",
            fontFamily: "var(--font-geist-mono), monospace"
          }}
        >
          {label}
        </span>
      </a>
    </div>
  );
}
