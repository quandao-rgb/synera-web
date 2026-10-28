# Tổng quan — thay đổi UI và kết quả kiểm tra

Ngày 27/10/2026. Nhánh local: `feat/ui-ux-redesign`. Mốc đối chiếu mã nguồn: `4e8558b58d88f16e45fb54f82a7450638c8d14a6`.

## Kết quả thiết kế

Nền trắng, điểm nhấn xanh dương và chữ navy lấy hướng từ logo gốc. Roboto tự phục vụ, có tiếng Việt. Dải số liệu hoạt động trải ngang; hai bảng chính giữ dữ liệu và thao tác cũ. Khối việc cần làm và gợi ý có phân cấp rõ hơn. Hành trình mới nhất dùng dải ngang trên desktop, dọc trên điện thoại. Tablet nhóm công việc và gợi ý thành các hàng vừa nội dung để tránh khoảng trống do hai khối khác chiều cao.

Thêm icon cùng họ Lucide, màu nền nhạt cho số cần chú ý, trạng thái hover/focus và chuyển động mũi tên ngắn. Reduced motion tắt các chuyển động bổ sung. Không thêm biểu đồ, KPI, khách hàng hoặc số liệu để lấp khoảng trống.

Quy tắc màu, cỡ chữ, nguồn tham khảo Sapo/KiotViet, giấy phép font và hướng dẫn duy trì ở `design-system/synera/pages/dashboard.md`.

## Bằng chứng giữ nguyên hành vi

- So sánh AST của Dashboard với mốc Git: các khai báo state, phép lọc/tính toán, callback, thuộc tính dữ liệu/rows/columns/events/status và đích liên kết khớp bản gốc.
- So sánh snapshot trước/sau: dữ liệu API và toàn bộ nhãn/đích liên kết trên Tổng quan khớp nhau.
- Kiểm tra trực tiếp tab Cần xử lý/Tất cả bằng chuột và Enter: giữ giới hạn hàng và kết quả lọc.
- Sort tồn khả dụng tăng/giảm hoạt động như cũ.
- 15 đích liên kết khác nhau trên Tổng quan mở và quay lại được; không ghi nhận exception JavaScript.
- Menu mobile mở và đóng bằng Escape như trước.
- `backend/`, `shared/`, adapter `app/`, `scripts/`, component dùng chung, logic điều hướng, dependency và các bài test nghiệp vụ không thay đổi.

## Kiểm tra đã hoàn tất

- `npm.cmd test`: 50/50 bài đạt, 0 fail, 0 skip.
- `npm.cmd run check -- --incremental false`: đạt.
- `npm.cmd run build:render`: đạt.
- `node tests/client-bundle-check.mjs dist-render/client`: đạt.
- Kiểm tra trang không tràn ngang ở 320, 375, 390, 768, 1024, 1280 và 1440 CSS px.
- Đã chụp và xem render ở desktop, tablet và mobile; kiểm tra riêng vai trò chủ cơ sở và nhân viên kho.
- Roboto Latin và tiếng Việt thực sự tải được; font thuộc `/assets/`, đúng tuyến tài nguyên hiện có. Không sửa backend để phục vụ font.
- Kiểm tra reduced motion: duration của transition bổ sung về 0s.
- Impeccable static detector đã chạy và không trả finding. Taste browser inspector đã được dùng để sửa lỗi font fallback, khoảng cách mép mobile, căn số và khoảng trống tablet.
- Taste inspector trên bản Tổng quan chủ cơ sở ở 1440/768/390px: 0 FAIL, 0 WARN sau vòng sửa cuối.

Kiểm tra trình duyệt dùng Chrome headless với viewport giả lập; không phải kết quả kiểm thử trên thiết bị vật lý hay audit toàn bộ WCAG. Không chạy lại toàn bộ các giao dịch tạo đơn/đặt giao bằng dữ liệu người dùng.

## Dữ liệu và artifact kiểm tra

Server kiểm tra dùng `http://localhost:4183` và database riêng trong `.sites-runtime/ui-ux-qa/data/`. Không dùng hoặc reset `.data/` của người dùng.

Artifact local, không commit:

- `.sites-runtime/ui-ux-qa/before/`: ảnh và snapshot trước.
- `.sites-runtime/ui-ux-qa/final/`: ảnh Tổng quan và snapshot sau.
- `.sites-runtime/ui-ux-qa/warehouse/`: render của vai trò kho.
- `.sites-runtime/ui-ux-qa/interaction-results.json`: kết quả tương tác.
- `.sites-runtime/ui-ux-qa/tests.log`: log 50 bài kiểm thử.
- `.sites-runtime/ui-ux-qa/font-provenance.json`: URL và SHA256 của các subset Roboto tải từ Google Fonts.

Bản ứng dụng đang xem vẫn ở `http://localhost:4182/#/`, giữ cơ chế đăng nhập hiện có. Chỉ làm việc local trên nhánh riêng; chưa push hoặc gộp `main`.
