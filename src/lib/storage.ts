import { STORAGE_KEYS } from './constants';

export interface ExtensionConfig {
  targetNames: string;
  isActive: boolean;
}

/** Get saved configuration from chrome.storage.local */
export async function getConfig(): Promise<ExtensionConfig> {
  const data = await chrome.storage.local.get([STORAGE_KEYS.TARGET_NAMES, STORAGE_KEYS.IS_ACTIVE]);
  return {
    targetNames: (data[STORAGE_KEYS.TARGET_NAMES] as string) || '',
    isActive: Boolean(data[STORAGE_KEYS.IS_ACTIVE]),
  };
}

/** Save configuration to chrome.storage.local */
export async function saveConfig(config: Partial<ExtensionConfig>): Promise<void> {
  const updates: Record<string, unknown> = {};
  if (config.targetNames !== undefined) {
    updates[STORAGE_KEYS.TARGET_NAMES] = config.targetNames;
  }
  if (config.isActive !== undefined) {
    updates[STORAGE_KEYS.IS_ACTIVE] = config.isActive;
  }
  await chrome.storage.local.set(updates);
}

/** Remove configuration from chrome.storage.local */
export async function clearConfig(): Promise<void> {
  await chrome.storage.local.remove([STORAGE_KEYS.TARGET_NAMES, STORAGE_KEYS.IS_ACTIVE]);
}
