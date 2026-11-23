import React, { useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Headphones,
  Instagram,
  MessageCircle,
  Music,
  QrCode,
  Radio,
  Share2,
  Sparkles,
} from 'lucide-react';
import { ATLAS_PROFILE, MUSIC_STREAMING_LINKS, SOCIAL_LINKS } from '../data/atlasData';
import { BY_MARCOS_EXTERNAL_CONFIG, BY_MARCOS_SERVICES } from '../data/byMarcosData';
import { BrandSlug } from '../config/brands';
import { navigate } from '../router';

interface SwitcherBrandOption {
  slug: BrandSlug;
  label: string;
  sublabel: string;
  swatchClass: string;
  path: `/${BrandSlug}`;
}

export const HERO_SWITCHER_BRANDS: readonly SwitcherBrandOption[] = [
  {
    slug: 'atlas',
    label: 'ATLAS',
    sublabel: 'موسيقى',
    swatchClass: 'bg-[#5C67DE]',
    path: '/atlas',
  },
  {
    slug: 'sovi',
    label: 'SOVI',
    sublabel: 'هاند ميد',
    swatchClass: 'bg-[#8B6D93]',
    path: '/sovi',
  },
  {
    slug: 'bymarcos',
    label: 'BY MARCOS',
    sublabel: 'استوديو',
    swatchClass: 'bg-[#78343B]',
    path: '/bymarcos',
  },
] as const;

