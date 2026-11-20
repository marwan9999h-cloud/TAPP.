import React from 'react';
import { motion } from 'motion/react';
import { Share2, Radio } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';

interface ProfileHeaderProps {
  onShareClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onShareClick }) => {
  return (
    <header className="w-full flex flex-col items-center text-center pt-2 pb-6">
      {/* Top minimal status bar */}
      <div className="w-full flex items-center justify-between pb-6 text-[10px] font-mono-custom tracking-[0.22em] text-[#7882A4] uppercase">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5C67DE] animate-pulse" />
          <span>OFFICIAL DIGITAL CARD</span>
        </div>
        <button
          onClick={onShareClick}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C1020] hover:bg-[#151B33] text-[#9BA5C9] hover:text-white border border-[#1E2544] transition-all cursor-pointer shadow-sm"
          title="Share ATLAS Page"
          aria-label="Share ATLAS page"
        >
          <Share2 className="w-3 h-3" />
          <span>SHARE</span>
        </button>
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4 relative"
      >
        <ProfileAvatar size="lg" />
      </motion.div>

      {/* Artist Name: ATLAS */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#F4F4F8] leading-none"
      >
        ATLAS
      </motion.h1>

      {/* Role */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-2.5 flex items-center justify-center gap-2 text-xs font-mono-custom tracking-[0.24em] text-[#8692B8] uppercase"
      >
        <span>ARTIST</span>
        <span className="text-[#3A4366]">•</span>
        <span>RAPPER</span>
        <span className="text-[#3A4366]">•</span>
        <span>PRODUCER</span>
      </motion.div>

      {/* Minimal supporting atmospheric line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-3 text-xs text-[#707B9E] font-mono-custom tracking-wider"
      >
        Music. Vision. No Limits.
      </motion.p>
    </header>
  );
};
