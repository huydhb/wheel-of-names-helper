(function () {
  let latestStatus = { active: false, message: "Chưa kích hoạt" };

  function injectScript() {
    if (document.getElementById("ufs-page-hack-script")) return;

    const script = document.createElement("script");
    script.id = "ufs-page-hack-script";
    script.src = chrome.runtime.getURL("inject.js");
    script.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  injectScript();

  // Lắng nghe cập nhật trạng thái từ inject.js (trang web)
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "UFS_STATUS_UPDATE") {
      latestStatus = event.data.status;
    }
  });

  // Lắng nghe thông điệp từ popup.js
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req.action === "start_hack") {
        window.postMessage({ type: "UFS_START_HACK", targets: req.targets }, "*");
        setTimeout(() => {
          sendResponse({ status: latestStatus });
        }, 50);
        return true;
      } else if (req.action === "stop_hack") {
        window.postMessage({ type: "UFS_STOP_HACK" }, "*");
        latestStatus = { active: false, message: "Đã tắt Hack. Quay ngẫu nhiên." };
        sendResponse({ status: latestStatus });
      } else if (req.action === "get_status") {
        window.postMessage({ type: "UFS_GET_STATUS" }, "*");
        setTimeout(() => {
          sendResponse({ status: latestStatus });
        }, 50);
        return true;
      }
    });
  }
})();
