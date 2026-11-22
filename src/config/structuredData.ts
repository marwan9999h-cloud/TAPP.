import { BRAND_SEO, GUIDE_SEO, HOME_SEO } from './seoRoutes.mjs';
import { ATLAS_PROFILE, MUSIC_STREAMING_LINKS, SOCIAL_LINKS } from '../data/atlasData';
import { BY_MARCOS_EXTERNAL_CONFIG } from '../data/byMarcosData';
import { SOVI_EXTERNAL_CONFIG } from '../data/soviData';
import { OFFICIAL_SITE_URL } from '../utils/url';

const TAPP_SOCIAL_URLS = [
  'https://www.facebook.com/share/1C31kMehSm/?mibextid=wwXIfr',
  'https://www.instagram.com/its.1m1?stkn=MTkyb2dqcG5lbTEybw%3D%3D&utm_source=qr',
] as const;

/**
 * Builds factual Schema.org JSON-LD payloads strictly from verified, visible route data.
 * Never invents prices, ratings, hours, emails, or unconfirmed contact metadata.
 */
export function buildStructuredDataForRoute(
  routePath: string,
  baseUrl: string = OFFICIAL_SITE_URL,
  lang: 'ar' | 'en' = 'ar'
): Record<string, unknown> | null {
  const cleanBase = baseUrl.replace(/\/+$/, '') || OFFICIAL_SITE_URL;

  switch (routePath) {
    case '/':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${cleanBase}/#website`,
            name: 'TAPP',
            url: `${cleanBase}/`,
            description: HOME_SEO.description,
            inLanguage: 'ar',
          },
          {
            '@type': 'Organization',
            '@id': `${cleanBase}/#organization`,
            name: 'TAPP',
            url: `${cleanBase}/`,
            logo: `${cleanBase}/favicon-96x96.png`,
            sameAs: [...TAPP_SOCIAL_URLS],
          },
        ],
      };

    case '/guide': {
      const localized = GUIDE_SEO.localized[lang];
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${cleanBase}/guide#webpage`,
        name: localized.title,
        url: `${cleanBase}/guide`,
        description: localized.description,
        inLanguage: localized.lang,
        isPartOf: {
          '@id': `${cleanBase}/#website`,
        },
      };
    }

    case '/atlas': {
      const sameAs = Array.from(
        new Set([...MUSIC_STREAMING_LINKS, ...SOCIAL_LINKS].map((item) => item.url))
      );
      return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${cleanBase}/atlas#profilepage`,
        url: `${cleanBase}/atlas`,
        name: BRAND_SEO.atlas.title,
        description: BRAND_SEO.atlas.description,
        inLanguage: 'en',
        isPartOf: {
          '@id': `${cleanBase}/#website`,
        },
        mainEntity: {
          '@type': 'Person',
          name: ATLAS_PROFILE.name,
          description: ATLAS_PROFILE.bio,
          jobTitle: 'Artist, Rapper, Producer',
          url: `${cleanBase}/atlas`,
          image: `${cleanBase}${BRAND_SEO.atlas.ogImagePath}`,
          sameAs,
        },
      };
    }

    case '/sovi':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${cleanBase}/sovi#organization`,
        name: SOVI_EXTERNAL_CONFIG.brandName,
        description: 'Handmade pieces, made with love.',
        url: `${cleanBase}/sovi`,
        image: `${cleanBase}${BRAND_SEO.sovi.ogImagePath}`,
        founder: {
          '@type': 'Person',
          name: SOVI_EXTERNAL_CONFIG.founder,
        },
        sameAs: [SOVI_EXTERNAL_CONFIG.instagramUrl],
      };

    case '/bymarcos':
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${cleanBase}/bymarcos#localbusiness`,
        name: 'BY MARCOS',
        alternateName: 'THE RED FRAME COLLECTIVE',
        description: BRAND_SEO.bymarcos.description,
        url: `${cleanBase}/bymarcos`,
        image: `${cleanBase}${BRAND_SEO.bymarcos.ogImagePath}`,
        telephone: BY_MARCOS_EXTERNAL_CONFIG.contactPhone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: BY_MARCOS_EXTERNAL_CONFIG.studioAddressParts.street,
          addressLocality: BY_MARCOS_EXTERNAL_CONFIG.studioAddressParts.locality,
          addressCountry: 'EG',
        },
        sameAs: [
          BY_MARCOS_EXTERNAL_CONFIG.instagramUrl,
          BY_MARCOS_EXTERNAL_CONFIG.facebookUrl,
        ],
      };

    default:
      return null;
  }
}
