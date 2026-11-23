import React, { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  QrCode,
  X,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Share2,
  UserPlus,
} from 'lucide-react';
import { BRAND_FOOTER_CONFIG } from '../config/brands';
import { BRAND_SEO } from '../config/seoRoutes.mjs';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { navigate } from '../router';
import { getBrandCanonicalUrl } from '../utils/url';
import { copyTextToClipboard, shareBrandPage } from '../utils/share';
import { getBrandContactInput, isBrandContactEligible } from '../data/brandContacts';
import {
  BY_MARCOS_EXTERNAL_CONFIG,
  BY_MARCOS_SERVICES,
  getByMarcosBookingWhatsAppUrl,
  getByMarcosLocationMapUrl,
  getByMarcosWebsiteUrl,
} from '../data/byMarcosData';

const MODAL_EASE = [0.16, 1, 0.3, 1] as const;

export const ByMarcosPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrSvg, setQrSvg] = useState('');
  const [qrError, setQrError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useDocumentMeta({
    title: BRAND_SEO.bymarcos.title,
    description: BRAND_SEO.bymarcos.description,
    canonicalPath: BRAND_SEO.bymarcos.canonicalPath,
    lang: 'en',
    dir: 'ltr',
    ogLocale: BRAND_SEO.bymarcos.ogLocale,
    ogImagePath: BRAND_SEO.bymarcos.ogImagePath,
    ogImageAlt: BRAND_SEO.bymarcos.ogImageAlt,
    ogType: BRAND_SEO.bymarcos.ogType,
  });

  const closeQrButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const canonicalUrl = getBrandCanonicalUrl('bymarcos');
  const bookingUrl = getByMarcosBookingWhatsAppUrl();
  const websiteUrl = getByMarcosWebsiteUrl();
  const locationMapUrl = getByMarcosLocationMapUrl();
  const contactInput = getBrandContactInput('bymarcos');
  const showSaveContact = isBrandContactEligible('bymarcos');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2400);
  };

  useEffect(() => {
    if (!isQrOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    let cancelled = false;
    setQrError(false);

    import('../utils/qr')
      .then(({ generateBrandQrSvg }) =>
        generateBrandQrSvg(canonicalUrl, {
          darkColor: '#111110',
          lightColor: '#FFFFFF',
          margin: 3,
          errorCorrectionLevel: 'M',
        })
      )
      .then((svg) => {
        if (!cancelled) setQrSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      });

    const focusTimer = window.setTimeout(() => {
      closeQrButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQrOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelled = true;
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isQrOpen, canonicalUrl]);

  const handleCopyUrl = async () => {
    const ok = await copyTextToClipboard(canonicalUrl);
    if (ok) {
      setCopied(true);
      showToast('URL COPIED TO CLIPBOARD');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('UNABLE TO COPY AUTOMATICALLY');
    }
  };

  const handleSharePage = async () => {
    const outcome = await shareBrandPage({
      title: 'BY MARCOS',
      text: 'Photography, editorial portraiture, and visual direction by BY MARCOS.',
      url: canonicalUrl,
    });

    if (outcome === 'shared') {
      showToast('PAGE SHARED');
    } else if (outcome === 'copied') {
      setCopied(true);
      showToast('URL COPIED TO CLIPBOARD');
      setTimeout(() => setCopied(false), 2000);
    } else if (outcome === 'failed' || outcome === 'unavailable') {
      showToast('SHARE UNAVAILABLE — USE COPY OR QR');
    }
  };

  const handleSaveContact = async () => {
    if (!showSaveContact) return;
    try {
      const { downloadBrandVCard } = await import('../utils/vcard');
      const ok = downloadBrandVCard(contactInput);
      if (ok) {
        showToast('CONTACT CARD (.VCF) DOWNLOADED');
      } else {
        showToast('UNABLE TO EXPORT CONTACT FILE');
      }
    } catch {
      showToast('UNABLE TO EXPORT CONTACT FILE');
    }
  };

  const handleDownloadSvg = async () => {
    try {
      const { downloadBrandQrSvg } = await import('../utils/qr');
      await downloadBrandQrSvg(canonicalUrl, 'bymarcos', {
        darkColor: '#111110',
        lightColor: '#FFFFFF',
        margin: 3,
      });
      showToast('SVG QR DOWNLOADED');
    } catch {
      showToast('SVG EXPORT FAILED');
    }
  };

  const handleDownloadPng = async () => {
    try {
      const { downloadBrandQrPng } = await import('../utils/qr');
      await downloadBrandQrPng(canonicalUrl, 'bymarcos', {
        size: 1024,
        darkColor: '#111110',
        lightColor: '#FFFFFF',
        margin: 3,
      });
      showToast('PNG QR DOWNLOADED (1024PX)');
    } catch {
      showToast('PNG EXPORT FAILED');
    }
  };

  return (
    <div
      dir="ltr"
      lang="en"
      className="min-h-screen bg-[#0A0A09] text-[#F4F0EA] relative flex flex-col items-center justify-center antialiased font-body selection:bg-[#9E3039] selection:text-[#F4F0EA] sm:py-10 sm:px-6"
    >
      {/* Subtle darkroom film grain */}
      <div
        aria-hidden="true"
        className="fixed inset-0 film-grain opacity-20 pointer-events-none z-30"
      />

      {/* Unified Editorial Sheet */}
      <div className="w-full max-w-[520px] mx-auto relative z-10 flex-1 sm:flex-initial flex flex-col bg-[#111110] sm:border sm:border-[#232220] sm:shadow-[0_28px_80px_-24px_rgba(0,0,0,0.85)]">
        <main className="flex-1 flex flex-col">
          {/* ─── BAND 1: EDITORIAL MONUMENTAL IDENTITY & FRAMED STATEMENT ─── */}
          <header
            aria-labelledby="bymarcos-title"
            className="bg-[#111110] px-6 sm:px-9 pt-7 sm:pt-9 pb-8 sm:pb-10"
          >
            {/* Masthead Location Line */}
            <div className="flex items-center gap-3.5 text-[11px] font-mono-custom tracking-[0.2em] text-[#9E988E] uppercase mb-7 sm:mb-8">
              <span>{BY_MARCOS_EXTERNAL_CONFIG.locationDetail}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-[#262523]" />
            </div>

            {/* Full-Width Display Wordmark */}
            <h1
              id="bymarcos-title"
              className="font-serif-custom text-[#F4F0EA] tracking-tight"
            >
              <span className="block text-[11px] sm:text-xs font-mono-custom font-normal tracking-[0.34em] text-[#E07E87] uppercase mb-2">
                BY
              </span>
              <span className="block text-[clamp(3.45rem,17.8vw,5.75rem)] font-semibold leading-[0.84] tracking-[-0.025em] -ml-[2px]">
                MARCOS
              </span>
            </h1>

            {/* Signature Architectural Red Frame Anchoring the Editorial Statement */}
            <div className="mt-7 sm:mt-8 relative border border-[#9E353F] px-5 sm:px-6 py-5 sm:py-6">
              {/* Quiet optical corner ticks for darkroom print poise */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4626D]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4626D]"
              />

              <p className="font-serif-custom text-[1.32rem] sm:text-[1.52rem] font-normal leading-[1.28] text-[#F4F0EA]">
                EVERY FRAME HAS A STORY.
                <span className="block italic text-[#D5CFC4] mt-1">
                  EVERY STORY HAS A FEELING.
                </span>
              </p>
            </div>
          </header>

          {/* ─── BAND 2: WARM ARCHIVAL IVORY SERVICES INDEX & STUDIO COLOPHON ─── */}
          <section
            aria-labelledby="practice-heading"
            className="bg-[#EFECE4] text-[#141413] px-6 sm:px-9 py-8 sm:py-9 border-t-2 border-[#9E353F]"
          >
            <div className="flex items-baseline justify-between gap-3 pb-3 border-b border-[#141413]/25">
              <h2
                id="practice-heading"
                className="text-xs font-mono-custom font-bold tracking-[0.2em] uppercase text-[#141413]"
              >
                SERVICES
              </h2>
              <span className="text-[11px] font-mono-custom tracking-[0.16em] text-[#8C2D36] font-bold uppercase tabular-nums">
                01 — 06
              </span>
            </div>

            {/* 2-Column Numbered Editorial Index (clean row dividers, zero double bottom rule) */}
            <ol className="grid grid-cols-2 gap-x-5 sm:gap-x-8">
              {BY_MARCOS_SERVICES.map((service, index) => {
                const isLastRow = index >= BY_MARCOS_SERVICES.length - 2;
                return (
                  <li
                    key={service.number}
                    className={`py-4 flex flex-col justify-start ${
                      isLastRow ? '' : 'border-b border-[#141413]/15'
                    }`}
                  >
                    <span className="font-mono-custom text-[11px] font-bold tracking-[0.16em] text-[#8C2D36] tabular-nums mb-1.5">
                      {service.number}
                    </span>
                    <span className="font-serif-custom text-[15px] sm:text-[17px] font-semibold tracking-[0.01em] text-[#141413] leading-[1.24]">
                      {service.name}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* Studio Location Colophon */}
            <div className="mt-2 pt-5 border-t border-[#141413]/25">
              <span className="block text-[11px] font-mono-custom font-bold tracking-[0.18em] text-[#8C2D36] uppercase mb-1.5">
                STUDIO ADDRESS
              </span>
              <address className="not-italic text-xs sm:text-[13px] font-body font-medium tracking-[0.02em] text-[#2B2926] leading-[1.6]">
                {BY_MARCOS_EXTERNAL_CONFIG.studioAddress}
              </address>

              {locationMapUrl && (
                <div className="mt-3">
                  <a
                    href={locationMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 text-xs font-mono-custom font-bold tracking-[0.14em] text-[#8C2D36] hover:text-[#141413] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C2D36]"
                  >
                    <span>Open Location Map</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* ─── BAND 3: REFINED DARK CHARCOAL CONTACT DIRECTORY & UTILITIES ─── */}
          <section
            aria-labelledby="connection-heading"
            className="bg-[#111110] text-[#F4F0EA] px-6 sm:px-9 pt-8 pb-7"
          >
            <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-[#252422] mb-5">
              <h2
                id="connection-heading"
                className="text-xs font-mono-custom font-bold tracking-[0.2em] uppercase text-[#E07E87]"
              >
                CONNECT
              </h2>
              <span className="text-xs text-[#9E988E]">
                Direct booking &amp; links
              </span>
            </div>

            {/* Single Dominant Primary Action: WhatsApp Booking */}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact BY MARCOS on WhatsApp for direct inquiries and booking"
              className="group flex items-center justify-between gap-4 w-full min-h-[72px] px-5 py-4 bg-[#191213] hover:bg-[#221618] active:bg-[#291A1D] border border-[#9E353F] hover:border-[#C95C66] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07E87]"
            >
              <div className="min-w-0">
                <span className="block text-[11px] font-mono-custom tracking-[0.16em] text-[#E07E87] uppercase">
                  DIRECT INQUIRIES &amp; BOOKING
                </span>
                <span className="font-serif-custom text-[1.75rem] sm:text-[1.9rem] font-semibold text-[#F4F0EA] tracking-tight block leading-none mt-1.5">
                  WhatsApp
                </span>
                <span className="block text-[13px] text-[#C5BFB5] mt-1.5">
                  Start a direct conversation
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#E07E87] group-hover:text-[#F4F0EA] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Editorial Directory Rows: Instagram, Facebook, & Conditional Portfolio Website */}
            <div className="mt-5 border-t border-b border-[#252422] divide-y divide-[#252422]">
              <a
                href={BY_MARCOS_EXTERNAL_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow BY MARCOS on Instagram (@bymarrcos)"
                className="group flex items-center justify-between gap-3 min-h-[56px] py-3.5 hover:bg-[#161614] px-1 -mx-1 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
              >
                <span className="font-serif-custom text-[1.35rem] font-semibold text-[#F4F0EA] leading-tight">
                  Instagram
                </span>
                <span className="inline-flex items-center gap-2.5 text-xs font-mono-custom tracking-wide text-[#B8B2A8] group-hover:text-[#F4F0EA] transition-colors">
                  <span>{BY_MARCOS_EXTERNAL_CONFIG.instagramHandle}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#E07E87] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>

              <a
                href={BY_MARCOS_EXTERNAL_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BY MARCOS on Facebook"
                className="group flex items-center justify-between gap-3 min-h-[56px] py-3.5 hover:bg-[#161614] px-1 -mx-1 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
              >
                <span className="font-serif-custom text-[1.35rem] font-semibold text-[#F4F0EA] leading-tight">
                  Facebook
                </span>
                <span className="inline-flex items-center gap-2.5 text-xs font-mono-custom tracking-wide text-[#B8B2A8] group-hover:text-[#F4F0EA] transition-colors">
                  <span>Official Page</span>
                  <ArrowUpRight className="w-4 h-4 text-[#E07E87] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit BY MARCOS standalone portfolio website"
                  className="group flex items-center justify-between gap-3 min-h-[56px] py-3.5 hover:bg-[#161614] px-1 -mx-1 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
                >
                  <span className="font-serif-custom text-[1.35rem] font-semibold text-[#F4F0EA] leading-tight">
                    Portfolio
                  </span>
                  <span className="inline-flex items-center gap-2.5 text-xs font-mono-custom tracking-wide text-[#B8B2A8] group-hover:text-[#F4F0EA] transition-colors">
                    <span>Website</span>
                    <ArrowUpRight className="w-4 h-4 text-[#E07E87] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              )}
            </div>

            {/* Unified Touch Utility Module: Save Contact (.vcf), Share, QR Code */}
            <div className="mt-5 border border-[#272624] bg-[#151513] divide-y divide-[#272624]">
              {showSaveContact && (
                <button
                  type="button"
                  onClick={handleSaveContact}
                  title="Download a vCard (.vcf) file to import BY MARCOS into your Contacts"
                  aria-label="Save BY MARCOS Contact (.vcf)"
                  className="w-full min-h-[50px] inline-flex items-center justify-center gap-2.5 px-4 py-3 hover:bg-[#1D1C19] active:bg-[#242320] text-xs font-mono-custom font-bold tracking-[0.14em] text-[#F4F0EA] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E07E87]"
                >
                  <UserPlus className="w-4 h-4 text-[#E07E87] shrink-0" />
                  <span>Save Contact (.vcf)</span>
                </button>
              )}

              <div className="grid grid-cols-2 divide-x divide-[#272624]">
                <button
                  type="button"
                  onClick={handleSharePage}
                  aria-label="Share BY MARCOS page"
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 hover:bg-[#1D1C19] active:bg-[#242320] text-xs font-mono-custom font-bold tracking-[0.14em] text-[#D5CFC4] hover:text-[#F4F0EA] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E07E87]"
                >
                  <Share2 className="w-4 h-4 text-[#E07E87] shrink-0" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  aria-label="Open BY MARCOS QR Code"
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 hover:bg-[#1D1C19] active:bg-[#242320] text-xs font-mono-custom font-bold tracking-[0.14em] text-[#F4F0EA] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E07E87]"
                >
                  <QrCode className="w-4 h-4 text-[#E07E87] shrink-0" />
                  <span>QR Code</span>
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* ─── EDITORIAL FOOTER ─── */}
        <footer className="bg-[#111110] px-6 sm:px-9 pt-5 pb-7 border-t border-[#22211F]">
          <div className="flex items-center justify-between gap-4">
            <p className="font-serif-custom text-lg font-semibold text-[#F4F0EA] tracking-tight leading-none whitespace-nowrap">
              BY MARCOS
            </p>

            <button
              type="button"
              onClick={() => navigate(BRAND_FOOTER_CONFIG.explorePath)}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono-custom font-bold tracking-[0.14em] text-[#D5CFC4] hover:text-[#F4F0EA] uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07E87]"
            >
              <span className="border-b border-[#9E353F]/75 pb-0.5">
                {BRAND_FOOTER_CONFIG.exploreLabel}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#E07E87]" />
            </button>
          </div>

          <p className="mt-2.5 text-[11px] font-body text-[#9E988E]">
            {BRAND_FOOTER_CONFIG.attributionText}
          </p>
        </footer>
      </div>

      {/* ─── QR CODE & PRINT EXPORT MODAL ─── */}
      <AnimatePresence>
        {isQrOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bymarcos-qr-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQrOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />

            <m.div
              initial={shouldReduceMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18, ease: MODAL_EASE }}
              className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto bg-[#111110] border border-[#9E353F] z-10 p-6 shadow-2xl flex flex-col items-center text-center"
            >
              <button
                ref={closeQrButtonRef}
                type="button"
                onClick={() => setIsQrOpen(false)}
                className="absolute top-3.5 right-3.5 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#9E988E] hover:text-[#F4F0EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
                aria-label="Close QR Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <h3
                id="bymarcos-qr-modal-title"
                className="font-serif-custom text-2xl text-[#F4F0EA] tracking-tight mt-1 px-8"
              >
                BY MARCOS — DIGITAL CARD
              </h3>
              <p className="text-[10px] font-mono-custom tracking-[0.2em] text-[#E07E87] uppercase mt-1">
                TAPP NFC &amp; SCANNABLE GATEWAY
              </p>

              <div className="my-5 p-3 bg-white select-none">
                {qrError ? (
                  <div className="w-40 h-40 flex items-center justify-center text-xs font-mono-custom text-[#111110]">
                    QR UNAVAILABLE
                  </div>
                ) : qrSvg ? (
                  <div
                    className="w-40 h-40 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                    aria-label={`Scannable QR code for ${canonicalUrl}`}
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                ) : (
                  <div className="w-40 h-40 bg-[#E5E3DE] animate-pulse" />
                )}
              </div>

              <p className="text-[11px] font-mono-custom text-[#9E988E] truncate max-w-full mb-4 px-2">
                {canonicalUrl}
              </p>

              <div className="w-full grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#161614] hover:bg-[#20201D] border border-[#2C2B28] hover:border-[#9E353F] text-[11px] font-mono-custom tracking-wider text-[#F4F0EA] transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#E07E87] shrink-0" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9E988E] shrink-0" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSharePage}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#161614] hover:bg-[#20201D] border border-[#2C2B28] hover:border-[#9E353F] text-[11px] font-mono-custom tracking-wider text-[#F4F0EA] transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#E07E87] shrink-0" />
                  <span>Share Page</span>
                </button>
              </div>

              <div className="w-full grid grid-cols-2 gap-2.5 mt-2.5">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#161614] hover:bg-[#20201D] border border-[#2C2B28] hover:border-[#9E353F] text-[10px] sm:text-[11px] font-mono-custom text-[#D5CFC4] transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
                >
                  <Download className="w-3.5 h-3.5 text-[#E07E87] shrink-0" />
                  <span>Export SVG</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#161614] hover:bg-[#20201D] border border-[#2C2B28] hover:border-[#9E353F] text-[10px] sm:text-[11px] font-mono-custom text-[#D5CFC4] transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
                >
                  <Download className="w-3.5 h-3.5 text-[#E07E87] shrink-0" />
                  <span>Export PNG (1024px)</span>
                </button>
              </div>

              {showSaveContact && (
                <div className="w-full mt-3 pt-3 border-t border-[#252422]">
                  <button
                    type="button"
                    onClick={handleSaveContact}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 bg-[#161614] hover:bg-[#20201D] border border-[#2C2B28] hover:border-[#9E353F] text-[11px] font-mono-custom tracking-wider text-[#F4F0EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E353F]"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#E07E87]" />
                    <span>Save Contact (.vcf)</span>
                  </button>
                  <p className="mt-1.5 text-[10px] text-[#9E988E]">
                    Downloads a contact file to import into your phone.
                  </p>
                </div>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subtle Toast */}
      <AnimatePresence>
        {toastMessage && (
          <m.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#161614] border border-[#9E353F] text-[#F4F0EA] px-4 py-2.5 text-xs font-mono-custom tracking-wider shadow-2xl flex items-center gap-2 whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E07E87]" />
            <span>{toastMessage}</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
