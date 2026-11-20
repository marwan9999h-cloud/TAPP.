import { ArtistProfile, SmartLink, SocialIconItem, FeaturedRelease } from '../types';

export const ATLAS_PROFILE: ArtistProfile = {
  id: 'atlas',
  name: 'ATLAS',
  role: 'ARTIST / RAPPER / PRODUCER',
  bio: 'Explore the music, releases and world of ATLAS.',
  location: '',
  verified: true,
};

export const MUSIC_STREAMING_LINKS: SmartLink[] = [
  {
    id: 'spotify',
    title: 'SPOTIFY',
    subtitle: 'Stream official catalog & releases',
    url: 'https://open.spotify.com/artist/03woJdXx4xkdG0dZwQgWSe?si=aIo2Bhy3Q2GHLbpq8nDZvQ&utm_source=copy-link',
    category: 'streaming',
    isFeatured: true,
    highlightText: 'STREAM',
  },
  {
    id: 'anghami',
    title: 'ANGHAMI',
    subtitle: 'Listen on Anghami',
    url: 'https://play.anghami.com/artist/4596304?utm_source=Android&utm_campaign=User%20Sharing&utm_medium=User%20Sharing',
    category: 'streaming',
    isFeatured: true,
    highlightText: 'STREAM',
  },
  {
    id: 'youtube',
    title: 'YOUTUBE',
    subtitle: 'Official music videos & releases',
    url: 'https://youtube.com/@atlasxmusic?si=Srd130-VuKIOtSEQ',
    category: 'streaming',
  },
];

export const SOCIAL_LINKS: SmartLink[] = [
  {
    id: 'instagram',
    title: 'INSTAGRAM',
    subtitle: '@atlasxoffical · Updates & Announcements',
    url: 'https://www.instagram.com/atlasxoffical',
    category: 'social',
  },
  {
    id: 'tiktok',
    title: 'TIKTOK',
    subtitle: '@atlasmusic16 · Clips & Soundbites',
    url: 'https://www.tiktok.com/@atlasmusic16?lang=en-GB',
    category: 'social',
  },
  {
    id: 'facebook',
    title: 'FACEBOOK',
    subtitle: 'Official Facebook Page',
    url: 'https://www.facebook.com/share/19cGxzxiCP/?mibextid=wwXIfr',
    category: 'social',
  },
];

export const SOCIAL_ICONS: SocialIconItem[] = [
  {
    id: 'instagram',
    platform: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/atlasxoffical',
  },
  {
    id: 'tiktok',
    platform: 'tiktok',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@atlasmusic16?lang=en-GB',
  },
  {
    id: 'youtube',
    platform: 'youtube',
    label: 'YouTube',
    url: 'https://youtube.com/@atlasxmusic?si=Srd130-VuKIOtSEQ',
  },
  {
    id: 'facebook',
    platform: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/share/19cGxzxiCP/?mibextid=wwXIfr',
  },
];

export const PRIMARY_LINKS: SmartLink[] = [...MUSIC_STREAMING_LINKS, ...SOCIAL_LINKS];
