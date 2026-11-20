import React from 'react';

interface ProfileAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  className = '',
  size = 'lg',
}) => {
  const dimensionClass =
    size === 'sm' ? 'w-16 h-16' : size === 'md' ? 'w-20 h-20' : 'w-24 h-24 sm:w-28 sm:h-28';

  return (
    <div
      className={`relative ${dimensionClass} rounded-full overflow-hidden bg-[#070A14] border border-[#222842] select-none flex-shrink-0 shadow-2xl ${className}`}
      role="img"
      aria-label="ATLAS Profile Artwork"
    >
      {/* Film grain layer */}
      <div className="absolute inset-0 film-grain opacity-40 pointer-events-none z-10" />

      {/* Deep navy to dark violet subtle vignette */}
      <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b from-[#12162A] via-[#0A0D1B] to-[#050711]">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#F2F0EB]"
        >
          {/* Subtle concentric rings / vinyl groove framing */}
          <circle cx="50" cy="50" r="46" stroke="#1E243D" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="38" stroke="#161B30" strokeWidth="1" />

          {/* Bold geometric ATLAS "A" glyph */}
          <path
            d="M50 18 L70 80 H58 L50 52 L42 80 H30 L50 18Z"
            fill="#F2F0EB"
            fillOpacity="0.95"
          />
          <path
            d="M39 63 H61"
            stroke="#070A14"
            strokeWidth="3.5"
            strokeLinecap="square"
          />

          {/* Minimal sound frequency accents */}
          <line x1="16" y1="50" x2="22" y2="50" stroke="#687399" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78" y1="50" x2="84" y2="50" stroke="#687399" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Subtle outer rim reflection in violet/blue */}
      <div className="absolute inset-0 rounded-full border border-[#4338CA]/20 pointer-events-none" />
    </div>
  );
};
