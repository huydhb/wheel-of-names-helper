import { SUPPORTED_DOMAINS } from './constants';

export interface HackStatus {
  active: boolean;
  found?: boolean;
  targetName?: string;
  targetIndex?: number;
  totalEntries?: number;
  missingTarget?: string;
  message?: string;
  availableEntries?: string[];
}

/** Check if the given tab belongs to a supported wheel domain */
export function isWheelTab(tab?: chrome.tabs.Tab | null): boolean {
  if (!tab?.url) return false;
  return SUPPORTED_DOMAINS.some((domain) => tab.url!.includes(domain));
}

/** Get the currently active tab in the focused window */
export async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] ?? null;
}

/** Send message to content script with error catching */
export async function sendToContent(
  tabId: number,
  action: string,
  payload?: Record<string, unknown>,
): Promise<{ status: HackStatus } | null> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { action, ...payload });
    return response as { status: HackStatus };
  } catch (error) {
    console.debug('Failed to send message to tab', tabId, error);
    return null;
  }
}
