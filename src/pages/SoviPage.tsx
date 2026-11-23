import React, { Suspense, lazy, useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Share2, CheckCircle2, MessageCircle, Instagram, QrCode } from 'lucide-react';
import { BRAND_FOOTER_CONFIG } from '../config/brands';
import { SOVI_EXTERNAL_CONFIG } from '../data/soviData';
import { navigate } from '../router';
import { getBrandCanonicalUrl } from '../utils/url';
import { shareBrandPage } from '../utils/share';

const LazySoviQrModal = lazy(() =>
  import('../components/SoviQrModal').then((mod) => ({ default: mod.SoviQrModal }))
);

export const SoviPage: React.FC = () => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [hasOpenedQrModal, setHasOpenedQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const INSTAGRAM_URL = SOVI_EXTERNAL_CONFIG.instagramUrl;
  const WHATSAPP_URL = SOVI_EXTERNAL_CONFIG.whatsappCommunityUrl;
  const canonicalUrl = getBrandCanonicalUrl('sovi');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2200);
  };

  const handleShare = async () => {
    const outcome = await shareBrandPage({
      title: 'SOVI — Handmade Goods',
      text: 'Handmade pieces, made with love.',
      url: canonicalUrl,
    });

    if (outcome === 'shared') {
      showToast('PAGE SHARED');
    } else if (outcome === 'copied') {
      showToast('LINK COPIED TO CLIPBOARD');
    } else if (outcome === 'failed' || outcome === 'unavailable') {
      showToast('SHARE UNAVAILABLE — USE QR');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#34203B] relative flex flex-col items-center justify-start antialiased selection:bg-[#EAE4F0] selection:text-[#34203B] font-body">
      {/* Subtle organic warmth & soft lavender radial gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[460px] bg-gradient-to-b from-[#F2EDF7]/70 via-[#FAF6FB]/40 to-transparent pointer-events-none -z-10" />

      {/* Main Container: Mobile-first viewport proportion, centered on desktop */}
      <main className="w-full max-w-[420px] px-5 sm:px-6 py-7 sm:py-9 flex flex-col items-center z-10">
        
        {/* Top minimal bar */}
        <div className="w-full flex items-center justify-between pb-6 text-[10px] font-mono-custom tracking-[0.24em] text-[#7B5D83] uppercase">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A084A8]" />
            <span>SOVI OFFICIAL</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHasOpenedQrModal(true);
                setIsQrModalOpen(true);
              }}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3EDF7] hover:bg-[#EAE4F0] text-[#5C3D61] border border-[#E5DEED] transition-colors cursor-pointer text-[10px]"
              title="SOVI QR Code"
              aria-label="Open SOVI QR Code"
            >
              <QrCode className="w-3 h-3 text-[#7D5B84]" />
              <span>QR</span>
            </button>
            <button
              onClick={handleShare}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3EDF7] hover:bg-[#EAE4F0] text-[#5C3D61] border border-[#E5DEED] transition-colors cursor-pointer text-[10px]"
              title="Share SOVI Page"
              aria-label="Share SOVI Page"
            >
              <Share2 className="w-3 h-3 text-[#7D5B84]" />
              <span>SHARE</span>
            </button>
          </div>
        </div>

        {/* ─── 1. HERO SECTION ─── */}
        <header className="flex flex-col items-center text-center pt-2 pb-7 w-full">
          {/* Official SOVI Logo Emblem: Butterfly, delicate botanical lines & thread motif */}
          <m.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center select-none"
          >
            {/* Soft ambient aura */}
            <div className="absolute inset-0 bg-[#EFEAF4] rounded-full blur-xl opacity-60 pointer-events-none" />

            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full relative z-10"
              aria-label="SOVI Butterfly & Botanical Logo"
            >
              {/* Outer delicate stitched embroidery circle */}
              <circle
                cx="60"
                cy="60"
                r="56"
                stroke="#D6C7DE"
                strokeWidth="1"
                strokeDasharray="2.5 3.5"
              />
              <circle
                cx="60"
                cy="60"
                r="51"
                stroke="#EAE2EE"
                strokeWidth="0.8"
              />

              {/* Graceful Butterfly Silhouette with Botanical Leaf Wings */}
              {/* Left Upper Wing */}
              <path
                d="M58 55 C52 40 38 32 28 36 C22 40 23 54 35 60 C44 65 54 62 58 57 Z"
                fill="#EAE2EE"
                stroke="#8B6D93"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Left Lower Wing */}
              <path
                d="M57 60 C50 67 36 71 31 79 C28 84 34 89 42 86 C50 82 55 72 58 63 Z"
                fill="#F2EDF7"
                stroke="#8B6D93"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Right Upper Wing */}
              <path
                d="M62 55 C68 40 82 32 92 36 C98 40 97 54 85 60 C76 65 66 62 62 57 Z"
                fill="#EAE2EE"
                stroke="#8B6D93"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Right Lower Wing */}
              <path
                d="M63 60 C70 67 84 71 89 79 C92 84 86 89 78 86 C70 82 65 72 62 63 Z"
                fill="#F2EDF7"
                stroke="#8B6D93"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Wing Inner Botanical Veins */}
              <path
                d="M36 43 C44 48 50 53 58 56"
                stroke="#9F82A6"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
              <path
                d="M84 43 C76 48 70 53 62 56"
                stroke="#9F82A6"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
              <path
                d="M40 76 C46 72 52 68 57 62"
                stroke="#9F82A6"
                strokeWidth="0.7"
                strokeLinecap="round"
              />
              <path
                d="M80 76 C74 72 68 68 63 62"
                stroke="#9F82A6"
                strokeWidth="0.7"
                strokeLinecap="round"
              />

              {/* Butterfly Body & Antennae */}
              <path
                d="M60 46 C58.8 52 58.8 66 60 72 C61.2 66 61.2 52 60 46 Z"
                fill="#5C3D61"
              />
              {/* Left Antenna */}
              <path
                d="M59 47 C57 41 51 39 48 40"
                stroke="#5C3D61"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="48" cy="40" r="1.2" fill="#5C3D61" />
              {/* Right Antenna */}
              <path
                d="M61 47 C63 41 69 39 72 40"
                stroke="#5C3D61"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="72" cy="40" r="1.2" fill="#5C3D61" />

              {/* Tiny Thread Needle & Stitch Accent below */}
              <path
                d="M45 96 C55 93 65 99 75 96"
                stroke="#A084A8"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              <circle cx="60" cy="95.5" r="1" fill="#8B6D93" />
            </svg>
          </m.div>

          {/* SOVI Brand Name */}
          <m.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="font-serif-custom text-4xl sm:text-5xl font-normal tracking-[0.24em] text-[#34203B] uppercase leading-tight"
          >
            SOVI
          </m.h1>

          {/* HANDMADE GOODS */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-2 text-xs font-mono-custom tracking-[0.3em] text-[#7D5B84] uppercase font-medium"
          >
            HANDMADE GOODS
          </m.div>

          {/* Supporting line */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-xs sm:text-sm text-[#735A7A] max-w-xs font-normal italic tracking-wide"
          >
            “Handmade pieces, made with love.”
          </m.p>
        </header>

        {/* ─── 2. PRIMARY ACTIONS ─── */}
        <section aria-label="Primary Actions" className="w-full space-y-3 mt-1">
          {/* Action 1: Instagram */}
          <m.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="group flex items-center justify-between w-full min-h-[66px] px-5 py-3.5 bg-gradient-to-b from-[#FAF5FC] to-[#F4EBF7] hover:from-[#F6ECFA] hover:to-[#EFE1F5] active:scale-[0.985] border border-[#E2D4E8] hover:border-[#C8B2D4] rounded-2xl transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(52,32,59,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_14px_rgba(52,32,59,0.07)] select-none"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#DFCEE8] flex items-center justify-center text-[#5C3D61] group-hover:text-[#34203B] shrink-0 transition-colors shadow-2xs">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-medium text-sm sm:text-base text-[#34203B] block leading-snug">
                  Follow SOVI on Instagram
                </span>
                <span className="text-[11px] font-mono-custom text-[#7B5D83] tracking-wider block">
                  @sovi_storee
                </span>
              </div>
            </div>
            <div className="text-[#7B5D83] group-hover:text-[#5C3D61] transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </m.a>

          {/* Action 2: WhatsApp Community */}
          <m.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="group flex items-center justify-between w-full min-h-[66px] px-5 py-3.5 bg-gradient-to-b from-[#FAF5FC] to-[#F4EBF7] hover:from-[#F6ECFA] hover:to-[#EFE1F5] active:scale-[0.985] border border-[#E2D4E8] hover:border-[#C8B2D4] rounded-2xl transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(52,32,59,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_14px_rgba(52,32,59,0.07)] select-none"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#DFCEE8] flex items-center justify-center text-[#5C3D61] group-hover:text-[#34203B] shrink-0 transition-colors shadow-2xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-medium text-sm sm:text-base text-[#34203B] block leading-snug">
                  Join our WhatsApp Community
                </span>
                <span className="text-[11px] font-mono-custom text-[#7B5D83] tracking-wider block">
                  Orders & Updates
                </span>
              </div>
            </div>
            <div className="text-[#7B5D83] group-hover:text-[#5C3D61] transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </m.a>
        </section>

        {/* ─── 3. BRAND STORY: MADE BY HAND ─── */}
        <section aria-label="About SOVI" className="w-full mt-7 p-6 rounded-2xl bg-[#F6F0F8]/80 border border-[#E8DFEF] text-center relative overflow-hidden">
          {/* Subtle botanical corner accent */}
          <div className="flex items-center justify-center gap-2 mb-2 text-[#9F82A6]">
            <span className="w-6 h-[1px] bg-[#D6C7DE]" />
            <span className="text-[10px] font-mono-custom tracking-[0.25em] text-[#7D5B84] uppercase font-semibold">
              OUR CRAFT
            </span>
            <span className="w-6 h-[1px] bg-[#D6C7DE]" />
          </div>

          <h2 className="font-serif-custom text-2xl font-normal text-[#34203B] tracking-wide mb-2.5">
            Made by Hand
          </h2>

          <p className="text-xs sm:text-sm text-[#5C3D61] leading-relaxed max-w-xs mx-auto font-normal">
            Every piece carries a little bit of creativity, care, and a personal touch.
          </p>
        </section>

        {/* ─── 4. FOUNDER SECTION ─── */}
        <section aria-label="Founder" className="w-full mt-5 p-5 rounded-2xl bg-gradient-to-b from-[#FAF5FC] to-[#F5EDF8] border border-[#E4D7EB] flex flex-col items-center text-center shadow-[0_2px_8px_rgba(52,32,59,0.03)]">
          <span className="text-[10px] font-mono-custom tracking-[0.22em] text-[#7B5D83] uppercase mb-1">
            BEHIND SOVI
          </span>
          <span className="text-xs text-[#7D5B84] font-medium mb-1">
            Founder
          </span>
          <h3 className="font-serif-custom text-xl sm:text-2xl font-normal tracking-wider text-[#34203B]">
            Sara Mahmoud
          </h3>
        </section>

        {/* ─── 5. STAY CONNECTED ─── */}
        <section aria-label="Stay Connected" className="w-full mt-6 pt-2">
          <div className="flex items-center justify-between pb-3 px-1 border-b border-[#E8DFEF] mb-3 text-[11px] font-mono-custom text-[#7D5B84] tracking-[0.2em] uppercase font-semibold">
            <span>STAY CONNECTED</span>
            <span>COMMUNITY</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FAF5FC] to-[#F5ECF8] hover:from-[#F6ECFA] hover:to-[#EFE2F5] border border-[#E2D4E8] hover:border-[#C8B2D4] flex flex-col items-center text-center transition-all duration-150 shadow-[0_2px_6px_rgba(52,32,59,0.03)] group cursor-pointer"
            >
              <Instagram className="w-5 h-5 text-[#7D5B84] group-hover:text-[#34203B] mb-1.5 transition-colors" />
              <span className="text-xs font-medium text-[#34203B]">Instagram</span>
              <span className="text-[10px] font-mono-custom text-[#7B5D83] mt-0.5">@sovi_storee</span>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FAF5FC] to-[#F5ECF8] hover:from-[#F6ECFA] hover:to-[#EFE2F5] border border-[#E2D4E8] hover:border-[#C8B2D4] flex flex-col items-center text-center transition-all duration-150 shadow-[0_2px_6px_rgba(52,32,59,0.03)] group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#7D5B84] group-hover:text-[#34203B] mb-1.5 transition-colors" />
              <span className="text-xs font-medium text-[#34203B]">WhatsApp</span>
              <span className="text-[10px] font-mono-custom text-[#7B5D83] mt-0.5">Orders & Updates</span>
            </a>
          </div>
        </section>

        {/* ─── 6. MINIMAL FOOTER ─── */}
        <footer className="w-full pt-10 pb-8 text-center flex flex-col items-center justify-center space-y-2.5 select-none border-t border-[#E8DFEF] mt-8">
          <span className="font-serif-custom text-xl tracking-[0.2em] text-[#34203B] uppercase">
            SOVI
          </span>
          <span className="text-[10px] font-mono-custom tracking-[0.25em] text-[#7B5D83] uppercase">
            HANDMADE GOODS
          </span>

          <p className="text-[11px] font-body text-[#7D5B84] pt-1">
            Founder — Sara Mahmoud
          </p>

          <div className="pt-3 flex flex-col items-center gap-2.5">
            <span className="text-[9px] font-mono-custom tracking-[0.24em] text-[#7F6187] uppercase">
              POWERED BY TAPP
            </span>

            <button
              type="button"
              onClick={() => navigate(BRAND_FOOTER_CONFIG.explorePath)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F3EDF7] hover:bg-[#EAE4F0] text-[#5C3D61] border border-[#E5DEED] text-[10px] font-mono-custom tracking-[0.18em] uppercase transition-colors cursor-pointer"
            >
              <span>{BRAND_FOOTER_CONFIG.exploreLabel}</span>
              <ArrowUpRight className="w-3 h-3 text-[#7D5B84]" />
            </button>

            <p className="text-[10px] font-body text-[#7F6187]">
              {BRAND_FOOTER_CONFIG.attributionText}
            </p>
          </div>
        </footer>
      </main>

      {/* SOVI QR Code & Print Export Modal */}
      {hasOpenedQrModal && (
        <Suspense fallback={null}>
          <LazySoviQrModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            onToast={showToast}
          />
        </Suspense>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 z-50 bg-[#34203B] text-[#FAF8F5] px-4 py-2.5 rounded-xl text-xs font-mono-custom tracking-wider shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D6C7DE]" />
            <span>{toastMessage}</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
