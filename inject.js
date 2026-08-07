(function() {
  const STORAGE_KEY = 'ufs_wheel_target_names';
  let savedTargets = localStorage.getItem(STORAGE_KEY) || "";
  let currentStatus = { active: false, message: "Đã tắt Hack. Quay ngẫu nhiên." };

  if (!window.ufs_originalCrypto) {
    window.ufs_originalCrypto = window.crypto.getRandomValues.bind(window.crypto);
  }

  function sendStatusUpdate(status) {
    currentStatus = status;
    window.postMessage({ type: "UFS_STATUS_UPDATE", status: currentStatus }, "*");
  }

  function getEntries() {
    let divs = Array.from(document.querySelectorAll('.basic-editor > div'));
    let values = divs.map(e => e.innerText.trim()).filter(Boolean);
    if (!values.length) {
      values = document.querySelector('.basic-editor')?.innerText?.split('\n').map(v => v.trim()).filter(Boolean) || [];
    }
    return values;
  }

  function calculateTargetValue(targetIndex, N) {
    let fps = 60, spinTime = 10, slowSpin = false, currentAngle = 0;
    try {
      const canvas = document.querySelector('canvas');
      const vue = canvas?.__vueParentComponent;
      if (vue?.props?.wheelConfig) {
        spinTime = vue.props.wheelConfig.spinTime || 10;
        slowSpin = !!vue.props.wheelConfig.slowSpin;
      }
      currentAngle = vue?.proxy?.angle ?? vue?.setupState?.angle ?? vue?.ctx?.angle ?? 0;
    } catch(e){}

    const D = 0.005, O = 0.00015, k_const = 0.001, A = 0.6, j_const = 3;
    const q = Math.min(fps, (spinTime * fps) / j_const);
    const J = slowSpin ? k_const : A / fps;
    const Y = spinTime * fps - q;
    const S0 = D + (q + 1) * J;
    const factor = Math.exp(Math.log(O / S0) / Y);
    let speed = S0, decelAngle = 0;
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
    window.crypto.getRandomValues = window.ufs_originalCrypto;
    if (window.ufs_interval) clearInterval(window.ufs_interval);
    window.ufs_interval = null;
    localStorage.removeItem(STORAGE_KEY);
    sendStatusUpdate({ active: false, message: "Đã tắt Hack. Quay ngẫu nhiên." });
  }

  function startHack(rawVal) {
    const targetString = rawVal !== undefined ? rawVal : (localStorage.getItem(STORAGE_KEY) || "");
    const targets = targetString.split(',').map(s => s.trim()).filter(Boolean);

    localStorage.setItem(STORAGE_KEY, targetString);

    if (!targets.length) {
      stopHack();
      return;
    }

    if (window.ufs_interval) clearInterval(window.ufs_interval);

    window.ufs_interval = setInterval(() => {
      const entries = getEntries();
      if (!entries.length) {
        sendStatusUpdate({ active: true, found: false, missingTarget: targets[0], message: `Đang chờ vòng quay nạp danh sách...` });
        return;
      }

      const activeTarget = targets.find(t => entries.some(e => e.toLowerCase() === t.toLowerCase()));

      if (!activeTarget) {
        window.crypto.getRandomValues = window.ufs_originalCrypto;
        sendStatusUpdate({
          active: true,
          found: false,
          missingTarget: targets[0]
        });
        return;
      }

      const targetIndex = entries.findIndex(e => e.toLowerCase() === activeTarget.toLowerCase());

      window.crypto.getRandomValues = function(typedArray) {
        if (typedArray instanceof Uint32Array && typedArray.length === 1) {
          const rFloat = calculateTargetValue(targetIndex, entries.length);
          typedArray[0] = Math.floor(rFloat * 4294967295);
          return typedArray;
        }
        return window.ufs_originalCrypto(typedArray);
      };

      sendStatusUpdate({
        active: true,
        found: true,
        targetName: activeTarget,
        targetIndex: targetIndex,
        totalEntries: entries.length
      });
    }, 300);
  }

  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;

    if (event.data.type === "UFS_START_HACK") {
      startHack(event.data.targets);
    } else if (event.data.type === "UFS_STOP_HACK") {
      stopHack();
    } else if (event.data.type === "UFS_GET_STATUS") {
      sendStatusUpdate(currentStatus);
    }
  });

  if (savedTargets) {
    startHack(savedTargets);
  }
})();
