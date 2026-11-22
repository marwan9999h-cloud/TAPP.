export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'unavailable' | 'failed';

export interface SharePagePayload {
  title: string;
  text: string;
  url: string;
}

/**
 * Copies text to the system clipboard using the modern Clipboard API first,
 * falling back to a hidden textarea + execCommand when Clipboard API is restricted.
 * Returns true only when copy actually succeeded.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy textarea fallback
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    const activeSelection = document.getSelection();
    const savedRange =
      activeSelection && activeSelection.rangeCount > 0
        ? activeSelection.getRangeAt(0)
        : null;

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const succeeded = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (savedRange && activeSelection) {
      activeSelection.removeAllRanges();
      activeSelection.addRange(savedRange);
    }

    return succeeded;
  } catch {
    return false;
  }
}

/**
 * Shares a brand page via the Web Share API when supported.
 * - Treats AbortError (user cancelled share sheet) as 'cancelled', never an error.
 * - Falls back cleanly to copying the canonical URL if Web Share is unavailable or fails.
 */
export async function shareBrandPage(payload: SharePagePayload): Promise<ShareOutcome> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    const canShare =
      typeof navigator.canShare !== 'function' || navigator.canShare(payload);

    if (canShare) {
      try {
        await navigator.share(payload);
        return 'shared';
      } catch (err) {
        const errorName =
          err && typeof err === 'object' && 'name' in err
            ? String((err as { name?: unknown }).name)
            : '';

        if (errorName === 'AbortError') {
          return 'cancelled';
        }
        // Other share errors (e.g. NotAllowedError in desktop/iframe) fall back to clipboard copy
      }
    }
  }

  const copied = await copyTextToClipboard(payload.url);
  if (copied) return 'copied';

  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
    ? 'failed'
    : 'unavailable';
}
