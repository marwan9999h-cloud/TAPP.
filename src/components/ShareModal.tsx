import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, QrCode, Download } from 'lucide-react';
import { BrandSlug } from '../config/brands';
import { getBrandCanonicalUrl } from '../utils/url';
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

  const canonicalUrl = getBrandCanonicalUrl(brandSlug);

  useEffect(() => {
    if (!isOpen) return;

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

    return () => {
      cancelled = true;
    };
  }, [isOpen, canonicalUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    onToast('LINK COPIED TO CLIPBOARD');
    setTimeout(() => setCopied(false), 2000);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-[#111111] border border-[#292929] rounded-2xl z-10 p-6 shadow-2xl flex flex-col items-center text-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 p-1 text-[#8A8A86] hover:text-[#F2F0EB] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#181818] border border-[#292929] flex items-center justify-center text-[#F2F0EB] mb-3">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="font-display text-lg font-bold uppercase text-[#F2F0EB]">
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

            {/* Copy Link Button */}
            <button
              onClick={handleCopy}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#181818] hover:bg-[#202020] active:scale-[0.98] border border-[#2d2d2d] rounded-xl text-xs font-mono-custom tracking-wider text-[#F2F0EB] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8A8A86]" />
                  <span>COPY SMART PAGE URL</span>
                </>
              )}
            </button>

            {/* Print-ready QR Export */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2.5">
              <button
                onClick={handleDownloadSvg}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#151515] hover:bg-[#1E1E1E] active:scale-[0.98] border border-[#262626] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#C8C6C0] hover:text-[#F2F0EB] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8A8A86]" />
                <span>SVG</span>
              </button>
              <button
                onClick={handleDownloadPng}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#151515] hover:bg-[#1E1E1E] active:scale-[0.98] border border-[#262626] rounded-xl text-[11px] font-mono-custom tracking-wider text-[#C8C6C0] hover:text-[#F2F0EB] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8A8A86]" />
                <span>PNG 1024px</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
