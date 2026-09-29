import { getConfig, saveConfig } from '../lib/storage';
import { getActiveTab, isWheelTab, sendToContent, type HackStatus } from '../lib/messaging';
import { EXT_ACTIONS } from '../lib/constants';

document.addEventListener('DOMContentLoaded', async () => {
  const inputEl = document.getElementById('target-input') as HTMLInputElement;
  const btnApply = document.getElementById('btn-apply') as HTMLButtonElement;
  const toggleBtn = document.getElementById('toggle-btn') as HTMLDivElement;
  const toggleText = document.getElementById('toggle-text') as HTMLSpanElement;
  const statusBar = document.getElementById('status-bar') as HTMLDivElement;
  const infoLog = document.getElementById('info-log') as HTMLSpanElement;
  const helpBtn = document.getElementById('help-btn') as HTMLButtonElement;
  const closeGuideBtn = document.getElementById('close-guide-btn') as HTMLButtonElement;
  const guidePanel = document.getElementById('guide-panel') as HTMLDivElement;
  const targetSelect = document.getElementById('target-select') as HTMLSelectElement;
  const entriesBadge = document.getElementById('entries-count') as HTMLSpanElement;
  const quickChips = document.getElementById('quick-chips') as HTMLDivElement;
  const clearInputBtn = document.getElementById('clear-input-btn') as HTMLButtonElement;

  let isActive = false;
  let cachedEntries: string[] = [];

  // Toggle guide panel
  function toggleGuide(show?: boolean) {
    const isCurrentlyHidden = guidePanel.classList.contains('hidden');
    const shouldShow = show !== undefined ? show : isCurrentlyHidden;
    guidePanel.classList.toggle('hidden', !shouldShow);
    helpBtn.style.background = shouldShow ? 'rgba(137, 180, 250, 0.35)' : '';
  }

  helpBtn.addEventListener('click', () => toggleGuide());
  closeGuideBtn.addEventListener('click', () => toggleGuide(false));

  function updateClearBtn() {
    clearInputBtn.classList.toggle('hidden', !inputEl.value);
  }

  inputEl.addEventListener('input', updateClearBtn);
  clearInputBtn.addEventListener('click', () => {
    inputEl.value = '';
    updateClearBtn();
    inputEl.focus();
  });

  function setStatusState(
    type: 'success' | 'warning' | 'error' | 'idle',
    message: string,
  ) {
    statusBar.className = `status-bar ${type}`;
    infoLog.innerText = message;
  }

  function renderAvailableEntries(entries?: string[], selectedTarget?: string) {
    if (entries && entries.length) {
      cachedEntries = entries;
    }

    const currentEntries = cachedEntries;
    if (!currentEntries.length) {
      entriesBadge.innerText = '0 mục';
      targetSelect.innerHTML =
        '<option value="" disabled selected>-- Chưa tìm thấy mục nào trên vòng quay --</option>';
      quickChips.innerHTML = '';
      return;
    }

    entriesBadge.innerText = `${currentEntries.length} mục`;
    const targetMatch = (selectedTarget || inputEl.value).trim().toLowerCase();

    // Populate dropdown
    let selectHtml = `<option value="" disabled ${!targetMatch ? 'selected' : ''}>-- Chọn nhanh từ vòng quay (${currentEntries.length}) --</option>`;
    selectHtml += currentEntries
      .map((name) => {
        const isSelected = name.toLowerCase() === targetMatch;
        return `<option value="${name}" ${isSelected ? 'selected' : ''}>${name}</option>`;
      })
      .join('');
    targetSelect.innerHTML = selectHtml;

    // Populate quick chips
    quickChips.innerHTML = '';
    currentEntries.slice(0, 16).forEach((name) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `chip ${name.toLowerCase() === targetMatch ? 'selected' : ''}`;
      chip.innerText = name;
      chip.title = `Chọn "${name}"`;
      chip.addEventListener('click', async () => {
        inputEl.value = name;
        updateClearBtn();
        await saveConfig({ targetNames: name });
        await executeApply(name);
      });
      quickChips.appendChild(chip);
    });
  }

  targetSelect.addEventListener('change', async () => {
    const selectedName = targetSelect.value;
    if (!selectedName) return;
    inputEl.value = selectedName;
    updateClearBtn();
    await saveConfig({ targetNames: selectedName });
    await executeApply(selectedName);
  });

  function updateStatusUI(status?: HackStatus | null) {
    if (status?.availableEntries) {
      renderAvailableEntries(status.availableEntries, status.targetName);
    }

    if (!status || !status.active) {
      if (isActive) {
        setStatusState('warning', '⚠️ Đã bật Hack. Hãy chọn hoặc nhập tên mục tiêu.');
      } else {
        setStatusState('idle', status?.message || 'Đã tắt Hack. Quay ngẫu nhiên.');
      }
      return;
    }

    if (status.found) {
      setStatusState(
        'success',
        `✅ Luôn trúng: "${status.targetName}" (Vị trí ${status.targetIndex! + 1}/${status.totalEntries})`,
      );
    } else if (status.missingTarget) {
      setStatusState(
        'warning',
        `⚠️ Tên "${status.missingTarget}" chưa có trong danh sách vòng quay!`,
      );
    } else {
      setStatusState('idle', status.message || 'Đang chờ vòng quay nạp danh sách...');
    }
  }

  function setToggleUI(active: boolean) {
    isActive = active;
    toggleBtn.classList.toggle('active', active);
    toggleBtn.setAttribute('aria-checked', String(active));
    toggleText.innerText = active ? 'ON' : 'OFF';
    toggleText.style.color = active ? 'var(--accent-green)' : 'var(--text-dim)';
    btnApply.disabled = !active;
  }

  async function checkTabStatus() {
    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      setStatusState('warning', 'Không tìm thấy tab trình duyệt phù hợp.');
      return;
    }

    if (!isWheelTab(tab)) {
      setStatusState('warning', '⚠️ Hãy mở hoặc chuyển sang tab wheelofnames.com');
      return;
    }

    const res = await sendToContent(tab.id, EXT_ACTIONS.GET_STATUS);
    if (res && res.status) {
      // If extension was supposed to be active, but page reloaded (active: false)
      if (isActive && !res.status.active) {
        const savedVal = inputEl.value.trim();
        if (savedVal) {
          await executeApply(savedVal);
          return;
        }
      }

      setToggleUI(Boolean(res.status.active));
      await saveConfig({ isActive: Boolean(res.status.active) });
      updateStatusUI(res.status);
    } else {
      setStatusState(
        'warning',
        '⚠️ Hãy F5 làm mới trang Wheel of Names để kích hoạt extension.',
      );
    }
  }

  async function executeApply(names: string) {
    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      setStatusState('error', '⚠️ Không tìm thấy tab. Hãy mở Wheel of Names.');
      return;
    }

    if (!isWheelTab(tab)) {
      setStatusState('warning', '⚠️ Hãy chuyển sang tab wheelofnames.com trước.');
      return;
    }

    if (!names) {
      setStatusState('warning', '⚠️ Hãy chọn hoặc nhập ít nhất một tên mục tiêu.');
      return;
    }

    if (!isActive) {
      setToggleUI(true);
      await saveConfig({ isActive: true });
    }

    // Micro-animation trigger
    btnApply.classList.remove('success-flash');
    void btnApply.offsetWidth; // trigger reflow
    btnApply.classList.add('success-flash');

    const res = await sendToContent(tab.id, EXT_ACTIONS.START, { targets: names });
    if (res && res.status) {
      updateStatusUI(res.status);
    } else {
      setStatusState(
        'error',
        '⚠️ Lỗi kết nối! Hãy F5 lại trang Wheel of Names để kích hoạt.',
      );
    }
  }

  async function executeStop() {
    const tab = await getActiveTab();
    if (tab && tab.id && isWheelTab(tab)) {
      const res = await sendToContent(tab.id, EXT_ACTIONS.STOP);
      if (res && res.status) {
        updateStatusUI(res.status);
      } else {
        setStatusState('idle', 'Đã tắt Hack. Quay ngẫu nhiên.');
      }
    } else {
      setStatusState('idle', 'Đã tắt Hack. Quay ngẫu nhiên.');
    }
  }

  async function handleToggle() {
    const nextState = !isActive;
    setToggleUI(nextState);
    await saveConfig({ isActive: nextState });

    if (nextState) {
      const currentVal = inputEl.value.trim();
      if (!currentVal) {
        setStatusState('warning', '⚠️ Đã bật Hack. Hãy chọn hoặc nhập tên mục tiêu.');
        return;
      }
      await executeApply(currentVal);
    } else {
      await executeStop();
    }
  }

  // Toggle button click & key events
  toggleBtn.addEventListener('click', handleToggle);
  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  });

  // Apply button click
  btnApply.addEventListener('click', async () => {
    const rawVal = inputEl.value.trim();
    await saveConfig({ targetNames: rawVal });
    await executeApply(rawVal);
  });

  // Press Enter in input field
  inputEl.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const rawVal = inputEl.value.trim();
      await saveConfig({ targetNames: rawVal });
      await executeApply(rawVal);
    }
  });

  // Initialize data from chrome.storage
  const config = await getConfig();
  if (config.targetNames) {
    inputEl.value = config.targetNames;
    updateClearBtn();
  }
  setToggleUI(config.isActive);

  // Check current tab
  await checkTabStatus();
});
