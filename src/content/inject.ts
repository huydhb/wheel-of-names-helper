// Core hack script injected directly into the web page context (Main World)
(function () {
  const win = window as unknown as {
    ufs_injected?: boolean;
    ufs_originalCrypto?: typeof crypto.getRandomValues;
    ufs_interval?: number | null;
  };

  if (win.ufs_injected) return;
  win.ufs_injected = true;

  const STORAGE_KEY = 'ufs_wheel_target_names';
  const savedTargets = localStorage.getItem(STORAGE_KEY) || '';

  let currentStatus: {
    active: boolean;
    found?: boolean;
    targetName?: string;
    targetIndex?: number;
    totalEntries?: number;
    missingTarget?: string;
    message?: string;
    availableEntries?: string[];
  } = { active: false, message: 'Đã tắt Hack. Quay ngẫu nhiên.' };

  if (!win.ufs_originalCrypto) {
    win.ufs_originalCrypto = window.crypto.getRandomValues.bind(window.crypto);
  }

  function getEntries(): string[] {
    // Strategy 1: Vue component attached to canvas
    try {
      const canvas = document.querySelector('canvas') as (HTMLCanvasElement & {
        __vueParentComponent?: {
          props?: Record<string, unknown>;
          proxy?: Record<string, unknown>;
          setupState?: Record<string, unknown>;
          ctx?: Record<string, unknown>;
        };
      }) | null;

      const vue = canvas?.__vueParentComponent;
      if (vue) {
        const wheelConfig = (vue.props?.wheelConfig || vue.proxy?.wheelConfig) as
          | { entries?: unknown[]; names?: unknown[] }
          | undefined;

        const possibleArrays = [
          vue.props?.entries,
          vue.props?.names,
          vue.props?.slices,
          wheelConfig?.entries,
          wheelConfig?.names,
          vue.proxy?.entries,
          vue.proxy?.names,
          vue.setupState?.entries,
          vue.setupState?.names,
        ];

        for (const candidate of possibleArrays) {
          if (Array.isArray(candidate) && candidate.length > 0) {
            const list = candidate
              .map((item) => {
                if (typeof item === 'string') return item.trim();
                if (item && typeof item === 'object') {
                  const obj = item as { text?: string; name?: string; title?: string };
                  return (obj.text || obj.name || obj.title || '').trim();
                }
                return '';
              })
              .filter(Boolean);

            if (list.length > 0) return list;
          }
        }
      }
    } catch (e) {
      console.debug('Failed to extract entries from Vue component:', e);
    }

    // Strategy 2: Contenteditable containers (.basic-editor, [contenteditable="true"], .q-editor__content)
    try {
      const editors = document.querySelectorAll(
        '.basic-editor, [contenteditable="true"], .q-editor__content',
      );
      for (const ed of Array.from(editors)) {
        const text = (ed as HTMLElement).innerText || '';
        const lines = text
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        if (lines.length > 0) return lines;
      }
    } catch (e) {
      console.debug('Failed to extract entries from contenteditable:', e);
    }

    // Strategy 3: Textarea inputs
    try {
      const textareas = document.querySelectorAll('textarea');
      for (const ta of Array.from(textareas)) {
        const lines = ta.value
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        if (lines.length > 0) return lines;
      }
    } catch (e) {
      console.debug('Failed to extract entries from textarea:', e);
    }

    return [];
  }

  function sendStatusUpdate(status: typeof currentStatus) {
    const entries = getEntries();
    currentStatus = {
      ...status,
      availableEntries: entries,
    };
    window.postMessage({ type: 'UFS_STATUS_UPDATE', status: currentStatus }, '*');
  }

  function calculateTargetValue(targetIndex: number, N: number): number {
    const fps = 60;
    let spinTime = 10;
    let slowSpin = false;
    let currentAngle = 0;

    try {
      const canvas = document.querySelector('canvas') as (HTMLCanvasElement & {
        __vueParentComponent?: {
          props?: {
            wheelConfig?: {
              spinTime?: number;
              slowSpin?: boolean;
            };
          };
          proxy?: { angle?: number };
          setupState?: { angle?: number };
          ctx?: { angle?: number };
        };
      }) | null;

      const vue = canvas?.__vueParentComponent;
      if (vue?.props?.wheelConfig) {
        spinTime = vue.props.wheelConfig.spinTime || 10;
        slowSpin = !!vue.props.wheelConfig.slowSpin;
      }
      currentAngle = vue?.proxy?.angle ?? vue?.setupState?.angle ?? vue?.ctx?.angle ?? 0;
    } catch (e) {
      console.debug('Failed to read vue wheel component state', e);
    }

    const D = 0.005;
    const O = 0.00015;
    const k_const = 0.001;
    const A = 0.6;
    const j_const = 3;

    const q = Math.min(fps, (spinTime * fps) / j_const);
    const J = slowSpin ? k_const : A / fps;
    const Y = spinTime * fps - q;
    const S0 = D + (q + 1) * J;
    const factor = Math.exp(Math.log(O / S0) / Y);

    let speed = S0;
    let decelAngle = 0;
    for (let t = 0; t <= Y; t++) {
      decelAngle += speed;
      speed *= factor;
    }

    const S_start = (currentAngle / (2 * Math.PI)) * N;
    const C = (decelAngle / (2 * Math.PI)) * N;

    let r = (targetIndex - C - S_start + 0.5) / N;
    r = ((r % 1) + 1) % 1;
    return r;
  }

  function stopHack() {
    if (win.ufs_originalCrypto) {
      window.crypto.getRandomValues = win.ufs_originalCrypto;
    }
    if (win.ufs_interval) {
      clearInterval(win.ufs_interval);
    }
    win.ufs_interval = null;
    localStorage.removeItem(STORAGE_KEY);
    sendStatusUpdate({ active: false, message: 'Đã tắt Hack. Quay ngẫu nhiên.' });
  }

  function startHack(rawVal?: string) {
    const targetString = rawVal !== undefined ? rawVal : localStorage.getItem(STORAGE_KEY) || '';
    const targets = targetString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    localStorage.setItem(STORAGE_KEY, targetString);

    if (!targets.length) {
      stopHack();
      return;
    }

    if (win.ufs_interval) {
      clearInterval(win.ufs_interval);
    }

    function doCheck() {
      const entries = getEntries();
      if (!entries.length) {
        sendStatusUpdate({
          active: true,
          found: false,
          missingTarget: targets[0],
          message: 'Đang chờ vòng quay nạp danh sách...',
        });
        return;
      }

      const activeTarget = targets.find((t) =>
        entries.some((e) => e.toLowerCase() === t.toLowerCase()),
      );

      if (!activeTarget) {
        if (win.ufs_originalCrypto) {
          window.crypto.getRandomValues = win.ufs_originalCrypto;
        }
        sendStatusUpdate({
          active: true,
          found: false,
          missingTarget: targets[0],
          totalEntries: entries.length,
        });
        return;
      }

      const targetIndex = entries.findIndex(
        (e) => e.toLowerCase() === activeTarget.toLowerCase(),
      );

      window.crypto.getRandomValues = function <T extends ArrayBufferView | null>(
        typedArray: T,
      ): T {
        if (typedArray instanceof Uint32Array && typedArray.length === 1) {
          const rFloat = calculateTargetValue(targetIndex, entries.length);
          typedArray[0] = Math.floor(rFloat * 4294967295);
          return typedArray;
        }
        if (win.ufs_originalCrypto) {
          return win.ufs_originalCrypto(typedArray as ArrayBufferView) as T;
        }
        return typedArray;
      };

      sendStatusUpdate({
        active: true,
        found: true,
        targetName: activeTarget,
        targetIndex: targetIndex,
        totalEntries: entries.length,
      });
    }

    // Run immediately for instant feedback
    doCheck();

    // Check continuously every 300ms
    win.ufs_interval = window.setInterval(doCheck, 300);
  }

  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'UFS_START_HACK') {
      startHack(event.data.targets);
    } else if (event.data.type === 'UFS_STOP_HACK') {
      stopHack();
    } else if (event.data.type === 'UFS_GET_STATUS') {
      // Refresh status and send update
      const targets = localStorage.getItem(STORAGE_KEY);
      if (targets) {
        startHack(targets);
      } else {
        sendStatusUpdate(currentStatus);
      }
    }
  });

  if (savedTargets) {
    startHack(savedTargets);
  } else {
    // Initial status broadcast with available entries
    sendStatusUpdate(currentStatus);
  }
})();
export {};
