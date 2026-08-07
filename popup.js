document.addEventListener("DOMContentLoaded", async () => {
  const inputEl = document.getElementById("target-input");
  const btnApply = document.getElementById("btn-apply");
  const btnReset = document.getElementById("btn-reset");
  const logEl = document.getElementById("info-log");
  const dotEl = document.getElementById("status-dot");

  // Lấy tab đang active trên miền wheelofnames/wheelrandom/spinthewheel
  async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  }

  // Tải cấu hình đã lưu
  const data = await chrome.storage.local.get(["targetNames"]);
  if (data.targetNames) {
    inputEl.value = data.targetNames;
  }

  function updateStatusUI(status) {
    if (!status || !status.active) {
      dotEl.style.background = "#f38ba8";
      dotEl.style.boxShadow = "0 0 6px rgba(243, 139, 168, 0.6)";
      logEl.style.color = "#f5e0dc";
      logEl.innerText = status?.message || "Đã tắt Hack. Quay ngẫu nhiên.";
      return;
    }

    if (status.found) {
      dotEl.style.background = "#a6e3a1";
      dotEl.style.boxShadow = "0 0 6px rgba(166, 227, 161, 0.6)";
      logEl.style.color = "#a6e3a1";
      logEl.innerText = `✅ Luôn trúng: "${status.targetName}" (Vị trí ${status.targetIndex + 1}/${status.totalEntries})`;
    } else {
      dotEl.style.background = "#fab387";
      dotEl.style.boxShadow = "0 0 6px rgba(250, 179, 135, 0.6)";
      logEl.style.color = "#f38ba8";
      logEl.innerText = `❌ Tên "${status.missingTarget}" không có trong danh sách!`;
    }
  }

  async function checkTabStatus() {
    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      logEl.innerText = "Mở trang Wheel of Names để sử dụng.";
      return;
    }

    try {
      const res = await chrome.tabs.sendMessage(tab.id, { action: "get_status" });
      if (res && res.status) {
        updateStatusUI(res.status);
      }
    } catch (e) {
      logEl.innerText = "Hãy F5 làm mới trang Wheel of Names để kích hoạt.";
    }
  }

  btnApply.onclick = async () => {
    const rawVal = inputEl.value.trim();
    await chrome.storage.local.set({ targetNames: rawVal });

    const tab = await getActiveTab();
    if (tab && tab.id) {
      try {
        const res = await chrome.tabs.sendMessage(tab.id, { action: "start_hack", targets: rawVal });
        if (res && res.status) {
          updateStatusUI(res.status);
        }
      } catch (e) {
        logEl.innerText = "Lỗi kết nối trang web! Hãy F5 lại trang Wheel of Names.";
      }
    }
  };

  btnReset.onclick = async () => {
    inputEl.value = "";
    await chrome.storage.local.remove("targetNames");

    const tab = await getActiveTab();
    if (tab && tab.id) {
      try {
        const res = await chrome.tabs.sendMessage(tab.id, { action: "stop_hack" });
        if (res && res.status) {
          updateStatusUI(res.status);
        }
      } catch (e) {
        updateStatusUI({ active: false, message: "Đã tắt Hack." });
      }
    }
  };

  checkTabStatus();
});
