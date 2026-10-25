# SYNERA UI v0.2 — 25/10/2026

Yêu cầu trực tiếp: giao diện tựa Sapo đã clone, chức năng và màn hình cá nhân hóa SYNERA, màu trắng/xám/xanh dương/xanh đậm. Hướng thị giác này thay thế nền kem và nhấn nâu trước đó.

## Đã thay đổi

- Khung Sapo: sidebar navy 230px, trạng thái active xanh, header trắng có search, nền xám, bảng và card trắng, radius 4–5px.
- Tổng quan tổ chức theo hoạt động cơ sở: KPI, đơn cần xử lý, tồn kho; cột bên phải cho việc cần làm, ba gợi ý và mốc hành trình. Chỉ số dùng bộ dữ liệu demo hiện tại.
- Màn Xử lý đơn hàng riêng: đóng kiện, đặt giao, bàn giao, kiểm tra timeout; các hàng đợi có URL và số lượng riêng.
- Link việc cần làm mở đúng hàng đợi. Tìm nhanh tìm được mã đơn, tên/SKU hàng và tên/số điện thoại khách; danh mục/CRM nhận bộ lọc từ kết quả.
- Sidebar có nút thu gọn/mở rộng; lựa chọn lưu trên thiết bị. Mobile dùng drawer và focus bàn phím.
- Danh mục, kho, khách, tạo đơn, chi tiết, vận chuyển, hoàn, tài chính, báo cáo, thiết lập và trang người nhận dùng cùng bộ màu mới.

## Quy tắc SYNERA

Giữ luồng xác nhận đơn → giữ hàng; xác nhận kiện; chủ/người có quyền xác nhận đặt giao; bàn giao thực → xuất kho một lần. Kho không nhận dữ liệu tiền hàng/COD/công nợ. Ba gợi ý vẫn phải có căn cứ và người xác nhận. Không sao chép các chức năng khuyến mại, kế toán thuế hay marketplace ngoài phạm vi SYNERA.

## Source

- `app/synera.css`: primitive, component cơ bản, trạng thái và responsive.
- `app/admin-layout.css`: bố cục quản trị gần Sapo, density và màu theo vai trò.
- `app/views/dashboard.jsx`: tổng quan mới.
- `app/views/operations.jsx`: danh sách và hàng đợi xử lý.
- `app/interface.jsx`: shell, thu gọn sidebar, search và deep link.
- `design-system/synera/MASTER.md`: design system hiện hành; có nguồn skill và phép đo contrast.

Các chức năng chưa triển khai đầy đủ tiếp tục được ghi tại COVERAGE.md. Đây là prototype với dữ liệu minh họa, chưa nối API Sapo hay vận chuyển thật. Publication tiếp tục dùng ID đã lưu, không tự tạo Site khác khi dịch vụ chưa tìm được dự án.
