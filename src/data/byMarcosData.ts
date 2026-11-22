/**
 * Isolated configuration and editorial content for BY MARCOS — THE RED FRAME COLLECTIVE.
 * English-only studio identity; external links and nullable URLs preserved verbatim.
 */
export const BY_MARCOS_EXTERNAL_CONFIG = {
  facebookUrl: 'https://www.facebook.com/profile.php?id=61571532223362',
  instagramUrl: 'https://www.instagram.com/bymarrcos/',
  instagramHandle: '@bymarrcos',
  whatsappUrl: 'https://wa.me/201210897916',
  // Verified directly from whatsappUrl (E.164 international format +20 1210897916)
  contactPhone: '+201210897916',
  studioAddress:
    'CAMP SHIZAR, PORT SAID STREET, IN FRONT OF BAKERY HOUSE, ALEXANDRIA, EGYPT',
  studioAddressParts: {
    street: 'Camp Shizar, Port Said Street, In Front of Bakery House',
    locality: 'Alexandria',
    country: 'Egypt',
  },
  locationDetail: 'ALEXANDRIA / EGYPT',
  // TODO: Insert verified Google Maps location URL once confirmed (nullable by design)
  locationMapUrl: null as string | null,
  // TODO: Insert verified standalone BY MARCOS portfolio website URL once supplied (nullable by design)
  standaloneWebsiteUrl: null as string | null,
} as const;

export interface ByMarcosServiceItem {
  number: string;
  name: string;
}

export const BY_MARCOS_SERVICES: readonly ByMarcosServiceItem[] = [
  { number: '01', name: 'PHOTOGRAPHY' },
  { number: '02', name: 'VISUAL STORYTELLING' },
  { number: '03', name: 'VIDEOGRAPHY / FILM' },
  { number: '04', name: 'CREATIVE DIRECTION' },
  { number: '05', name: 'EVENTS COVERAGE' },
  { number: '06', name: 'PORTRAITS & PERSONAL SESSIONS' },
] as const;

export function getByMarcosBookingWhatsAppUrl(): string {
  const message =
    'Hello BY MARCOS, I would like to inquire about booking a project or session.';
  return `${BY_MARCOS_EXTERNAL_CONFIG.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function getByMarcosWebsiteUrl(): string | null {
  const rawUrl = BY_MARCOS_EXTERNAL_CONFIG.standaloneWebsiteUrl;
  if (!rawUrl || rawUrl.trim() === '') return null;
  return rawUrl.trim();
}

export function getByMarcosLocationMapUrl(): string | null {
  const rawUrl = BY_MARCOS_EXTERNAL_CONFIG.locationMapUrl;
  if (!rawUrl || rawUrl.trim() === '') return null;
  return rawUrl.trim();
}
