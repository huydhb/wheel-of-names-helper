# 🎡 Wheel of Names Helper (v2.0.0)

> **Tiện ích mở rộng Chrome / Edge** hỗ trợ chọn trước kết quả vòng quay may mắn trên **Wheel of Names**, **Wheel Random** và **Spin the Wheel**.  
> Giao diện Dark Theme cao cấp, tự động quét danh sách tên từ vòng quay và hỗ trợ chọn nhanh chỉ bằng 1 cú nhấp chuột.

---

## 📑 Mục lục
1. [Tính năng chính](#-tính-năng-chính)
2. [Hướng dẫn cài đặt nhanh (Dành cho người dùng)](#-hướng-dẫn-cài-đặt-nhanh-cho-người-dùng-phổ-thông)
3. [Hướng dẫn sử dụng chi tiết](#-hướng-dẫn-sử-dụng-chi-tiết)
4. [Các lỗi thường gặp & Cách xử lý](#-các-lỗi-thường-gặp--cách-khắc-phục)
5. [Dành cho Lập trình viên (Developer Guide)](#-dành-cho-lập-trình-viên-developer-guide)
6. [Trang web hỗ trợ](#-trang-web-hỗ-trợ)

---

## ✨ Tính năng chính

- 🎯 **Kiểm soát kết quả chính xác 100%**: Vòng quay sẽ luôn dừng đúng vào cái tên bạn đã chỉ định.
- 📋 **Tự động nhận diện danh sách tên**: Tự động quét các ô tên đang có trên vòng quay và hiển thị thành danh sách để bạn chọn, không cần phải gõ tay.
- 🏷️ **Thẻ chọn nhanh (Quick Chips)**: Bấm chọn tên trực tiếp qua các thẻ tròn `[ B ]`, `[ C ]`, `[ D ]`... cực kỳ tiện lợi.
- ✍️ **Hỗ trợ danh sách ưu tiên**: Có thể nhập nhiều tên theo thứ tự ưu tiên (ví dụ: `Nam, Huy, Lan` — trúng `Nam` trước, nếu xóa `Nam` sẽ tự chuyển sang `Huy`).
- 🔄 **Công tắc Bật/Tắt (Toggle ON/OFF)**: Chuyển đổi trạng thái hack và quay ngẫu nhiên bình thường chỉ với 1 click.
- 💾 **Tự động ghi nhớ cấu hình**: Cài đặt một lần, tiện ích sẽ tự lưu lại ngay cả khi bạn tắt trình duyệt hoặc tải lại trang (F5).
- 🛡️ **An toàn & Bí mật**: Giao diện ngụy trang gọn nhẹ, thao tác ngầm, người xem màn hình không thể phát hiện.

---

## 📦 Hướng dẫn cài đặt nhanh (cho người dùng phổ thông)

> Bạn **không cần** biết lập trình hay gõ bất kỳ câu lệnh nào, chỉ cần làm theo 4 bước sau:

### Bước 1: Tải thư mục tiện ích về máy
- Tải thư mục dự án hoặc bản phát hành (file ZIP) về máy tính và giải nén ra.
- Thư mục chứa tiện ích đã được dựng sẵn nằm ở đường dẫn:  
  📁 `wheel-of-names-extension/dist`

---

### Bước 2: Mở trang quản lý Tiện ích trên trình duyệt
Mở trình duyệt **Google Chrome**, **Cốc Cốc**, **Brave** hoặc **Microsoft Edge**:
- Nhập đường dẫn sau vào thanh địa chỉ rồi nhấn Enter:
  - Trên Chrome / Cốc Cốc / Brave: `chrome://extensions/`
  - Trên Microsoft Edge: `edge://extensions/`

---

### Bước 3: Bật Chế độ dành cho nhà phát triển
- Nhìn lên góc **trên cùng bên phải** của màn hình.
- Bật công tắc **Chế độ dành cho nhà phát triển** (Developer mode).

---

### Bước 4: Nạp tiện ích vào trình duyệt
1. Nhấn vào nút **Tải tiện ích đã giải nén** (Load unpacked) ở góc trên bên trái.
2. Chọn thư mục **`dist`** bên trong thư mục dự án đã tải về.
3. Tiện ích **Wheel of Names Helper** sẽ xuất hiện trong danh sách!
4. *(Khuyên dùng)*: Bấm vào biểu tượng **Mảnh ghép (Extensions)** ở góc trên thanh công cụ trình duyệt rồi bấm nút **Ghim (Pin 📌)** tiện ích để tiện sử dụng.

---

## 🎮 Hướng dẫn sử dụng chi tiết

### Cách 1: Chọn nhanh bằng Dropdown hoặc Thẻ bấm (Khuyên dùng)
1. Mở trang web [wheelofnames.com](https://wheelofnames.com/) và chuẩn bị danh sách tên trên vòng quay.
2. Bấm vào biểu tượng **Wheel Helper (🎡)** trên thanh công cụ trình duyệt để mở bảng điều khiển.
3. Bật công tắc sang **ON**.
4. Tiện ích sẽ tự động nhận diện các tên đang có trên vòng quay:
   - **Cách A**: Nhấp vào menu **"🎯 Chọn nhanh từ vòng quay"** và chọn tên bạn muốn trúng.
   - **Cách B**: Bấm trực tiếp vào các **Thẻ tên tròn** (Quick Chips) bên dưới (ví dụ bấm vào thẻ `[ C ]`).
5. Thẻ được chọn sẽ sáng màu xanh ngọc và kích hoạt ngay lập tức!
6. Bấm quay bánh xe trên trang web — kim quay sẽ luôn chỉ đúng vào tên bạn đã chọn.

---

### Cách 2: Nhập danh sách tên thủ công (Nhiều mục tiêu ưu tiên)
1. Mở popup tiện ích và bật công tắc **ON**.
2. Gõ tên vào ô **"Hoặc nhập thủ công"**:
   - Nếu muốn chọn 1 người: Nhập `Nam`
   - Nếu muốn danh sách ưu tiên: Nhập `Nam, Huy, Hùng` (ngăn cách bằng dấu phẩy)
3. Nhấn nút **Áp Dụng** (hoặc nhấn phím **Enter** trên bàn phím).
4. Đèn trạng thái chuyển sang **màu xanh lá** báo hiệu đã cài đặt thành công!

---

## ❓ Các lỗi thường gặp & Cách khắc phục

### 1. Hiện thông báo *"Lỗi kết nối trang web! Hãy F5 lại trang"*
- **Nguyên nhân**: Tiện ích vừa được cài đặt hoặc tải lại, trang web vòng quay đang mở từ trước chưa kịp nạp mã can thiệp.
- **Cách xử lý**: Nhấn phím **F5** (hoặc Ctrl + R) trên tab vòng quay để làm mới trang.

### 2. Hiện thông báo *"Tên chưa có trong danh sách vòng quay"*
- **Nguyên nhân**: Tên bạn gõ trong tiện ích bị sai chính tả hoặc không khớp với chữ trên vòng quay (ví dụ trên vòng quay là `Huy`, bạn gõ `Huy Nguyễn`).
- **Cách xử lý**: Dùng chức năng **Chọn nhanh từ Dropdown** hoặc click vào các **Thẻ tên có sẵn** để đảm bảo chính xác 100%.

### 3. Vòng quay không dừng đúng tên đã chọn
- **Cách xử lý**: 
  1. Kiểm tra lại công tắc xem đã ở vị trí **ON** hay chưa.
  2. Đảm bảo đèn trạng thái đang báo **màu xanh lá** (`✅ Luôn trúng:...`).
  3. Nếu vừa chỉnh sửa danh sách tên trên trang web, hãy bấm lại nút **Áp Dụng** một lần nữa.

---

## 🛠️ Dành cho Lập trình viên (Developer Guide)

Nếu bạn muốn tùy biến mã nguồn hoặc phát triển thêm tính năng:

### Yêu cầu môi trường
- [Node.js](https://nodejs.org/) version 18.0.0 trở lên.
- Quản lý gói `npm`.

### Cài đặt & Chạy môi trường phát triển (Dev Mode)
```bash
# 1. Clone repository
git clone https://github.com/huydhb/wheel-of-names-extension.git
cd wheel-of-names-extension

# 2. Cài đặt các dependencies
npm install

# 3. Chạy server phát triển với HMR (Hot Module Replacement)
npm run dev
```

### Đóng gói sản phẩm (Production Build)
```bash
# Kiểm tra TypeScript và đóng gói bản phát hành vào thư mục dist/
npm run build

# Kiểm tra cú pháp mã nguồn
npm run lint

# Tự động định dạng mã nguồn chuẩn Prettier
npm run format
```

### Cấu trúc mã nguồn
```
wheel-of-names-extension/
├── manifest.json                 # Cấu hình Chrome Extension Manifest V3
├── vite.config.ts                # Cấu hình đóng gói Vite + @crxjs/vite-plugin
├── tsconfig.json                 # Cấu hình TypeScript compiler
├── src/
│   ├── background/
│   │   └── service-worker.ts     # Service Worker nền
│   ├── content/
│   │   ├── content.ts            # Content script cầu nối (Isolated world)
│   │   └── inject.ts             # Core script can thiệp crypto (Main world)
│   ├── popup/
│   │   ├── index.html            # Giao diện Popup với Dropdown & Quick Chips
│   │   ├── popup.ts              # Xử lý logic giao diện người dùng
│   │   └── popup.css             # Glassmorphism Catppuccin theme & animation
│   └── lib/
│       ├── constants.ts          # Định nghĩa hằng số, message types, domains
│       ├── storage.ts            # Wrapper tương tác chrome.storage.local
│       └── messaging.ts          # Typed message dispatcher giữa các script
├── public/icons/                 # Bộ biểu tượng extension (16px, 48px, 128px)
└── dist/                         # Thư mục xuất bản hoàn chỉnh để nạp vào Chrome
```

---

## 🌐 Trang web hỗ trợ

Tiện ích hoạt động mượt mà trên tất cả các trang web vòng quay phổ biến nhất hiện nay:
- 🎡 **Wheel of Names**: [https://wheelofnames.com/](https://wheelofnames.com/)

---

## ⚖️ Tuyên bố miễn trừ trách nhiệm (Disclaimer)
Dự án được xây dựng phục vụ mục đích nghiên cứu học thuật, kiểm thử bảo mật trình duyệt và giải trí. Tác giả không chịu trách nhiệm đối với bất kỳ hành vi sử dụng sai mục đích nào.
