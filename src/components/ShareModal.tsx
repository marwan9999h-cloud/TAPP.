import React, { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Copy, Check, QrCode, Download, Share2, UserPlus } from 'lucide-react';
import { BrandSlug } from '../config/brands';
import { getBrandContactInput, isBrandContactEligible } from '../data/brandContacts';
import { getBrandCanonicalUrl } from '../utils/url';
import { copyTextToClipboard, shareBrandPage } from '../utils/share';
import { downloadBrandVCard } from '../utils/vcard';
import {
  generateBrandQrSvg,
  downloadBrandQrSvg,
  downloadBrandQrPng,
} from '../utils/qr';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  brandSlug?: BrandSlug;
  brandTitle?: string;
  brandSubtitle?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onToast,
  brandSlug = 'atlas',
  brandTitle = 'ATLAS SMART PAGE',
  brandSubtitle = 'TAPP NFC & Digital Artist Card',
}) => {
  const [copied, setCopied] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [qrError, setQrError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const canonicalUrl = getBrandCanonicalUrl(brandSlug);
  const contactInput = getBrandContactInput(brandSlug);
  const showSaveContact = isBrandContactEligible(brandSlug);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    let cancelled = false;
    setQrError(false);

    generateBrandQrSvg(canonicalUrl, {
      darkColor: '#080808',
      lightColor: '#FFFFFF',
      margin: 3,
      errorCorrectionLevel: 'M',
    })
      .then((svg) => {
        if (!cancelled) setQrSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      });

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelled = true;
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, canonicalUrl, onClose]);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(canonicalUrl);
    if (ok) {
      setCopied(true);
      onToast('LINK COPIED TO CLIPBOARD');
      setTimeout(() => setCopied(false), 2000);
    } else {
      onToast('UNABLE TO COPY AUTOMATICALLY');
    }
  };

  const handleShare = async () => {
    const outcome = await shareBrandPage({
      title: brandTitle,
      text: brandSubtitle,
      url: canonicalUrl,
    });

    if (outcome === 'shared') {
      onToast('PAGE SHARED');
    } else if (outcome === 'copied') {
      setCopied(true);
      onToast('LINK COPIED TO CLIPBOARD');
      setTimeout(() => setCopied(false), 2000);
    } else if (outcome === 'failed' || outcome === 'unavailable') {
      onToast('SHARE UNAVAILABLE — USE COPY OR QR');
    }
    // 'cancelled' is treated quietly without alarming the visitor
  };

  const handleSaveContact = () => {
    if (!showSaveContact) return;
    const ok = downloadBrandVCard(contactInput);
    if (ok) {
      onToast('CONTACT CARD (.VCF) DOWNLOADED');
    } else {
      onToast('UNABLE TO EXPORT CONTACT FILE');
    }
  };

  const handleDownloadSvg = async () => {
    try {
      await downloadBrandQrSvg(canonicalUrl, brandSlug, {
        darkColor: '#080808',
        lightColor: '#FFFFFF',
        margin: 3,
      });
      onToast('SVG QR DOWNLOADED');
    } catch {
      onToast('FAILED TO EXPORT SVG');
    }
  };

  const handleDownloadPng = async () => {
    try {
      await downloadBrandQrPng(canonicalUrl, brandSlug, {
        size: 1024,
        darkColor: '#080808',
        lightColor: '#FFFFFF',
        margin: 3,
      });
      onToast('PNG QR DOWNLOADED (1024PX)');
    } catch {
      onToast('FAILED TO EXPORT PNG');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="atlas-share-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <m.div
            initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto bg-[#111111] border border-[#292929] rounded-2xl z-10 p-6 shadow-2xl flex flex-col items-center text-center"
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8A8A86] hover:text-[#F2F0EB] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C67DE]"
              aria-label="Close share dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#181818] border border-[#292929] flex items-center justify-center text-[#F2F0EB] mb-3">
              <QrCode className="w-5 h-5" />
            </div>

            <h3
              id="atlas-share-modal-title"
              className="font-display text-lg font-bold uppercase text-[#F2F0EB]"
            >
              {brandTitle}
            </h3>
            <p className="text-xs font-mono-custom text-[#8A8A86] mt-1">
              {brandSubtitle}
            </p>

            {/* Real Scannable QR Code */}
            <div className="my-5 p-3 bg-white rounded-xl shadow-inner select-none">
              {qrError ? (
                <div className="w-40 h-40 flex items-center justify-center text-xs font-mono-custom text-[#121211]">
                  QR UNAVAILABLE
                </div>
              ) : qrSvg ? (
                <div
                  className="w-40 h-40 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                  aria-label={`Scannable QR code for ${canonicalUrl}`}
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="w-40 h-40 bg-[#F2F0EB]/60 animate-pulse rounded-lg" />
              )}
            </div>

            <p className="text-[10px] font-mono-custom text-[#8A8A86] truncate max-w-full mb-4 px-2">
              {canonicalUrl}
            </p>

            {/* Copy Link & Web Share */}
            <div className="w-full grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                type="button"
                className="flex items-center justify-center gap-1.5 py-3 px-2 bg-[#181818] hover:bg-[#202020] active:scale-[0.98] border border-[#2d2d2d] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#F2F0EB] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C67DE]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8A8A86] shrink-0" />
                    <span>COPY LINK</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                type="button"
                className="flex items-center justify-center gap-1.5 py-3 px-2 bg-[#181818] hover:bg-[#202020] active:scale-[0.98] border border-[#2d2d2d] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#F2F0EB] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C67DE]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#8A8A86] shrink-0" />
                <span>SHARE</span>
              </button>
            </div>

            {/* Print-ready QR Export */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2.5">
              <button
                onClick={handleDownloadSvg}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#151515] hover:bg-[#1E1E1E] active:scale-[0.98] border border-[#262626] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#C8C6C0] hover:text-[#F2F0EB] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C67DE]"
              >
                <Download className="w-3.5 h-3.5 text-[#8A8A86]" />
                <span>SVG</span>
              </button>
              <button
                onClick={handleDownloadPng}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#151515] hover:bg-[#1E1E1E] active:scale-[0.98] border border-[#262626] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#C8C6C0] hover:text-[#F2F0EB] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C67DE]"
              >
                <Download className="w-3.5 h-3.5 text-[#8A8A86]" />
                <span>PNG 1024px</span>
              </button>
            </div>

            {/* Save Contact only when eligible */}
            {showSaveContact && (
              <button
                onClick={handleSaveContact}
                type="button"
                className="w-full mt-2.5 flex items-center justify-center gap-2 py-2.5 bg-[#181818] hover:bg-[#202020] border border-[#2d2d2d] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#F2F0EB] transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#5C67DE]" />
                <span>SAVE CONTACT (.VCF)</span>
              </button>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};
