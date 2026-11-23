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

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Minimal viewfinder corner tick motif — pure geometric framing marks,
 * never functioning as a standalone logo.
 */
const ViewfinderCorners: React.FC<{ sizeClass?: string; tone?: 'oxblood' | 'graphite' }> = ({
  sizeClass = 'w-4 h-4',
  tone = 'oxblood',
}) => {
  const borderColor = tone === 'oxblood' ? 'border-[#78343B]' : 'border-[#292929]';
  return (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 ${sizeClass} border-t border-l ${borderColor}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 right-0 ${sizeClass} border-t border-r ${borderColor}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-0 ${sizeClass} border-b border-l ${borderColor}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 right-0 ${sizeClass} border-b border-r ${borderColor}`}
      />
    </>
  );
};

export const ByMarcosPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrSvg, setQrSvg] = useState('');
  const [qrError, setQrError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enforce consistent English metadata & LTR layout on BY MARCOS
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
          darkColor: '#101010',
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
      title: 'BY MARCOS — THE RED FRAME COLLECTIVE',
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
        darkColor: '#101010',
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
        darkColor: '#101010',
        lightColor: '#FFFFFF',
        margin: 3,
      });
      showToast('PNG QR DOWNLOADED (1024PX)');
    } catch {
      showToast('PNG EXPORT FAILED');
    }
  };

  const sectionRevealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.65, ease: CINEMATIC_EASE },
      };

  return (
    <div
      dir="ltr"
      lang="en"
      className="min-h-screen bg-[#101010] text-[#F4F0EA] relative flex flex-col justify-between antialiased font-body selection:bg-[#78343B] selection:text-[#F4F0EA]"
    >
      {/* Subtle analog film grain overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 film-grain opacity-30 pointer-events-none z-30"
      />

      {/* Top Navigation Bar */}
      <header className="w-full border-b border-[#292929] bg-[#101010]/95 relative z-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Wordmark */}
          <a
            href="#signature"
            className="font-serif-custom text-xl font-semibold tracking-tight text-[#F4F0EA] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
          >
            BY MARCOS
          </a>

          {/* Zone 2: Minimal Section Anchors */}
          <nav
            aria-label="Page sections"
            className="hidden md:flex items-center gap-7 text-xs font-mono-custom tracking-[0.18em] text-[#9E9990] uppercase"
          >
            <a
              href="#statement"
              className="hover:text-[#F4F0EA] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:text-[#F4F0EA] focus-visible:underline"
            >
              Statement
            </a>
            <a
              href="#practice"
              className="hover:text-[#F4F0EA] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:text-[#F4F0EA] focus-visible:underline"
            >
              Practice
            </a>
            <a
              href="#presence"
              className="hover:text-[#F4F0EA] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:text-[#F4F0EA] focus-visible:underline"
            >
              Presence
            </a>
            <a
              href="#connection"
              className="hover:text-[#F4F0EA] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:text-[#F4F0EA] focus-visible:underline"
            >
              Connect
            </a>
          </nav>

          {/* Zone 3: Single Primary Utility Control (QR Digital Card Modal) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsQrOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#191919] hover:bg-[#222222] active:bg-[#292929] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom tracking-[0.2em] text-[#F4F0EA] uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
              aria-label="Open BY MARCOS QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-[#78343B]" />
              <span>QR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Editorial Canvas */}
      <main className="w-full max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 flex-1">
        {/* ─── SECTION 01 — THE SIGNATURE ─── */}
        <section
          id="signature"
          className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36"
        >
          <div className="relative py-10 px-4 sm:py-14 sm:px-10 border border-[#292929]/70">
            <ViewfinderCorners sizeClass="w-4 h-4 sm:w-5 sm:h-5" tone="oxblood" />

            {/* Unboxed metadata index */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-8 sm:pb-12 border-b border-[#292929] text-[11px] font-mono-custom tracking-[0.2em] uppercase">
              <div className="flex items-center gap-2.5 text-[#9E9990]">
                <span className="text-[#C4636D] font-semibold">01</span>
                <span aria-hidden="true" className="text-[#59554F]">·</span>
                <span>INDEPENDENT CREATIVE STUDIO</span>
              </div>
              <span className="text-[#9E9990]">
                {BY_MARCOS_EXTERNAL_CONFIG.locationDetail}
              </span>
            </div>

            {/* Dominant Existing Wordmark */}
            <div className="pt-10 pb-6 sm:pt-14 sm:pb-8">
              <div className="overflow-hidden">
                <m.h1
                  initial={shouldReduceMotion ? false : { y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
                  className="font-serif-custom text-[clamp(2.5rem,10.5vw,7.25rem)] font-semibold tracking-tight text-[#F4F0EA] leading-[0.92] text-left"
                >
                  BY MARCOS
                </m.h1>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-px w-8 sm:w-12 bg-[#78343B] shrink-0"
                />
                <div className="overflow-hidden">
                  <m.p
                    initial={shouldReduceMotion ? false : { y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: CINEMATIC_EASE }}
                    className="font-mono-custom text-xs sm:text-sm tracking-[0.26em] text-[#D8D3CA] uppercase"
                  >
                    THE RED FRAME COLLECTIVE
                  </m.p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 02 — THE STATEMENT ─── */}
        <m.section
          id="statement"
          aria-labelledby="statement-heading"
          {...sectionRevealProps}
          className="py-16 sm:py-24 lg:py-28 border-t border-[#292929]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-3 flex items-center gap-3 text-[11px] font-mono-custom tracking-[0.22em] uppercase">
              <span className="text-[#C4636D] font-semibold">02</span>
              <span aria-hidden="true" className="text-[#59554F]">—</span>
              <span className="text-[#9E9990]">THE STATEMENT</span>
            </div>

            <div className="lg:col-span-9">
              <h2
                id="statement-heading"
                className="font-serif-custom text-[clamp(2.25rem,5.4vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-[#F4F0EA] max-w-3xl"
              >
                <span className="block overflow-hidden">
                  <m.span
                    className="block"
                    initial={shouldReduceMotion ? false : { y: '100%', opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.65, ease: CINEMATIC_EASE }}
                  >
                    EVERY FRAME HAS A STORY.
                  </m.span>
                </span>
                <span className="block overflow-hidden mt-2 sm:mt-3">
                  <m.span
                    className="block italic text-[#D9D3C9]"
                    initial={shouldReduceMotion ? false : { y: '100%', opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: CINEMATIC_EASE }}
                  >
                    EVERY STORY HAS A FEELING.
                  </m.span>
                </span>
              </h2>
              <div
                aria-hidden="true"
                className="mt-8 sm:mt-10 h-px w-20 bg-[#78343B]"
              />
            </div>
          </div>
        </m.section>

        {/* ─── SECTION 03 — THE CREATIVE PRACTICE ─── */}
        <m.section
          id="practice"
          aria-labelledby="practice-heading"
          {...sectionRevealProps}
          className="py-16 sm:py-24 lg:py-28 border-t border-[#292929]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#292929]">
            <div className="flex items-center gap-3 text-[11px] font-mono-custom tracking-[0.22em] uppercase">
              <span className="text-[#C4636D] font-semibold">03</span>
              <span aria-hidden="true" className="text-[#59554F]">—</span>
              <h2 id="practice-heading" className="text-[#F4F0EA]">
                THE CREATIVE PRACTICE
              </h2>
            </div>
            <span className="text-[11px] font-mono-custom tracking-[0.2em] text-[#9E9990] uppercase">
              SERVICES INDEX
            </span>
          </div>

          <ol className="divide-y divide-[#292929]">
            {BY_MARCOS_SERVICES.map((service, index) => (
              <m.li
                key={service.number}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: shouldReduceMotion ? 0 : index * 0.04,
                  ease: CINEMATIC_EASE,
                }}
              >
                <a
                  href="#connection"
                  className="group relative flex items-baseline gap-4 sm:gap-8 py-6 sm:py-8 px-2 sm:px-4 transition-colors duration-200 hover:bg-[#191919] focus-visible:bg-[#191919] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#78343B]"
                >
                  <span className="font-mono-custom text-xs sm:text-sm tracking-[0.2em] text-[#9E9990] group-hover:text-[#C96973] group-focus-visible:text-[#C96973] tabular-nums shrink-0 transition-colors duration-200">
                    {service.number} <span aria-hidden="true">—</span>
                  </span>
                  <span className="font-serif-custom text-xl sm:text-3xl lg:text-[2.65rem] font-normal tracking-tight text-[#F4F0EA] leading-tight transition-transform duration-200 md:group-hover:translate-x-2 md:group-focus-visible:translate-x-2">
                    {service.name}
                  </span>
                </a>
              </m.li>
            ))}
          </ol>
        </m.section>

        {/* ─── SECTION 04 — THE PRESENCE ─── */}
        <m.section
          id="presence"
          aria-labelledby="presence-heading"
          {...sectionRevealProps}
          className="py-16 sm:py-24 border-t border-[#292929]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-3 flex items-center gap-3 text-[11px] font-mono-custom tracking-[0.22em] uppercase">
              <span className="text-[#C4636D] font-semibold">04</span>
              <span aria-hidden="true" className="text-[#59554F]">—</span>
              <h2 id="presence-heading" className="text-[#9E9990]">
                THE PRESENCE
              </h2>
            </div>

            <div className="lg:col-span-9">
              <div className="relative p-6 sm:p-8 bg-[#191919]/50 border border-[#292929]">
                <ViewfinderCorners sizeClass="w-3 h-3" tone="oxblood" />
                <span className="block text-[11px] font-mono-custom tracking-[0.22em] text-[#9E9990] uppercase mb-4">
                  STUDIO ADDRESS
                </span>
                <address className="not-italic font-serif-custom text-2xl sm:text-3xl lg:text-[2rem] font-normal text-[#F4F0EA] leading-snug tracking-tight max-w-2xl">
                  {BY_MARCOS_EXTERNAL_CONFIG.studioAddress}
                </address>

                {locationMapUrl && (
                  <div className="mt-6 pt-5 border-t border-[#292929]">
                    <a
                      href={locationMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono-custom tracking-[0.2em] text-[#F4F0EA] hover:text-[#C4636D] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                    >
                      <span>Open Location Map</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#78343B]" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </m.section>

        {/* ─── SECTION 05 — THE CONNECTION ─── */}
        <m.section
          id="connection"
          aria-labelledby="connection-heading"
          {...sectionRevealProps}
          className="py-16 sm:py-24 lg:py-28 border-t border-[#292929]"
        >
          <div className="flex items-center gap-3 text-[11px] font-mono-custom tracking-[0.22em] uppercase mb-8">
            <span className="text-[#C4636D] font-semibold">05</span>
            <span aria-hidden="true" className="text-[#59554F]">—</span>
            <span className="text-[#9E9990]">THE CONNECTION</span>
          </div>

          <div className="max-w-3xl mb-12 sm:mb-14">
            <h2
              id="connection-heading"
              className="font-serif-custom text-[clamp(2.2rem,5.2vw,4rem)] font-normal leading-[1.06] tracking-tight text-[#F4F0EA]"
            >
              LET&apos;S CREATE SOMETHING MEANINGFUL.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#9E9990] leading-relaxed">
              Have a project in mind? Let&apos;s start a conversation.
            </p>
          </div>

          {/* Primary Equal-Weight Contact Channels: WhatsApp & Instagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 border border-[#292929] divide-y md:divide-y-0 md:divide-x divide-[#292929]">
            {/* WhatsApp — Direct Inquiries & Booking */}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact BY MARCOS on WhatsApp for direct inquiries and booking"
              className="group relative flex items-center justify-between gap-4 p-6 sm:p-8 bg-[#101010] hover:bg-[#191919] active:bg-[#191919] transition-colors duration-200 focus:outline-none focus-visible:bg-[#191919] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#78343B]"
            >
              <div className="min-w-0">
                <span className="block text-[11px] font-mono-custom tracking-[0.22em] text-[#C4636D] uppercase mb-2">
                  DIRECT INQUIRIES &amp; BOOKING
                </span>
                <span className="font-serif-custom text-3xl sm:text-4xl font-normal text-[#F4F0EA] tracking-tight block">
                  WhatsApp
                </span>
                <span className="block mt-2 text-xs text-[#9E9990] group-hover:text-[#D8D3CA] transition-colors">
                  Start a direct conversation
                </span>
              </div>
              <span className="w-11 h-11 border border-[#292929] group-hover:border-[#78343B] flex items-center justify-center shrink-0 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-[#F4F0EA] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>

            {/* Instagram — Official Handle */}
            <a
              href={BY_MARCOS_EXTERNAL_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow BY MARCOS on Instagram (@bymarrcos)"
              className="group relative flex items-center justify-between gap-4 p-6 sm:p-8 bg-[#101010] hover:bg-[#191919] active:bg-[#191919] transition-colors duration-200 focus:outline-none focus-visible:bg-[#191919] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#78343B]"
            >
              <div className="min-w-0">
                <span className="block text-[11px] font-mono-custom tracking-[0.22em] text-[#C4636D] uppercase mb-2">
                  VISUAL ARCHIVE &amp; UPDATES
                </span>
                <span className="font-serif-custom text-3xl sm:text-4xl font-normal text-[#F4F0EA] tracking-tight block">
                  Instagram
                </span>
                <span className="block mt-2 text-xs font-mono-custom tracking-wider text-[#9E9990] group-hover:text-[#D8D3CA] transition-colors">
                  {BY_MARCOS_EXTERNAL_CONFIG.instagramHandle}
                </span>
              </div>
              <span className="w-11 h-11 border border-[#292929] group-hover:border-[#78343B] flex items-center justify-center shrink-0 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-[#F4F0EA] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>

          {/* Secondary Channel & Direct Utility Actions */}
          <div className="mt-6 pt-6 border-t border-[#292929]/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-[11px] font-mono-custom tracking-[0.2em] text-[#9E9990] uppercase">
                Additional Social
              </span>
              <a
                href={BY_MARCOS_EXTERNAL_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BY MARCOS on Facebook"
                className="group inline-flex items-center gap-1.5 py-2 text-sm text-[#D8D3CA] hover:text-[#F4F0EA] border-b border-[#292929] hover:border-[#78343B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
              >
                <span>Facebook</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C4636D] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit BY MARCOS standalone portfolio website"
                  className="group inline-flex items-center gap-1.5 py-2 text-sm text-[#D8D3CA] hover:text-[#F4F0EA] border-b border-[#292929] hover:border-[#78343B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                >
                  <span>Portfolio Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C4636D] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {showSaveContact && (
                <button
                  type="button"
                  onClick={handleSaveContact}
                  title="Download a vCard (.vcf) file to import BY MARCOS into your Contacts"
                  aria-label="Save BY MARCOS Contact (.vcf)"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom tracking-[0.16em] text-[#F4F0EA] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#C4636D]" />
                  <span>Save Contact (.vcf)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSharePage}
                aria-label="Share BY MARCOS page"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom tracking-[0.16em] text-[#D8D3CA] hover:text-[#F4F0EA] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C4636D]" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </m.section>
      </main>

      {/* ─── SECTION 06 — THE SIGN-OFF ─── */}
      <footer className="w-full border-t border-[#292929] bg-[#101010] py-12 sm:py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div>
              <span className="block text-[11px] font-mono-custom tracking-[0.22em] text-[#C4636D] uppercase mb-3">
                06 — SIGN-OFF
              </span>
              <p className="font-serif-custom text-2xl sm:text-3xl text-[#F4F0EA] tracking-tight">
                BY MARCOS
              </p>
              <p className="mt-1 text-[11px] font-mono-custom tracking-[0.22em] text-[#9E9990] uppercase">
                BY MARCOS — THE RED FRAME COLLECTIVE
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3">
              <button
                type="button"
                onClick={() => navigate(BRAND_FOOTER_CONFIG.explorePath)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#191919] hover:bg-[#222222] active:bg-[#292929] border border-[#292929] hover:border-[#78343B] text-xs font-mono-custom tracking-[0.2em] text-[#F4F0EA] uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
              >
                <span>{BRAND_FOOTER_CONFIG.exploreLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C4636D]" />
              </button>

              <p className="text-[11px] font-mono-custom tracking-[0.14em] text-[#8B867E]">
                {BRAND_FOOTER_CONFIG.attributionText}
              </p>
            </div>
          </div>
        </div>
      </footer>

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
              transition={{ duration: 0.18, ease: CINEMATIC_EASE }}
              className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto bg-[#101010] border border-[#292929] z-10 p-6 shadow-2xl flex flex-col items-center text-center"
            >
              <ViewfinderCorners sizeClass="w-3 h-3" tone="oxblood" />

              <button
                ref={closeQrButtonRef}
                type="button"
                onClick={() => setIsQrOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#9E9990] hover:text-[#F4F0EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                aria-label="Close QR Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <h3
                id="bymarcos-qr-modal-title"
                className="font-serif-custom text-2xl text-[#F4F0EA] tracking-tight mt-1"
              >
                BY MARCOS — DIGITAL CARD
              </h3>
              <p className="text-[10px] font-mono-custom tracking-[0.22em] text-[#C4636D] uppercase mt-1">
                TAPP NFC &amp; SCANNABLE GATEWAY
              </p>

              <div className="my-5 p-3 bg-white select-none">
                {qrError ? (
                  <div className="w-40 h-40 flex items-center justify-center text-xs font-mono-custom text-[#101010]">
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

              <p className="text-[11px] font-mono-custom text-[#9E9990] truncate max-w-full mb-4 px-2">
                {canonicalUrl}
              </p>

              <div className="w-full grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom tracking-wider text-[#F4F0EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C4636D] shrink-0" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9E9990] shrink-0" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSharePage}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom tracking-wider text-[#F4F0EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C4636D] shrink-0" />
                  <span>Share Page</span>
                </button>
              </div>

              <div className="w-full grid grid-cols-2 gap-2.5 mt-2.5">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom text-[#D8D3CA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                >
                  <Download className="w-3.5 h-3.5 text-[#C4636D]" />
                  <span>Export SVG</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom text-[#D8D3CA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                >
                  <Download className="w-3.5 h-3.5 text-[#C4636D]" />
                  <span>Export PNG (1024px)</span>
                </button>
              </div>

              {showSaveContact && (
                <div className="w-full mt-3 pt-3 border-t border-[#292929]">
                  <button
                    type="button"
                    onClick={handleSaveContact}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#78343B] text-[11px] font-mono-custom tracking-wider text-[#F4F0EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78343B]"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#C4636D]" />
                    <span>Save Contact (.vcf)</span>
                  </button>
                  <p className="mt-1.5 text-[10px] text-[#8B867E]">
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
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#191919] border border-[#78343B] text-[#F4F0EA] px-4 py-2.5 text-xs font-mono-custom tracking-wider shadow-2xl flex items-center gap-2 whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C4636D]" />
            <span>{toastMessage}</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
