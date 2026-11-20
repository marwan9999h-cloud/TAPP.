import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PRIMARY_LINKS } from '../data/atlasData';
import { SmartLink } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface PrimaryLinksProps {
  onLinkClick: (link: SmartLink) => void;
}

export const PrimaryLinks: React.FC<PrimaryLinksProps> = ({ onLinkClick }) => {
  return (
    <section aria-label="Primary Links" className="w-full space-y-2.5">
      {PRIMARY_LINKS.map((link: SmartLink, index: number) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            onLinkClick(link);
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.15 + index * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group relative flex items-center justify-between w-full min-h-[62px] px-4 py-3 bg-[#111111] hover:bg-[#161616] active:scale-[0.985] border border-[#292929] hover:border-[#383838] rounded-xl transition-all duration-150 cursor-pointer shadow-sm select-none"
        >
          {/* Left: Branded Platform Icon */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#181818] border border-[#242424] flex items-center justify-center text-[#F2F0EB] group-hover:text-white shrink-0 transition-colors">
              <PlatformIcon platform={link.id} className="w-4 h-4" />
            </div>

            {/* Middle: Title & Subtitle */}
            <div className="text-left truncate">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm sm:text-base font-bold tracking-wider text-[#F2F0EB] uppercase group-hover:text-white transition-colors">
                  {link.title}
                </span>
                {link.highlightText && (
                  <span className="text-[9px] font-mono-custom font-semibold tracking-widest text-[#F2F0EB] bg-[#222222] border border-[#333333] px-1.5 py-0.5 rounded">
                    {link.highlightText}
                  </span>
                )}
              </div>
              {link.subtitle && (
                <p className="text-[11px] font-mono-custom text-[#8A8A86] truncate mt-0.5 tracking-tight">
                  {link.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Understated Arrow Indicator */}
          <div className="pl-3 text-[#8A8A86] group-hover:text-[#F2F0EB] transition-colors shrink-0">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </motion.a>
      ))}
    </section>
  );
};
