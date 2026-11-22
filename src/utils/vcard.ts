export interface BrandAddressInput {
  street?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

export interface BrandContactInput {
  slug: string;
  displayName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  address?: BrandAddressInput;
  websiteUrl?: string;
  note?: string;
}

export interface ContactEligibilityResult {
  eligible: boolean;
  reason?: string;
  normalizedPhone?: string;
  normalizedEmail?: string;
  hasAddress: boolean;
  warnings: string[];
}

/**
 * Strips raw line-break / ASCII control characters from single-line fields so
 * malformed input can never break out into unintended vCard properties.
 */
function sanitizeSingleLine(value?: string): string {
  if (!value) return '';
  return value
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Escapes characters required by vCard 3.0 (RFC 2426 §2.4.2):
 * backslash, comma, semicolon, and embedded newlines.
 */
export function escapeVCardValue(value: string): string {
  const cleaned = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return cleaned
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

/**
 * Validates an explicit international phone number without guessing missing country codes.
 * Rejects local-only or ambiguous strings cleanly.
 */
export function validateExplicitInternationalPhone(rawPhone?: string): {
  valid: boolean;
  normalized?: string;
  ambiguousReason?: string;
} {
  if (!rawPhone || !rawPhone.trim()) {
    return { valid: false };
  }

  const trimmed = sanitizeSingleLine(rawPhone);
  if (!trimmed.startsWith('+')) {
    return {
      valid: false,
      ambiguousReason: `Phone "${trimmed}" lacks an explicit "+" international prefix.`,
    };
  }

  const digits = trimmed.slice(1).replace(/[\s\-().]/g, '');
  if (!/^[1-9]\d{6,14}$/.test(digits)) {
    return {
      valid: false,
      ambiguousReason: `Phone "${trimmed}" is not a valid E.164 international phone number.`,
    };
  }

  return {
    valid: true,
    normalized: `+${digits}`,
  };
}

function validateEmailFormat(rawEmail?: string): { valid: boolean; normalized?: string } {
  const cleaned = sanitizeSingleLine(rawEmail);
  if (!cleaned) return { valid: false };
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
  return isValid ? { valid: true, normalized: cleaned } : { valid: false };
}

function hasUsableAddress(address?: BrandAddressInput): boolean {
  if (!address) return false;
  return Boolean(
    sanitizeSingleLine(address.street) ||
      sanitizeSingleLine(address.locality) ||
      sanitizeSingleLine(address.region) ||
      sanitizeSingleLine(address.postalCode) ||
      sanitizeSingleLine(address.country)
  );
}

/**
 * Eligibility Rule:
 * A brand qualifies for Save Contact ONLY if:
 * 1. It identifies the person or business (displayName or organization), AND
 * 2. It contains at least one verified direct contact field (explicit international phone, email, or physical address).
 * Social handles, WhatsApp group invites, or page URLs alone do NOT qualify.
 */
export function evaluateContactEligibility(
  input: BrandContactInput
): ContactEligibilityResult {
  const warnings: string[] = [];
  const hasIdentity = Boolean(
    sanitizeSingleLine(input.displayName) || sanitizeSingleLine(input.organization)
  );

  if (!hasIdentity) {
    return {
      eligible: false,
      reason: 'Missing displayName or organization identifier.',
      hasAddress: false,
      warnings,
    };
  }

  const phoneCheck = validateExplicitInternationalPhone(input.phone);
  if (phoneCheck.ambiguousReason) {
    warnings.push(phoneCheck.ambiguousReason);
  }

  const emailCheck = validateEmailFormat(input.email);
  if (input.email && input.email.trim() && !emailCheck.valid) {
    warnings.push(`Email "${sanitizeSingleLine(input.email)}" failed format validation.`);
  }

  const addressValid = hasUsableAddress(input.address);
  const hasDirectContact = Boolean(
    phoneCheck.valid || emailCheck.valid || addressValid
  );

  if (!hasDirectContact) {
    return {
      eligible: false,
      reason: 'No verified direct contact field (phone, email, or physical address).',
      hasAddress: false,
      warnings,
    };
  }

  return {
    eligible: true,
    normalizedPhone: phoneCheck.normalized,
    normalizedEmail: emailCheck.normalized,
    hasAddress: addressValid,
    warnings,
  };
}

/**
 * Folds a single vCard content line cleanly to <= 75 UTF-8 octets per RFC 2426 §2.6
 * without ever splitting a multi-byte UTF-8 character across lines.
 */
export function foldVCardLine(line: string, maxOctets = 75): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= maxOctets) {
    return line;
  }

  const segments: string[] = [];
  let current = '';
  let currentOctets = 0;

  for (const char of line) {
    const charOctets = encoder.encode(char).length;
    const limit = segments.length === 0 ? maxOctets : maxOctets - 1; // account for leading space on folded lines

    if (currentOctets + charOctets > limit && current.length > 0) {
      segments.push(current);
      current = char;
      currentOctets = charOctets;
    } else {
      current += char;
      currentOctets += charOctets;
    }
  }

  if (current.length > 0) {
    segments.push(current);
  }

  return segments.join('\r\n ');
}

/**
 * Generates a vCard 3.0 payload when the brand record meets eligibility requirements.
 * Returns null if the brand is ineligible.
 */
export function generateBrandVCard(input: BrandContactInput): string | null {
  const eligibility = evaluateContactEligibility(input);
  if (!eligibility.eligible) return null;

  const displayName =
    sanitizeSingleLine(input.displayName) || sanitizeSingleLine(input.organization);
  const organization = sanitizeSingleLine(input.organization);
  const title = sanitizeSingleLine(input.title);
  const websiteUrl = sanitizeSingleLine(input.websiteUrl);
  const note = input.note?.trim() ?? '';

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(displayName)}`,
    `N:;${escapeVCardValue(displayName)};;;`,
  ];

  if (organization) {
    lines.push(`ORG:${escapeVCardValue(organization)}`);
  }

  if (title) {
    lines.push(`TITLE:${escapeVCardValue(title)}`);
  }

  if (eligibility.normalizedPhone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${eligibility.normalizedPhone}`);
  }

  if (eligibility.normalizedEmail) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(eligibility.normalizedEmail)}`);
  }

  if (eligibility.hasAddress && input.address) {
    const street = escapeVCardValue(sanitizeSingleLine(input.address.street));
    const locality = escapeVCardValue(sanitizeSingleLine(input.address.locality));
    const region = escapeVCardValue(sanitizeSingleLine(input.address.region));
    const postal = escapeVCardValue(sanitizeSingleLine(input.address.postalCode));
    const country = escapeVCardValue(sanitizeSingleLine(input.address.country));
    lines.push(`ADR;TYPE=WORK:;;${street};${locality};${region};${postal};${country}`);
  }

  if (websiteUrl) {
    lines.push(`URL:${escapeVCardValue(websiteUrl)}`);
  }

  if (note) {
    lines.push(`NOTE:${escapeVCardValue(note)}`);
  }

  lines.push('END:VCARD');

  return `${lines.map((line) => foldVCardLine(line)).join('\r\n')}\r\n`;
}

export function getSafeVCardFilename(slug: string): string {
  const clean = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${clean || 'contact'}-contact.vcf`;
}

/**
 * Triggers download of a vCard 3.0 (.vcf) contact file and cleans up the Blob URL.
 * Returns true if triggered, false if ineligible or unavailable.
 */
export function downloadBrandVCard(input: BrandContactInput): boolean {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return false;

  const vcfContent = generateBrandVCard(input);
  if (!vcfContent) return false;

  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = getSafeVCardFilename(input.slug);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  }
}
