import { EXT_ACTIONS, PAGE_MSG } from '../lib/constants';
import type { HackStatus } from '../lib/messaging';
import injectScriptUrl from './inject?script';

(function () {
  let latestStatus: HackStatus = { active: false, message: 'Chưa kích hoạt' };

  function injectScript() {
    if (document.getElementById('ufs-page-hack-script')) return;

    const script = document.createElement('script');
    script.id = 'ufs-page-hack-script';
    script.src = chrome.runtime.getURL(injectScriptUrl);
    script.onload = function () {
      (this as HTMLElement).remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  injectScript();

  // Listen for status updates from inject.ts in page context
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === PAGE_MSG.STATUS_UPDATE) {
      latestStatus = event.data.status;
    }
  });

  function requestStatusFromPage(type: string, targets?: string): Promise<HackStatus> {
    return new Promise((resolve) => {
      let resolved = false;

      const handleStatus = (event: MessageEvent) => {
        if (event.data && event.data.type === PAGE_MSG.STATUS_UPDATE) {
          window.removeEventListener('message', handleStatus);
          clearTimeout(timeoutId);
          latestStatus = event.data.status;
          resolved = true;
          resolve(latestStatus);
        }
      };

      window.addEventListener('message', handleStatus);

      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleStatus);
        if (!resolved) {
          resolve(latestStatus);
        }
      }, 350);

      window.postMessage({ type, targets }, '*');
    });
  }

  // Listen for messages from popup
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
      if (req.action === EXT_ACTIONS.START) {
        requestStatusFromPage(PAGE_MSG.START_HACK, req.targets).then((status) => {
          sendResponse({ status });
        });
        return true;
      } else if (req.action === EXT_ACTIONS.STOP) {
        requestStatusFromPage(PAGE_MSG.STOP_HACK).then((status) => {
          sendResponse({ status });
        });
        return true;
      } else if (req.action === EXT_ACTIONS.GET_STATUS) {
        requestStatusFromPage(PAGE_MSG.GET_STATUS).then((status) => {
          sendResponse({ status });
        });
        return true;
      }
    });
  }
})();
