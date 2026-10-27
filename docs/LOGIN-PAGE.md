# Trang đăng nhập SYNERA

Landing mở trang `/login` riêng; Node hỗ trợ truy cập trực tiếp, refresh và HEAD. Cloudflare dùng adapter `app/login/page.tsx`. Đăng ký vẫn mở biểu mẫu hiện có tại `/?auth=register`.

## Giao diện và material

Artwork SYNERA được chủ dự án duyệt hòa vào nền xanh → xanh nhạt → gần trắng. Desktop chia 58%/42%, khung tối đa 440px. Ảnh dùng `object-fit: contain` để giữ laptop/dashboard; mask làm mềm các mép. Tablet/mobile chuyển một cột, artwork mờ phía sau form.

Dùng **package thật `liquid-glass-react@1.1.1`**, đã đọc [README và implementation upstream](https://github.com/rdev/liquid-glass-react). `LoginGlass.jsx` bọc form bằng đúng **một** `LiquidGlass`, không dùng từng instance trên mỗi input. Các input là control trong suốt nhẹ, cao 48px; password toggle 44px; font Segoe UI hỗ trợ tiếng Việt. Chữ/nội dung form ở lớp riêng, không nhận filter khúc xạ.

| Thuộc tính | Giá trị |
| --- | --- |
| mode | `standard` |
| displacementScale | `42` (upstream tự nhân 0.5 khi `overLight`) |
| blurAmount | `0.10` (upstream tạo blur `15.2px` khi `overLight`) |
| saturation | `122` |
| aberrationIntensity | `0.6` |
| elasticity | `0` để khung luôn đứng yên |
| cornerRadius | `24` |
| overLight | `true` |
| padding | `0px` — spacing nằm trong form SYNERA |

`mouseContainer` nhận ref toàn trang. Viền phản sáng tự nhiên của package thay đổi theo chuột; không nghiêng, xoay hay kéo form. CSS giới hạn các lớp mặc định của package vào một footprint, bỏ scrim đen và giảm shadow. Opacity lớp quang học `0.14` giữ nền sáng; các lớp viền của package vẫn hoạt động. Chiều cao lớp kính/viền theo form khi xuất hiện lỗi, không cắt thông báo.

Các override chỉ áp dụng trong `.synera-login`; không sửa node_modules hoặc màn hình khác. Thứ tự prefix backdrop-filter được kiểm tra trên CSS production để phần chứa chữ thực sự có `backdrop-filter: none`.

## Fallback, accessibility và chuyển động

- `login-glass-policy.mjs` chỉ bật displacement cho Chromium có backdrop-filter. Safari/Firefox/iOS hoặc môi trường thiếu hỗ trợ dùng cùng bố cục với nền trong suốt nhẹ, blur/saturation, viền và shadow; không hiện cảnh báo trình duyệt. Không có backdrop-filter thì dùng nền đặc sáng.
- SSR hiển thị khung tĩnh trước khi mount: không render package đang đọc `navigator` trên server.
- Touch/coarse pointer và reduced motion không đăng ký theo dõi chuột của package; truyền cả `globalMousePos` và `mouseOffset` tĩnh. Media preference thay đổi được cập nhật và listener được dọn khi unmount; không remount form theo preference.
- `prefers-reduced-transparency` dùng nền đặc và ẩn lớp quang học.
- Tái sử dụng **GSAP/@gsap/react có sẵn**: entrance một lần, 360ms, x14/y5/scale0.985 → vị trí gốc, ease-out; nhóm nội dung stagger 30ms. Cleanup và `matchMedia` hỗ trợ đổi reduced motion ngay khi trang đang mở. Không có loop, spring, tilt hay parallax nền.
- CTA gradient xanh → xanh tím theo thương hiệu, hover y−1px, active scale0.985, 130ms. Reduced motion tắt chuyển động. Giữ focus ring, label, autocomplete, thông báo lỗi và password toggle dùng được bằng bàn phím.

Glass, gradient và shadow là yêu cầu trực tiếp của chủ dự án, được ưu tiên so với quy tắc mặc định của design-taste-frontend. Áp dụng hướng dẫn về form, tương phản và motion của UI/UX Pro Max đã đọc từ zip người dùng cung cấp.

## Xác thực giữ nguyên

Không thay đổi `sendAuth`, `useAuthSubmit`, API, payload, HttpOnly session, ID người dùng, validation, phân quyền hay dữ liệu. Login vẫn POST `/api/auth/login`, rồi xác nhận `/api/auth/session` trước khi vào `/#/`. Đăng nhập sai giữ người dùng ở form và focus đến alert. Hiện/ẩn mật khẩu, loading, lỗi mạng và form đăng ký có sẵn được giữ lại. Profile Cloudflare tiếp tục đường đăng nhập ChatGPT hiện có.

Không thêm ghi nhớ đăng nhập, quên mật khẩu, Google hay đăng nhập bằng điện thoại. Không sửa landing video hoặc màn hình quản trị. Chỉ cập nhật branch `feat/dedicated-login-page`, [PR #2](https://github.com/quandao-rgb/synera-web/pull/2); chưa merge main hoặc deploy Render.

## Kiểm chứng

- **54/54 Node tests đạt**: toàn bộ auth/domain/route hiện có; thêm kiểm tra policy Chromium/Safari/Firefox/iOS/no-backdrop, motion/touch/transparency và SSR không có navigator.
- TypeScript, Node build và Cloudflare build đạt; client bundle privacy check đạt cả hai profile.
- Chrome qua CUA: layout 1920×1080, 1440×900, 768×1024, 390×844 không tràn ngang. Chữ và input không nhận filter; form không nhận backdrop-filter. Thử focus và phản sáng chuột: viền đổi, tọa độ khung giữ nguyên.
- Browser: required validation, login sai/focus alert, Tab/Space bật/tắt mật khẩu, login đúng bằng Enter → Tổng quan, logout → `/login`; link đăng ký mở đúng form hiện có. Khi lỗi xuất hiện, lớp kính mở rộng theo form.
- **Giới hạn:** Safari/Firefox được kiểm tra bằng policy và CSS fallback, chưa chạy trực tiếp trên các trình duyệt đó. Reduced-motion/touch được kiểm tra bằng policy, CSS và cleanup GSAP; chưa giả lập preference hệ điều hành trong browser. Ảnh responsive là thay đổi viewport Chrome, không phải thiết bị touch thật.

![Desktop rộng](login-wide.png)

![Desktop](login-desktop.png)

![Tablet](login-tablet.png)

![Mobile](login-mobile.png)

## Asset và chạy local

`frontend/public/assets/login/synera-product-environment.png` là bản 1536×1024 tạo bằng imagegen từ ảnh quảng bá 540×360 chủ dự án cung cấp. Đây là biến thể nâng độ nét, không phải file gốc nguyên byte. Artwork là hình quảng bá, dữ liệu in trong ảnh không phải dashboard live. Logo trên form dùng component thương hiệu hiện có. Tham khảo luồng trang riêng từ [Sapo](https://www.sapo.vn/dang-nhap-kenh-ban-hang.html); không sao chép thông tin tài khoản/asset Sapo.

```powershell
git fetch origin
git switch --track origin/feat/dedicated-login-page
npm.cmd ci
npm.cmd run build:render
npm.cmd run dev:local
```

Lệnh switch dùng cho máy chưa có branch local tương ứng; nếu đã có thì `git switch feat/dedicated-login-page`. Không chuyển branch khi đang có thay đổi chưa lưu. Cài/chạy từ gốc repository, không chạy trong riêng frontend.

Local mặc định: `http://localhost:4182/login`. Preview riêng trong phiên làm việc này: `http://127.0.0.1:4186/login`, database QA riêng với bản gốc `C:\SYNERA`.
