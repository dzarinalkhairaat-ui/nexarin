"use client";

import { useState } from "react";

function OperatorImage({ operator }) {
  const safeOperator = operator || {};
  const [isError, setIsError] = useState(false);
  const hasImage = Boolean(safeOperator.image && !isError);

  if (!hasImage) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_35%_28%,rgba(52,211,153,0.24),transparent_36%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,1))] text-3xl font-black text-emerald-300">
        {String(safeOperator.label || "OP").slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={safeOperator.image}
      alt={safeOperator.label || "Operator"}
      className="h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setIsError(true)}
    />
  );
}

export default function PpobPulsaOperatorHero({ operator }) {
  const safeOperator = operator || {};

  return (
    <section className="px-5 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-slate-900 shadow-xl shadow-black/20">
              <OperatorImage operator={safeOperator} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                Isi Pulsa
              </p>

              <h2 className="mt-1 truncate text-2xl font-black tracking-[-0.055em] text-white">
                {safeOperator.label || "Operator"}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-400">
                Pilih nominal pulsa, isi nomor tujuan, lalu lanjutkan order
                manual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}