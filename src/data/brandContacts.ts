import type { BrandSlug } from '../config/brands';
import { ATLAS_PROFILE } from './atlasData';
import { BY_MARCOS_EXTERNAL_CONFIG, getByMarcosWebsiteUrl } from './byMarcosData';
import { SOVI_EXTERNAL_CONFIG } from './soviData';
import { getBrandCanonicalUrl } from '../utils/url';
import { BrandContactInput, evaluateContactEligibility } from '../utils/vcard';

/**
 * Maps each registered brand to its verified, non-placeholder contact data
 * for Save Contact (.vcf) eligibility evaluation.
 * Never borrows TAPP's own phone or social handles to fill missing contact fields.
 */
export function getBrandContactInput(slug: BrandSlug): BrandContactInput {
  const canonicalUrl = getBrandCanonicalUrl(slug);

  switch (slug) {
    case 'atlas':
      return {
        slug: 'atlas',
        displayName: ATLAS_PROFILE.name,
        title: ATLAS_PROFILE.role,
        websiteUrl: canonicalUrl,
        // No phone, email, or physical address configured for ATLAS -> ineligible
      };

    case 'sovi':
      return {
        slug: 'sovi',
        displayName: SOVI_EXTERNAL_CONFIG.brandName,
        organization: `${SOVI_EXTERNAL_CONFIG.brandName} — ${SOVI_EXTERNAL_CONFIG.tagline}`,
        websiteUrl: canonicalUrl,
        // Only Instagram + WhatsApp Community group invite configured -> ineligible
      };

    case 'bymarcos': {
      const standaloneSite = getByMarcosWebsiteUrl();
      return {
        slug: 'bymarcos',
        displayName: 'BY MARCOS',
        organization: 'BY MARCOS — THE RED FRAME COLLECTIVE',
        title: 'Photography & Creative Direction',
        phone: BY_MARCOS_EXTERNAL_CONFIG.contactPhone,
        address: BY_MARCOS_EXTERNAL_CONFIG.studioAddressParts,
        websiteUrl: standaloneSite || canonicalUrl,
        note: `TAPP Digital Card: ${canonicalUrl}`,
      };
    }
  }
}

export function isBrandContactEligible(slug: BrandSlug): boolean {
  return evaluateContactEligibility(getBrandContactInput(slug)).eligible;
}
