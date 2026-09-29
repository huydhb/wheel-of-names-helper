// Service Worker for Wheel of Names Helper Extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Wheel of Names Helper] Extension installed successfully.');
  } else if (details.reason === 'update') {
    const version = chrome.runtime.getManifest().version;
    console.log(`[Wheel of Names Helper] Updated to version ${version}.`);
  }
});
