export type LinkCategory = 'streaming' | 'social' | 'contact';

export interface SmartLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  category: LinkCategory;
  isFeatured?: boolean;
  highlightText?: string;
}

export interface SocialIconItem {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'spotify' | 'facebook' | 'anghami';
  label: string;
  url: string;
}

export interface FeaturedRelease {
  label: string;
  title: string;
  titleArabic: string;
  artist: string;
  type: string;
  duration: string;
  year: string;
  ctaText: string;
  streamUrl: string;
}

export interface ArtistProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  verified: boolean;
}