export const HeroPhoneSwitcher: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<BrandSlug>('atlas');
  const shouldReduceMotion = useReducedMotion();

  const currentOption =
    HERO_SWITCHER_BRANDS.find((b) => b.slug === activeBrand) ?? HERO_SWITCHER_BRANDS[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      // Account for RTL layout: ArrowLeft advances forward, ArrowRight goes back
      const delta = e.key === 'ArrowLeft' ? 1 : -1;
      const nextIndex =
        (index + delta + HERO_SWITCHER_BRANDS.length) % HERO_SWITCHER_BRANDS.length;
      setActiveBrand(HERO_SWITCHER_BRANDS[nextIndex].slug);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      {/* Top Pathway Header + Live Brand Selector */}
      <div className="w-full flex flex-col gap-3 pb-3.5 mb-4 border-b border-[#E8E8E4]">
        <div className="flex items-center justify-between text-[11px] font-mono-custom text-[#706E6B]">
          <span className="font-semibold tracking-wider">TAPP CARD</span>
          <span className="text-[#121211] font-bold">TAP / SCAN</span>
          <span className="font-semibold tracking-wider">LIVE PREVIEW</span>
        </div>

        {/* Interactive Brand Switcher Tabs */}
        <div
          role="tablist"
          aria-label="اختر براند لمعاينة صفحته الذكية"
          className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#EFEFEA] border border-[#E2E2DC]"
        >
          {HERO_SWITCHER_BRANDS.map((brand, index) => {
            const isSelected = activeBrand === brand.slug;
            return (
              <button
                key={brand.slug}
                type="button"
                role="tab"
                id={`hero-tab-${brand.slug}`}
                aria-selected={isSelected}
                aria-controls="hero-phone-preview-panel"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveBrand(brand.slug)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`min-h-[40px] px-2 sm:px-3 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121211] ${
                  isSelected
                    ? 'bg-white text-[#121211] shadow-xs border border-[#DFDFD8] font-bold'
                    : 'text-[#666460] hover:text-[#121211] font-medium'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full shrink-0 ${brand.swatchClass}`}
                />
                <span dir="ltr" className="text-[11px] font-mono-custom tracking-tight truncate">
                  {brand.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Physical Card + Connector + Interactive Smartphone Composition */}
      <div className="w-full relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
        {/* 1. Physical Matte Obsidian TAPP Card */}
        <div
          dir="ltr"
          className="w-full max-w-[240px] sm:w-52 aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-[#1C1C1A] via-[#121211] to-[#0A0A09] p-4 sm:p-5 text-white shadow-xl border border-[#2B2B28] flex flex-col justify-between relative overflow-hidden select-none shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-[#FAFAF8]">
              TAPP
            </span>
            <div className="flex items-center gap-1 text-[#C5A880]">
              <Radio className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[9px] font-mono-custom font-bold tracking-widest">NFC</span>
            </div>
          </div>

          <div className="my-auto relative z-10">
            <span className="text-[9px] font-mono-custom tracking-[0.22em] text-[#C5A880] uppercase block font-bold">
              TAP TO CONNECT
            </span>
            <span className="text-[8px] font-mono-custom text-[#9B9993] tracking-wider block mt-0.5 truncate">
              {currentOption.label} · /{currentOption.slug}
            </span>
          </div>

          <div className="flex items-end justify-between relative z-10 border-t border-white/10 pt-2 text-[8px] font-mono-custom text-[#8C8A84]">
            <div>
              <span className="block text-white/90 font-medium">SMART CARD</span>
              <span>NFC + QR</span>
            </div>
            <div className="w-6 h-6 bg-white p-0.5 rounded-sm flex items-center justify-center shadow-xs">
              <QrCode className="w-full h-full text-[#121211]" />
            </div>
          </div>
        </div>

        {/* Connecting Direction Indicator */}
        <div className="flex sm:flex-col items-center justify-center gap-1 text-[#706E6B] text-[10px] font-mono-custom shrink-0">
          <span className="font-bold tracking-widest uppercase text-[#121211]">TAP</span>
          <ArrowLeft className="w-3.5 h-3.5 hidden sm:block text-[#121211]" />
        </div>

        {/* 2. Interactive Smartphone Preview */}
        <div
          id="hero-phone-preview-panel"
          role="tabpanel"
          aria-labelledby={`hero-tab-${activeBrand}`}
          className="w-[236px] sm:w-[228px] shrink-0"
        >
          <div className="rounded-[28px] bg-[#141413] p-2 border-[2.5px] border-[#2A2A28] shadow-2xl">
            <AnimatePresence mode="wait" initial={false}>
              {activeBrand === 'atlas' && (
                <m.div
                  key="atlas"
                  dir="ltr"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[21px] bg-[#05070E] text-[#F4F4F8] p-3.5 min-h-[292px] flex flex-col justify-between border border-[#1E274A] select-none"
                >
                  <div>
                    {/* Phone Top Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#1A203B]/70 text-[8px] font-mono-custom text-[#707CA3]">
                      <span>tapp-link</span>
                      <span className="text-[#CCD4F0]">/atlas</span>
                    </div>

                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#0E1428] border border-[#232D54] flex items-center justify-center text-[#5C67DE] mb-1.5">
                        <Music className="w-4 h-4" />
                      </div>
                      <span className="font-display text-sm font-black tracking-wider text-[#F4F4F8]">
                        {ATLAS_PROFILE.name}
                      </span>
                      <span className="text-[7px] font-mono-custom text-[#7E8BAF] tracking-[0.16em] uppercase mt-0.5">
                        {ATLAS_PROFILE.role}
                      </span>
                    </div>

                    {/* Real ATLAS Links */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#090D1C] border border-[#1E274A] text-[8px] font-mono-custom">
                        <span className="flex items-center gap-1.5 text-[#F4F4F8] font-bold">
                          <Headphones className="w-2.5 h-2.5 text-[#1DB954]" />
                          <span>{MUSIC_STREAMING_LINKS[0].title}</span>
                        </span>
                        <span className="text-[#9BA7CF]">STREAM</span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#090D1C] border border-[#1E274A] text-[8px] font-mono-custom">
                        <span className="text-[#DCE2F5] font-bold">
                          {MUSIC_STREAMING_LINKS[1].title}
                        </span>
                        <span className="text-[#9BA7CF]">STREAM</span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#070A15] border border-[#161B33] text-[8px] font-mono-custom">
                        <span className="text-[#9BA7CF] truncate">
                          {SOCIAL_LINKS[0].title} · @atlasxoffical
                        </span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-[#68759E] shrink-0" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/atlas')}
                    className="w-full mt-3 py-2 bg-[#5C67DE] hover:bg-[#4F5AD1] text-white text-[10px] font-arabic font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span dir="rtl">افتح صفحة ATLAS</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </m.div>
              )}

              {activeBrand === 'sovi' && (
                <m.div
                  key="sovi"
                  dir="ltr"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[21px] bg-[#FAF8F5] text-[#34203B] p-3.5 min-h-[292px] flex flex-col justify-between border border-[#E5DEED] select-none"
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#E8DFEF] text-[8px] font-mono-custom text-[#7B5D83]">
                      <span>SOVI OFFICIAL</span>
                      <span>/sovi</span>
                    </div>

                    {/* SOVI Identity */}
                    <div className="flex flex-col items-center text-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#F3EDF7] border border-[#D6C7DE] flex items-center justify-center text-[#7D5B84] mb-1.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-serif-custom text-lg tracking-[0.22em] text-[#34203B] uppercase leading-none">
                        SOVI
                      </span>
                      <span className="text-[7px] font-mono-custom text-[#7D5B84] tracking-[0.22em] uppercase mt-1">
                        HANDMADE GOODS
                      </span>
                      <span className="text-[8px] italic text-[#735A7A] mt-1">
                        “Handmade pieces, made with love.”
                      </span>
                    </div>

                    {/* Real SOVI Links */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#F4EBF7] border border-[#E2D4E8] text-[8px]">
                        <span className="flex items-center gap-1.5 font-medium text-[#34203B]">
                          <Instagram className="w-2.5 h-2.5 text-[#5C3D61]" />
                          <span>Instagram · @sovi_storee</span>
                        </span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-[#8B6D93]" />
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#F4EBF7] border border-[#E2D4E8] text-[8px]">
                        <span className="flex items-center gap-1.5 font-medium text-[#34203B]">
                          <MessageCircle className="w-2.5 h-2.5 text-[#5C3D61]" />
                          <span>WhatsApp Community</span>
                        </span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-[#8B6D93]" />
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#F6F0F8] border border-[#E8DFEF] text-[8px] font-mono-custom text-[#7D5B84]">
                        <span>FOUNDER · SARA MAHMOUD</span>
                        <Share2 className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/sovi')}
                    className="w-full mt-3 py-2 bg-[#34203B] hover:bg-[#492E53] text-[#FAF8F5] text-[10px] font-arabic font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34203B]"
                  >
                    <span dir="rtl">افتح صفحة SOVI</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </m.div>
              )}

              {activeBrand === 'bymarcos' && (
                <m.div
                  key="bymarcos"
                  dir="ltr"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[21px] bg-[#101010] text-[#F4F0EA] p-3.5 min-h-[292px] flex flex-col justify-between border border-[#292929] select-none"
                >
                  <div>
                    {/* Editorial Top Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#292929] text-[8px] font-mono-custom text-[#9E9990]">
                      <span className="text-[#C4636D] font-semibold">01 · STUDIO</span>
                      <span>/bymarcos</span>
                    </div>

                    {/* BY MARCOS Frame */}
                    <div className="relative p-2.5 border border-[#292929] mb-2.5">
                      <span
                        aria-hidden="true"
                        className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#78343B]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#78343B]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#78343B]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#78343B]"
                      />

                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-custom text-lg font-semibold tracking-tight text-[#F4F0EA] leading-none">
                          BY MARCOS
                        </span>
                        <Camera className="w-3.5 h-3.5 text-[#C4636D]" />
                      </div>
                      <span className="block font-mono-custom text-[7px] tracking-[0.16em] text-[#D8D3CA] uppercase">
                        THE RED FRAME COLLECTIVE
                      </span>
                      <span className="block font-mono-custom text-[7px] text-[#9E9990] mt-1">
                        {BY_MARCOS_EXTERNAL_CONFIG.locationDetail}
                      </span>
                    </div>

                    {/* Services & Connection Preview */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-2 py-1 border-b border-[#292929] text-[8px] font-mono-custom">
                        <span className="text-[#9E9990]">
                          {BY_MARCOS_SERVICES[0].number} — {BY_MARCOS_SERVICES[0].name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 border-b border-[#292929] text-[8px] font-mono-custom">
                        <span className="text-[#9E9990]">
                          {BY_MARCOS_SERVICES[3].number} — {BY_MARCOS_SERVICES[3].name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 text-[8px] font-mono-custom text-[#D8D3CA]">
                        <span>WhatsApp · {BY_MARCOS_EXTERNAL_CONFIG.instagramHandle}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-[#C4636D]" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/bymarcos')}
                    className="w-full mt-3 py-2 bg-[#78343B] hover:bg-[#8E3F47] text-[#F4F0EA] text-[10px] font-arabic font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0EA]"
                  >
                    <span dir="rtl">افتح صفحة BY MARCOS</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Honest Preview Caption */}
      <p className="mt-3 text-[11px] text-[#706E6B] text-center">
        معاينة مصغرة لهوية كل براند — اضغط على الزرار جوه الشاشة لتجربة الصفحة الكاملة.
      </p>
    </div>
  );
};
