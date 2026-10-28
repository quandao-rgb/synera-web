# Kiểm tra đợt mở rộng UI/UX — 27/10/2026

## Kết quả triển khai

Mở rộng hướng trắng/xanh và Roboto của Tổng quan sang các màn quản trị, form tạo đơn, chi tiết đơn, xử lý đơn, vận chuyển, hàng hóa, kho, khách hàng, hàng hoàn, công nợ, báo cáo, gợi ý, mua lại, đơn vị vận chuyển và settings. Trang giới thiệu, biểu mẫu tài khoản và trang theo dõi người nhận dùng chung font, control và các quy tắc trình bày liên quan.

Thêm feedback hover/nhấn/focus, chuyển trạng thái lựa chọn, menu account, hình minh họa sản phẩm, ảnh kho và logo hãng mẫu. Form tạo đơn chia rõ nhóm khách/địa chỉ, hàng hóa, tiền hàng và gợi ý vận chuyển. Mô tả vận chuyển ở 13px; metadata 12px. Mobile hiển thị trạng thái kiện dưới thông tin kiện để tránh ép chữ vào cột hẹp.

Thẻ cơ sở vẫn mở settings; menu account hiển thị tên/email hiện có, vai trò workspace và dùng lại callback đăng xuất. Thông tin tài khoản trong settings chỉ hiển thị, không thêm API sửa hồ sơ hoặc đổi mật khẩu.

## Giữ nguyên nghiệp vụ

- Làm local trên `feat/ui-ux-redesign`; không push, merge hoặc thay đổi `main`.
- So sánh SHA256: 60 file backend/shared/tests/scripts/adapter/config và thuật toán được bảo vệ giữ nguyên so với snapshot đầu đợt mở rộng.
- So sánh AST trên 8 file JSX có logic: các callback cũ, liên kết, ràng buộc input, biểu thức tính toán và return không chứa JSX vẫn còn nguyên. Liên kết settings chuyển vào component menu có cùng đích. Kiểm tra này là một lớp bằng chứng, không thay thế kiểm thử hành vi.
- Không thay dependency, endpoint, payload, validation, phân quyền, xếp hạng dịch vụ, cách tính giá, công thức tồn kho hoặc quy tắc tài chính.
- Không sửa `.data/` hoặc tài khoản người dùng. Kiểm tra giao dịch chỉ chạy trên database riêng tại `.sites-runtime/ui-ux-qa/data/`, cổng 4183.

## Kiểm tra đã chạy

- `npm.cmd test`: 50/50 đạt, không fail/skip.
- `npm.cmd run check -- --incremental false`: đạt.
- `npm.cmd run build:render`: đạt sau các chỉnh sửa cuối.
- `node tests/client-bundle-check.mjs dist-render/client`: đạt; không có bản ghi mẫu riêng tư lọt vào client bundle.
- 58 lượt render ở desktop 1440px/mobile 390px: 24 tuyến hoặc trạng thái app, tracking với session hợp lệ, landing, login, register và lỗi tracking. Không ghi nhận tràn ngang, ảnh lỗi hoặc exception JavaScript.
- Kiểm tra chuột trên trình duyệt: chọn khách → gợi ý sơ bộ → tạo đơn giữ hàng → xác nhận kiện qua dialog → chọn ưu tiên/dịch vụ → xem căn cứ → xác nhận đặt giao → bàn giao thực tế. API xác nhận các mốc `packing`, `ready`, `booked` và `handedOver` tương ứng. Xem báo giá không tạo đơn.
- Bốn ảnh logo trong danh sách dịch vụ tải và decode thành công. Khối chọn vận chuyển sau lựa chọn không tràn ngang ở 320/390/768/1024/1280/1440px.
- Menu account: tên/email thật của tài khoản QA, đóng bằng click bên ngoài/Escape, trả focus và mở settings đúng đích. Đăng xuất từ menu thu hồi session và mở login.
- Vai trò kho: projection tiếp tục loại các trường total/COD/finance; nhãn tài khoản đổi đúng vai trò. Render desktop/mobile không tràn ngang.
- Search dialog và drawer mobile mở/đóng bằng thao tác và Escape. Reduced-motion đưa transition bổ sung về 0s và không tạo transform GSAP khi chọn dịch vụ.
- Impeccable static detector trên các phần UI chỉnh sửa: không finding. Taste lint cho ba file trình bày mới/chính: 0 FAIL; cảnh báo shadow thuộc overlay, focus/hover hoặc nét viền lựa chọn, không phải bóng khối đứng yên.
- Taste browser inspector: Tổng quan 1440/768/390px đạt 0 FAIL/0 WARN sau khi đợi app/font tải xong; tạo đơn và chọn giao đạt 0 FAIL. Đã xem ảnh desktop/tablet/mobile; sửa tương phản search, cỡ chữ mô tả, khoảng cách lựa chọn và cột thông tin kiện mobile.

## Đánh giá ảnh render và cảnh báo còn lại

Tổng quan ưu tiên các việc đang chờ; số đơn cần xử lý 3 tương ứng 2 chờ đóng kiện + 1 chờ giao trong fixture. Bảng tồn giữ số và thứ tự cột gốc, số căn phải và dùng tabular numerals. Form tạo đơn giữ nhóm nhận/hàng/tiền dễ phân biệt. Màn chọn giao đưa ưu tiên, danh sách hãng và tóm tắt giá lên trước thông tin bổ trợ; ví dụ 5 × 9,2kg + 3 × 5,4kg = 62,2kg, khớp khối lượng hiển thị.

Các cảnh báo heuristic được giữ có lý do, không thêm ignore để giấu chúng:

- Radius 12/10/8/0 phân biệt khối ngoài, dòng dịch vụ, control và đường bảng, không phải các card ngang hàng dùng bán kính tùy ý.
- Icon nền màu còn ở nhận diện cơ sở/avatar và kiện; tiêu đề bảng không dùng icon trang trí.
- Cột chọn dịch vụ và tóm tắt có chiều cao theo nội dung; không kéo dài khối ít chữ để tạo vùng trắng. Ảnh minh họa và hướng dẫn ở gợi ý trống là nội dung có chủ đích, dù detector coi vùng ảnh CSS là khoảng trống.
- Giữ thông tin đơn và kiện phía dưới vùng chọn giao; không ẩn bớt bước hoặc dữ liệu để ép mọi khối vào một viewport.

Đây là kiểm tra Chrome headless ở viewport giả lập, chưa phải kiểm thử thiết bị vật lý hoặc audit đầy đủ WCAG. Giao diện carrier vẫn là dịch vụ mẫu; logo không thay đổi trạng thái tích hợp.

## Artifact local

Thư mục `.sites-runtime/ui-refresh/` được Git bỏ qua, chứa snapshot baseline, kiểm tra bảo toàn mã, báo cáo 58 lượt render, kết quả tương tác, kết quả role/account, ảnh và báo cáo Taste, nguồn/SHA256 ảnh. Không đưa cookie, database QA hoặc credential fixture vào commit.

Thiết kế hiện tại: `design-system/synera/pages/workspace.md`. Nguồn ảnh/font/logo: `docs/UI-ASSET-SOURCES.md`. Bản xem dành cho người dùng: `http://localhost:4182/#/`.
