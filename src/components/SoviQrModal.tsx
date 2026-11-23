import React, { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Copy, Check, QrCode, Download, Share2 } from 'lucide-react';
import { getBrandCanonicalUrl } from '../utils/url';
import { copyTextToClipboard, shareBrandPage } from '../utils/share';
import {
  generateBrandQrSvg,
  downloadBrandQrSvg,
  downloadBrandQrPng,
} from '../utils/qr';

interface SoviQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const SoviQrModal: React.FC<SoviQrModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [qrError, setQrError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const canonicalUrl = getBrandCanonicalUrl('sovi');

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    let cancelled = false;
    setQrError(false);

    generateBrandQrSvg(canonicalUrl, {
      darkColor: '#34203B',
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
      title: 'SOVI — Handmade Goods',
      text: 'Handmade pieces, made with love.',
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
  };

  const handleDownloadSvg = async () => {
    try {
      await downloadBrandQrSvg(canonicalUrl, 'sovi', {
        darkColor: '#34203B',
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
      await downloadBrandQrPng(canonicalUrl, 'sovi', {
        size: 1024,
        darkColor: '#34203B',
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
          aria-labelledby="sovi-qr-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#34203B]/35 backdrop-blur-xs"
          />

          <m.div
            initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto bg-[#FAF8F5] border border-[#E2D4E8] rounded-2xl z-10 p-6 shadow-xl flex flex-col items-center text-center text-[#34203B]"
          >
            <button
              ref={closeButtonRef}
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8B6D93] hover:text-[#34203B] hover:bg-[#F3EDF7] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6D93]"
              aria-label="Close QR modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#F3EDF7] border border-[#DFCEE8] flex items-center justify-center text-[#5C3D61] mb-3">
              <QrCode className="w-5 h-5" />
            </div>

            <h3
              id="sovi-qr-modal-title"
              className="font-serif-custom text-2xl tracking-[0.18em] text-[#34203B] uppercase"
            >
              SOVI
            </h3>
            <p className="text-[11px] font-mono-custom tracking-[0.2em] text-[#7D5B84] uppercase mt-1">
              HANDMADE GOODS · DIGITAL CARD
            </p>

            {/* Real Scannable QR Code */}
            <div className="my-5 p-3 bg-white border border-[#E8DFEF] rounded-2xl shadow-2xs select-none">
              {qrError ? (
                <div className="w-40 h-40 flex items-center justify-center text-xs font-mono-custom text-[#5C3D61]">
                  QR UNAVAILABLE
                </div>
              ) : qrSvg ? (
                <div
                  className="w-40 h-40 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                  aria-label={`Scannable QR code for ${canonicalUrl}`}
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="w-40 h-40 bg-[#F3EDF7] animate-pulse rounded-xl" />
              )}
            </div>

            <p className="text-[10px] font-mono-custom text-[#7B5D83] truncate max-w-full mb-4 px-2">
              {canonicalUrl}
            </p>

            {/* Copy Canonical URL & Share Page */}
            <div className="w-full grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCopy}
                type="button"
                className="flex items-center justify-center gap-1.5 py-3 px-2 bg-gradient-to-b from-[#FAF5FC] to-[#F4EBF7] hover:from-[#F6ECFA] hover:to-[#EFE1F5] active:scale-[0.985] border border-[#E2D4E8] hover:border-[#C8B2D4] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#34203B] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6D93]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5C3D61] shrink-0" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#7D5B84] shrink-0" />
                    <span>COPY URL</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                type="button"
                className="flex items-center justify-center gap-1.5 py-3 px-2 bg-gradient-to-b from-[#FAF5FC] to-[#F4EBF7] hover:from-[#F6ECFA] hover:to-[#EFE1F5] active:scale-[0.985] border border-[#E2D4E8] hover:border-[#C8B2D4] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#34203B] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6D93]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#7D5B84] shrink-0" />
                <span>SHARE PAGE</span>
              </button>
            </div>

            {/* Print-ready Export */}
            <div className="w-full grid grid-cols-2 gap-2.5 mt-2.5">
              <button
                onClick={handleDownloadSvg}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-[#F6F0F8] active:scale-[0.985] border border-[#E2D4E8] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#5C3D61] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6D93]"
              >
                <Download className="w-3.5 h-3.5 text-[#8B6D93]" />
                <span>SVG</span>
              </button>
              <button
                onClick={handleDownloadPng}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-[#F6F0F8] active:scale-[0.985] border border-[#E2D4E8] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#5C3D61] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6D93]"
              >
                <Download className="w-3.5 h-3.5 text-[#8B6D93]" />
                <span>PNG 1024px</span>
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};
