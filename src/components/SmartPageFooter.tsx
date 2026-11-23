import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SOCIAL_ICONS } from '../data/atlasData';
import { BRAND_FOOTER_CONFIG } from '../config/brands';
import { navigate } from '../router';
import { PlatformIcon } from './PlatformIcon';

export const SmartPageFooter: React.FC = () => {
  return (
    <footer className="w-full pt-10 pb-12 text-center flex flex-col items-center justify-center space-y-4 select-none border-t border-[#151A2E]/70 mt-6">
      {/* ATLAS Wordmark */}
      <span className="font-display text-xl font-black tracking-widest text-[#F4F4F8]">
        ATLAS
      </span>

      {/* Social Icons row */}
      <div className="flex items-center justify-center gap-3">
        {SOCIAL_ICONS.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-[#0C1020] hover:bg-[#151B33] active:scale-95 border border-[#1E2544] hover:border-[#384373] flex items-center justify-center text-[#7E8BAF] hover:text-white transition-all shadow-sm"
            aria-label={`Visit ATLAS on ${social.label}`}
            title={social.label}
          >
            <PlatformIcon platform={social.platform} className="w-4 h-4" />
          </a>
        ))}
      </div>

      {/* Subtle Copyright */}
      <div className="text-[10px] font-mono-custom tracking-[0.2em] text-[#707CA3]">
        © ATLAS
      </div>

      {/* Subtle TAPP Platform CTA & Attribution */}
      <div className="pt-2 flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={() => navigate(BRAND_FOOTER_CONFIG.explorePath)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#090D1C] hover:bg-[#111730] border border-[#19203D] hover:border-[#2C3763] text-[10px] font-mono-custom tracking-[0.18em] text-[#8692B8] hover:text-[#F4F4F8] uppercase transition-colors cursor-pointer"
        >
          <span>{BRAND_FOOTER_CONFIG.exploreLabel}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>

        <p className="text-[10px] font-mono-custom tracking-[0.12em] text-[#707CA3]">
          {BRAND_FOOTER_CONFIG.attributionText}
        </p>
      </div>
    </footer>
  );
};
