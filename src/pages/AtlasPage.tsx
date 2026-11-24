import React, { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowUpRight, Headphones, Link2, X } from 'lucide-react';
import { ProfileHeader } from '../components/ProfileHeader';
import { SmartPageFooter } from '../components/SmartPageFooter';
import { PlatformIcon } from '../components/PlatformIcon';
import {
  ATLAS_PROFILE,
  MUSIC_STREAMING_LINKS,
  SOCIAL_LINKS,
} from '../data/atlasData';
import { SmartLink } from '../types';
import { getBrandCanonicalUrl } from '../utils/url';
import { shareBrandPage } from '../utils/share';

export const AtlasPage: React.FC = () => {
  const [isManualCopyOpen, setIsManualCopyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const manualCopyInputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const canonicalUrl = getBrandCanonicalUrl('atlas');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2400);
  };

  useEffect(() => {
    if (!isManualCopyOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusTimer = window.setTimeout(() => {
      manualCopyInputRef.current?.focus();
      manualCopyInputRef.current?.select();
    }, 30);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsManualCopyOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isManualCopyOpen]);

  const handleShare = async () => {
    setIsManualCopyOpen(false);
    const outcome = await shareBrandPage({
      title: 'ATLAS — Official Digital Card',
      text: 'Artist / Rapper / Producer — Listen to ATLAS on Spotify, Anghami & YouTube.',
      url: canonicalUrl,
    });

    if (outcome === 'shared') {
      showToast('PAGE SHARED');
    } else if (outcome === 'copied') {
      showToast('LINK COPIED TO CLIPBOARD');
    } else if (outcome === 'failed' || outcome === 'unavailable') {
      setIsManualCopyOpen(true);
    }
  };

  const handleLinkClick = (link: SmartLink) => {
    showToast(`OPENING ${link.title}...`);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-[#F4F4F8] relative flex flex-col items-center justify-start antialiased selection:bg-[#4338CA] selection:text-white font-body">
      {/* Cinematic subtle film grain overlay */}
      <div className="fixed inset-0 film-grain opacity-30 pointer-events-none z-30" />

      {/* Atmospheric deep navy & dark violet background lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[520px] bg-gradient-to-b from-[#141B3B]/40 via-[#1E1438]/20 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-96 bg-gradient-to-t from-[#0E1328]/30 to-transparent pointer-events-none -z-10" />

      {/* Main Container: Mobile viewport proportion, centered on desktop */}
      <main className="w-full max-w-[440px] px-4 sm:px-5 py-6 sm:py-8 flex flex-col items-center z-10">
        {/* 1. HERO SECTION */}
        <ProfileHeader onShareClick={handleShare} />

        {/* 2. MUSIC SECTION: LISTEN TO ATLAS */}
        <section id="music-section" className="w-full mt-4 scroll-mt-6">
          <div className="flex items-center justify-between pb-3 px-1 border-b border-[#1A203B]/60 mb-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 text-[#5C67DE]" />
              <span className="text-[11px] font-mono-custom font-bold tracking-[0.22em] text-[#CCD4F0] uppercase">
                LISTEN TO ATLAS
              </span>
            </div>
            <span className="text-[9px] font-mono-custom tracking-[0.18em] text-[#707CA3] uppercase">
              STREAMING
            </span>
          </div>

          <div className="space-y-2.5">
            {MUSIC_STREAMING_LINKS.map((link, index) => (
              <m.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link);
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.15 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative flex items-center justify-between w-full min-h-[62px] px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer shadow-sm select-none ${
                  link.id === 'spotify'
                    ? 'bg-[#090D1C] hover:bg-[#10162E] border border-[#1E274A] hover:border-[#1DB954]/50'
                    : link.id === 'anghami'
                    ? 'bg-[#090D1C] hover:bg-[#10162E] border border-[#1E274A] hover:border-[#9B51E0]/50'
                    : 'bg-[#080B17] hover:bg-[#0E1326] border border-[#171D36] hover:border-[#2C3763]'
                }`}
              >
                {/* Left: Platform Icon & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      link.id === 'spotify'
                        ? 'bg-[#121A33] text-[#1DB954]'
                        : link.id === 'anghami'
                        ? 'bg-[#181333] text-[#A855F7]'
                        : 'bg-[#1A1016] text-[#FF0000]'
                    }`}
                  >
                    <PlatformIcon platform={link.id} className="w-4 h-4" />
                  </div>

                  <div className="text-left truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm sm:text-base font-bold tracking-wider text-[#F4F4F8] uppercase group-hover:text-white transition-colors">
                        {link.title}
                      </span>
                      {link.highlightText && (
                        <span className="text-[8px] font-mono-custom font-bold tracking-widest text-[#9BA7CF] bg-[#141A33] border border-[#232D54] px-1.5 py-0.5 rounded">
                          {link.highlightText}
                        </span>
                      )}
                    </div>
                    {link.subtitle && (
                      <p className="text-[11px] font-mono-custom text-[#7E8BAF] truncate mt-0.5">
                        {link.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Arrow */}
                <div className="pl-2 text-[#68759E] group-hover:text-[#F4F4F8] transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </m.a>
            ))}
          </div>
        </section>

        {/* 4. SOCIAL SECTION: FOLLOW ATLAS */}
        <section className="w-full mt-7">
          <div className="flex items-center justify-between pb-3 px-1 border-b border-[#1A203B]/60 mb-3">
            <span className="text-[11px] font-mono-custom font-bold tracking-[0.22em] text-[#CCD4F0] uppercase">
              FOLLOW ATLAS
            </span>
            <span className="text-[9px] font-mono-custom tracking-[0.18em] text-[#707CA3] uppercase">
              SOCIAL
            </span>
          </div>

          <div className="space-y-2">
            {SOCIAL_LINKS.map((link, index) => (
              <m.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link);
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.25 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex items-center justify-between w-full px-4 py-3 bg-[#070A15] hover:bg-[#0C1122] border border-[#161B33] hover:border-[#283259] rounded-xl transition-all duration-150 cursor-pointer shadow-sm select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0F1426] border border-[#1E2647] flex items-center justify-center text-[#7E8BAF] group-hover:text-white shrink-0 transition-colors">
                    <PlatformIcon platform={link.id} className="w-4 h-4" />
                  </div>
                  <div className="text-left truncate">
                    <span className="font-display text-xs sm:text-sm font-bold tracking-wider text-[#DCE2F5] uppercase group-hover:text-white transition-colors block">
                      {link.title}
                    </span>
                    {link.subtitle && (
                      <p className="text-[10px] font-mono-custom text-[#707CA3] truncate">
                        {link.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pl-2 text-[#566285] group-hover:text-[#DCE2F5] transition-colors shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </m.a>
            ))}
          </div>
        </section>

        {/* 5. ARTIST INTRO */}
        <section className="w-full mt-8 p-5 rounded-2xl bg-[#070A14] border border-[#161B30] text-center">
          <span className="text-[10px] font-mono-custom tracking-[0.25em] text-[#6B76E8] uppercase font-bold block mb-1">
            ARTIST PROFILE
          </span>
          <h3 className="font-display text-lg font-black text-[#F4F4F8] tracking-wider uppercase">
            {ATLAS_PROFILE.name}
          </h3>
          <p className="text-[11px] font-mono-custom text-[#8692B8] uppercase tracking-[0.2em] mt-0.5">
            {ATLAS_PROFILE.role}
          </p>
          <p className="text-xs text-[#707CA3] mt-3 leading-relaxed max-w-xs mx-auto">
            {ATLAS_PROFILE.bio}
          </p>
        </section>

        {/* 6. FOOTER */}
        <SmartPageFooter />
      </main>

      {/* Manual Link Copy Fallback (shown only when native share & clipboard copy both fail) */}
      <AnimatePresence>
        {isManualCopyOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="atlas-manual-copy-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManualCopyOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />
            <m.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-sm bg-[#090D1C] border border-[#232D54] rounded-2xl p-5 shadow-2xl text-left"
            >
              <button
                type="button"
                onClick={() => setIsManualCopyOpen(false)}
                aria-label="Close manual copy dialog"
                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[#7E8BAF] hover:text-[#F4F4F8] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C67DE]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[#9BA7CF] mb-2">
                <Link2 className="w-4 h-4 text-[#5C67DE] shrink-0" />
                <h2
                  id="atlas-manual-copy-title"
                  className="text-xs font-mono-custom font-bold tracking-[0.18em] uppercase text-[#F4F4F8]"
                >
                  COPY LINK MANUALLY
                </h2>
              </div>

              <p className="text-xs text-[#8692B8] leading-relaxed mb-3">
                Automatic copying is unavailable here. Select and copy the link below:
              </p>

              <input
                ref={manualCopyInputRef}
                type="text"
                readOnly
                value={canonicalUrl}
                aria-label="ATLAS page URL"
                onFocus={(e) => e.currentTarget.select()}
                onClick={(e) => e.currentTarget.select()}
                className="w-full px-3 py-2.5 rounded-lg bg-[#05070E] border border-[#2C3763] text-xs font-mono-custom text-[#F4F4F8] select-all focus:outline-none focus:ring-2 focus:ring-[#5C67DE]"
              />
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subtle Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 z-50 bg-[#0E1428] border border-[#232D54] text-[#F4F4F8] px-4 py-2.5 rounded-lg text-xs font-mono-custom tracking-wider shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5C67DE]" />
            <span>{toastMessage}</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
