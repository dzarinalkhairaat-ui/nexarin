"use client";

import { useEffect, useState } from "react";

export default function HomeProgressChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="relative px-5 pt-4 pb-12 sm:pt-4 sm:pb-16 sm:px-6 lg:px-8" style={{ backgroundColor: '#030711' }}>
      {/* Grid Pattern Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(26,43,71,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,71,0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />


      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ backgroundColor: 'rgba(13,242,163,0.05)' }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div
          className="group relative overflow-hidden rounded-[24px] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
          style={{
            backgroundColor: 'rgba(10,17,33,0.4)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#1A2B47',
            transition: 'box-shadow 0.7s ease, border-color 0.7s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 40px rgba(13,242,163,0.1), 0 0 80px rgba(13,242,163,0.05)';
            e.currentTarget.style.borderColor = 'rgba(13,242,163,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.borderColor = '#1A2B47';
          }}
        >
          {/* Decorative Top Highlight */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(13,242,163,0.3), transparent)' }}
          />

          <div className="mb-10 text-center relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-[-0.04em] drop-shadow-md">
              Nexarin{" "}
              <span style={{ color: '#0DF2A3', textShadow: '0 0 20px rgba(13,242,163,0.3)' }}>
                Terus Berkembang
              </span>
            </h2>
          </div>

          {/* Chart Container */}
          <div className="relative h-64 sm:h-80 w-full mt-4 flex items-end">

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 flex flex-col justify-between text-[10px] sm:text-xs font-black z-20 pb-6 pt-1" style={{ color: '#708090' }}>
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Main Graph Area */}
            <div className="relative ml-10 sm:ml-12 h-full w-full pb-6" style={{ borderBottom: '1px solid rgba(26,43,71,0.8)', borderLeft: '1px solid rgba(26,43,71,0.8)' }}>

              <style>{`
                @keyframes barLoop {
                  0%, 100% { transform: scaleY(0.3); }
                  50% { transform: scaleY(1); }
                }
                .bar-loop-1 { animation: barLoop 3s ease-in-out infinite; animation-delay: 0s; }
                .bar-loop-2 { animation: barLoop 3s ease-in-out infinite; animation-delay: 0.2s; }
                .bar-loop-3 { animation: barLoop 3s ease-in-out infinite; animation-delay: 0.5s; }
                .bar-loop-4 { animation: barLoop 3s ease-in-out infinite; animation-delay: 0.8s; }
                .bar-loop-5 { animation: barLoop 3s ease-in-out infinite; animation-delay: 1s; }

                @keyframes laserSweep {
                  0% { transform: translateX(-100%) rotate(-15deg); opacity: 0; }
                  30% { opacity: 0.6; }
                  70% { opacity: 0.6; }
                  100% { transform: translateX(200%) rotate(-15deg); opacity: 0; }
                }
              `}</style>

              {/* Grid lines (Behind all) */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[0%] w-full" style={{ borderTop: '1px dashed rgba(26,43,71,0.5)' }} />
                <div className="absolute top-[25%] w-full" style={{ borderTop: '1px dashed rgba(26,43,71,0.5)' }} />
                <div className="absolute top-[50%] w-full" style={{ borderTop: '1px dashed rgba(26,43,71,0.5)' }} />
                <div className="absolute top-[75%] w-full" style={{ borderTop: '1px dashed rgba(26,43,71,0.5)' }} />

                <div className="absolute left-[30%] h-full" style={{ borderLeft: '1px dashed rgba(26,43,71,0.3)' }} />
                <div className="absolute left-[50%] h-full" style={{ borderLeft: '1px dashed rgba(26,43,71,0.3)' }} />
                <div className="absolute left-[70%] h-full" style={{ borderLeft: '1px dashed rgba(26,43,71,0.3)' }} />
              </div>

              {/* Bars with animate-bar-loop */}
              <div className="absolute inset-0 z-10">
                {[
                  { left: '6%', height: '85%', delay: 'bar-loop-1' },
                  { left: '26%', height: '90%', delay: 'bar-loop-2' },
                  { left: '46%', height: '95%', delay: 'bar-loop-3' },
                  { left: '66%', height: '88%', delay: 'bar-loop-4' },
                  { left: '86%', height: '92%', delay: 'bar-loop-5' },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className={`absolute bottom-0 w-[8%] rounded-t-lg origin-bottom ${bar.delay}`}
                    style={{
                      left: bar.left,
                      height: bar.height,
                      background: `linear-gradient(to top, rgba(13,242,163,0.1) 0%, rgba(13,242,163,0.4) 40%, rgba(13,242,163,0.85) 100%)`,
                      borderTop: '2px solid rgba(13,242,163,0.9)',
                      borderLeft: '1px solid rgba(13,242,163,0.3)',
                      borderRight: '1px solid rgba(13,242,163,0.3)',
                      filter: 'blur(0px)',
                      boxShadow: '0 0 20px rgba(13,242,163,0.25), inset 0 0 10px rgba(13,242,163,0.2)',
                    }}
                  />
                ))}
              </div>

              {/* Laser accent line */}
              <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-[20%] left-0 w-[60%] h-[1px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(13,242,163,0.8), transparent)',
                    animation: 'laserSweep 4s linear infinite',
                    boxShadow: '0 0 8px rgba(13,242,163,0.5)',
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
