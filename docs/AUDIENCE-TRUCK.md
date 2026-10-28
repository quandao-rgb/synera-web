# Xe tự chạy trong dải “Cơ sở phù hợp”

Theo yêu cầu mới, **đã bỏ hoàn toàn bám chuột và roaming ở góc viewport**. Xe được mount bên trong section `.sl-audience`, ngay dưới hero, chứa câu “Dành cho cơ sở bán sỉ…” và ba nhóm hàng.

## Phạm vi và hành vi

- Một xe đỏ, thùng vàng kem tự chạy theo đường cong trong phần trống của chính dải trắng.
- Không đổi vị trí/copy của chữ, icon, chiều cao hay padding của section. Không thêm đường chạy hoặc UI điều khiển.
- Đo vùng chữ và nhóm icon bằng DOM, tìm hình chữ nhật trống có khoảng cách an toàn. Nếu không đủ chỗ thì ẩn hiệu ứng, không đẩy nội dung để tạo chỗ.
- Overlay dùng **position:absolute**, tọa độ local của vùng trống, `overflow:hidden` và `pointer-events:none`. Xe và khói bị clip tại vùng này, không đi sang hero, section khác hoặc bám theo màn hình khi cuộn.
- Không có listener pointermove/mousemove, tọa độ con trỏ, idle timer hoặc logic chuyển sang follow. Con trỏ hệ thống giữ nguyên.
- Xe và khói dừng khi section ra khỏi viewport, tab/window không hoạt động, mở account dialog/solutions menu hoặc bật giảm chuyển động. ResizeObserver cập nhật giới hạn khi section/chữ đổi kích thước.
- Trên mobile/tablet/coarse pointer hoặc không có hover, hiệu ứng vẫn tắt để giữ mật độ và khả năng đọc hiện tại.

## Hình ảnh và chuyển động

Giữ atlas `/assets/cursor/delivery-truck-directions.webp` (640×280, khoảng 49KB, alpha thật), gồm 8 góc nhìn riêng từ bộ xe người dùng đã cung cấp. Đi lên dùng góc nhìn trên, đi xuống dùng góc trước, các hướng khác chọn view tương ứng. Đây là sprite giả 3D; không thêm model, Three.js hoặc WebGL.

Khói phát từ đuôi theo đúng view, pool tối đa 24 DOM nodes, 560–780ms, vệt tối đa 104px và bị clip cùng xe. Chỉ cập nhật transform/opacity qua RAF, không React state mỗi frame. Nan bánh ở góc ngang quay theo quãng đường; thân rung dưới 0.32px và nghiêng tối đa ±4°.

## File

- `frontend/components/landing/SyneraAudienceTruck.jsx`: renderer thuộc section, đo nội dung, preload, observers, lifecycle và cleanup.
- `frontend/components/landing/audience-truck-zone.mjs`: tìm vùng trống, đường chạy local có giới hạn.
- `frontend/components/landing/truck-animation-engine.mjs`: chọn 8 view, khói và chuyển động.
- `frontend/components/landing/LandingPage.jsx`: mount xe bên trong `.sl-audience`, tắt khi mở account form.
- `frontend/app/landing.css`: vị trí section/overlay và sprite; không có cursor toàn trang.
- `tests/truck-animation.test.mjs`, `tests/audience-truck.test.mjs`, `tests/audience-truck-lifecycle.test.mjs`.

Hai module cursor cũ và các kiểm thử follow/idle cũ đã được thay thế. API, xác thực, quyền, route, video và các section khác không đổi.

## Kiểm chứng

62/62 tests đạt: regression hiện có, 8 view/đuôi xe, khói và pool, mô phỏng một phút không ra khỏi dải hoặc chạm chữ/icon ở 1900/1440/1280px, ẩn khi thiếu chỗ. Lifecycle DOM/timer giả lập xác nhận không đăng ký listener chuột và hủy RAF/observer/media handlers khi cần. TypeScript, build Node/Cloudflare và privacy check hai bundle đạt.

Đây là kiểm thử tự động và DOM giả lập, chưa thay thế kiểm tra trực quan/FPS thực trên Chrome; công cụ Chrome ở các lượt trước không xác minh URL được. Local: `http://127.0.0.1:4186/`, Ctrl+F5 rồi cuộn tới dải trắng dưới hero.

## Backup

Source trước lần đổi này: `C:\SYNERA-backups\SYNERA-before-audience-truck-20261028-165612.zip` (193 entries), gồm cả source chưa commit và atlas. Đã mở lại để xác nhận có component cursor cũ. Không chứa dependencies, build, database, secret hoặc Git metadata. Giải nén vào thư mục riêng để xem/khôi phục, không ghi đè source đang sửa khi chưa lưu.

Các backup trước đó vẫn được giữ trong `C:\SYNERA-backups`. Source xe nằm trên branch feat/landing-audience-truck, dựa trên feat/dedicated-login-page (PR #2). Chưa merge main hoặc deploy Render.
