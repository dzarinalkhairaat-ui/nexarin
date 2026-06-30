"use client";

import { useState } from "react";
import { contactNeedOptions } from "@/features/contact/contact.data";

const initialForm = {
  name: "",
  whatsapp: "",
  email: "",
  need: "Jasa Pembuatan Website & Aplikasi",
  message: "",
};

const fallbackOptions = [
  "Jasa Pembuatan Website & Aplikasi",
  "Kolaborasi",
  "Lainnya",
];

export default function ContactForm({ contacts = [], maps = [] }) {
  const [form, setForm] = useState(initialForm);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options =
    Array.isArray(contactNeedOptions) && contactNeedOptions.length > 0
      ? contactNeedOptions
      : fallbackOptions;

  const waSetting = contacts.find(s => s.platform === 'WhatsApp')?.value || "0851 - 7305 - 7576";
  const emailSetting = contacts.find(s => s.platform === 'Email')?.value || "nexarinbyrins@gmail.com";
  
  const defaultMap = maps[0] || {};
  const addressSetting = defaultMap.addressText || "Desa Tirtanagaya, Dusun 5";
  const mapsLinkSetting = defaultMap.mapsLink || `https://maps.google.com/?q=${encodeURIComponent(addressSetting)}`;

  let cleanWa = waSetting.replace(/\D/g, '');
  if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.slice(1);

  const contactDetails = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
      label: "Email",
      value: emailSetting,
      href: `mailto:${emailSetting}`,
      type: "email",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      ),
      label: "WhatsApp",
      value: waSetting,
      href: `https://wa.me/${cleanWa}`,
      type: "whatsapp",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: "Location",
      value: addressSetting,
      href: mapsLinkSetting,
      type: "location",
    },
  ];

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const text = [
      "Halo Nexarin, saya ingin diskusi.",
      "",
      `Nama: ${form.name || "-"}`,
      `WhatsApp: ${form.whatsapp || "-"}`,
      `Email: ${form.email || "-"}`,
      `Kebutuhan: ${form.need || "-"}`,
      `Pesan: ${form.message || "-"}`,
    ].join("\n");

    const encodedText = encodeURIComponent(text);
    window.location.href = `https://wa.me/${cleanWa}?text=${encodedText}`;
  }

  return (
    <section className="relative px-5 pb-16 pt-10 text-white sm:px-6 sm:pt-16 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center lg:mb-16">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
            Get in Touch
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            Hubungi Kami
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-400 sm:text-base">
            Punya pertanyaan seputar produk digital, butuh custom project, atau ingin berkolaborasi?
            Jangan ragu untuk mengirimkan pesan, kami siap membantu Anda.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(380px,1.15fr)] lg:gap-12 lg:items-start">
          {/* Left Column: Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-6 sm:p-8 shadow-2xl shadow-black/25">
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Informasi Kontak
              </h2>

              <div className="mt-6 grid gap-4">
                {contactDetails.map((detail) => (
                  <button
                    key={detail.label}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedContact(detail);
                    }}
                    className="group w-full text-left flex items-center gap-4 rounded-[24px] border border-white/5 bg-slate-950/40 p-4 transition hover:bg-white/[0.04] hover:border-emerald-400/20"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 text-xl shadow-lg shadow-emerald-400/10 transition group-hover:scale-110">
                      {detail.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                        {detail.label}
                      </p>
                      <p className="mt-1 text-sm font-bold text-emerald-300">
                        {detail.value}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[34px] border border-white/10 bg-white/[0.045] p-6 sm:p-8 shadow-2xl shadow-black/25"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-emerald-400" />
              <div>
                <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                  Kirim Pesan
                </h2>
              </div>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Nama Anda
                </span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="John Doe"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Nomor WhatsApp
                  </span>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(event) => updateField("whatsapp", event.target.value)}
                    placeholder="0812xxxx"
                    className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Alamat Email
                  </span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="john@mail.com"
                    className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </label>
              </div>

              <div className="relative z-10">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Kebutuhan
                  </span>
                  <div className="relative">
                    {/* Overlay to close dropdown when clicking outside */}
                    {isDropdownOpen && (
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsDropdownOpen(false)} 
                      />
                    )}
                    
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="relative z-20 flex min-h-14 w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 pl-4 pr-4 text-sm font-black text-white outline-none transition focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                    >
                      <span className="truncate">{form.need}</span>
                      <svg
                        className={`ml-3 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div 
                      className={`absolute left-0 z-30 mt-2 w-full origin-top transform overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl transition-all duration-300 ease-out ${
                        isDropdownOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                      }`}
                    >
                      <ul className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        {options.map((option) => (
                          <li key={option}>
                            <button
                              type="button"
                              onClick={() => {
                                updateField("need", option);
                                setIsDropdownOpen(false);
                              }}
                              className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                                form.need === option 
                                  ? 'bg-emerald-400/10 font-bold text-emerald-400' 
                                  : 'font-medium text-slate-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Detail Pesan
                </span>
                <textarea
                  required
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Ceritakan detail kebutuhan atau pertanyaan Anda di sini..."
                  rows={5}
                  className="min-h-36 resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>
            </div>

            <button
              type="submit"
              className="group relative mt-8 flex min-h-[60px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="relative z-10 transition-transform group-hover:scale-110">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span className="relative z-10">Kirim Pesan via WhatsApp</span>
              <div className="absolute inset-0 z-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
            </button>
          </form>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedContact(null)} 
          />
          <div className="relative w-full max-w-sm scale-100 overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/90 p-6 text-center shadow-2xl shadow-emerald-500/10 backdrop-blur-xl transition-all">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
              {selectedContact.icon}
            </div>
            <h3 className="mb-2 text-xl font-black text-white">
              {selectedContact.type === "whatsapp" 
                ? "Lanjutkan ke WhatsApp?" 
                : selectedContact.type === "email" 
                  ? "Buka Aplikasi Email?" 
                  : "Buka Google Maps?"}
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-slate-400">
              Anda akan dialihkan ke {selectedContact.type === "whatsapp" ? "WhatsApp" : selectedContact.type === "email" ? "aplikasi surel" : "Google Maps"} untuk melanjutkan komunikasi.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedContact(null)}
                className="flex-1 rounded-xl bg-white/[0.05] px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10"
              >
                Batal
              </button>
              <a 
                href={selectedContact.href}
                target={selectedContact.type === "location" || selectedContact.type === "whatsapp" ? "_blank" : undefined}
                rel={selectedContact.type === "location" || selectedContact.type === "whatsapp" ? "noopener noreferrer" : undefined}
                onClick={() => setSelectedContact(null)}
                className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                Lanjutkan
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}