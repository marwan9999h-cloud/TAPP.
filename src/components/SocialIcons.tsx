import React from 'react';
import { m } from 'motion/react';
import { SOCIAL_ICONS } from '../data/atlasData';
import { SocialIconItem } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface SocialIconsProps {
  onIconClick: (item: SocialIconItem) => void;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({ onIconClick }) => {
  return (
    <section aria-label="Social Channels" className="w-full pt-3 pb-2">
      <div className="flex items-center justify-center gap-3">
        {SOCIAL_ICONS.map((item, index) => (
          <m.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              onIconClick(item);
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.35 + index * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-11 h-11 rounded-lg bg-[#111111] hover:bg-[#181818] active:scale-95 border border-[#292929] hover:border-[#3d3d3d] flex items-center justify-center text-[#8A8A86] hover:text-[#F2F0EB] transition-all duration-150 shadow-sm"
            aria-label={`Visit ATLAS on ${item.label}`}
            title={item.label}
          >
            <PlatformIcon platform={item.platform} className="w-4 h-4" />
          </m.a>
        ))}
      </div>
    </section>
  );
};
