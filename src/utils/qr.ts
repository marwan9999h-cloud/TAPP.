import QRCode from 'qrcode';

export interface QrRenderOptions {
  darkColor?: string;
  lightColor?: string;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QrPngOptions extends QrRenderOptions {
  size?: number;
}

const DEFAULT_QR_MARGIN = 3;
const DEFAULT_ERROR_CORRECTION = 'M' as const;
const DEFAULT_PNG_SIZE = 1024;

/**
 * Generates a scannable vector SVG string for a Brand Page's canonical URL.
 */
export async function generateBrandQrSvg(
  url: string,
  options: QrRenderOptions = {}
): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    margin: options.margin ?? DEFAULT_QR_MARGIN,
    errorCorrectionLevel: options.errorCorrectionLevel ?? DEFAULT_ERROR_CORRECTION,
    color: {
      dark: options.darkColor ?? '#121211',
      light: options.lightColor ?? '#FFFFFF',
    },
  });
}

/**
 * Generates a high-resolution PNG Data URL (default 1024x1024) suitable for print.
 */
export async function generateBrandQrPngDataUrl(
  url: string,
  options: QrPngOptions = {}
): Promise<string> {
  const width = Math.max(options.size ?? DEFAULT_PNG_SIZE, 1024);

  return QRCode.toDataURL(url, {
    width,
    margin: options.margin ?? DEFAULT_QR_MARGIN,
    errorCorrectionLevel: options.errorCorrectionLevel ?? DEFAULT_ERROR_CORRECTION,
    color: {
      dark: options.darkColor ?? '#121211',
      light: options.lightColor ?? '#FFFFFF',
    },
  });
}

function triggerDownload(href: string, filename: string): void {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads a print-ready vector SVG QR file.
 */
export async function downloadBrandQrSvg(
  url: string,
  slug: string,
  options: QrRenderOptions = {}
): Promise<void> {
  const svgString = await generateBrandQrSvg(url, options);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);

  try {
    triggerDownload(objectUrl, `${slug}-tapp-qr.svg`);
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

/**
 * Generates and downloads a high-resolution PNG QR file (>= 1024x1024).
 */
export async function downloadBrandQrPng(
  url: string,
  slug: string,
  options: QrPngOptions = {}
): Promise<void> {
  const dataUrl = await generateBrandQrPngDataUrl(url, options);
  triggerDownload(dataUrl, `${slug}-tapp-qr.png`);
}
