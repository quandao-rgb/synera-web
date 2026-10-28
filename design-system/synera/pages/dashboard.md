# Tổng quan — trắng và xanh theo logo SYNERA

Phạm vi: chỉ phần trình bày màn hình Tổng quan trên nhánh `feat/ui-ux-redesign`. Chỉ dẫn của chủ dự án ngày 27/10/2026 và `docs/UI-UX-REDESIGN-SCOPE.md` quyết định phạm vi. File này bổ sung quy tắc riêng cho Tổng quan; các màn hình khác tiếp tục dùng MASTER.md.

## Logo và dải màu

Logo gốc ở `frontend/public/assets/brand/synera-logo.png`: chữ navy đậm, biểu tượng chuyển từ xanh dương/cyan sang xanh tím. Giữ nguyên tài nguyên logo. Lấy xanh dương làm điểm nhấn giao diện; xanh tím tiếp tục nằm trong logo.

| Vai trò | Màu |
| --- | --- |
| Bề mặt khối và bảng | `#FFFFFF` |
| Chữ chính, số liệu | `#122B49` |
| Nút chính, link, icon có ý nghĩa, focus | `#1263D6` |
| Hover và chữ trên nền xanh nhạt | `#084DA9` |
| Nền nhấn nhẹ | `#EDF5FF` |
| Nền nhấn cấp hai | `#E2EFFF` |
| Chữ phụ | `#53667C` |
| Viền khối | `#DDE7F2` |
| Đường phân cách hàng | `#EDF1F6` |

Các màu trạng thái nghiệp vụ đang dùng tiếp tục giữ ý nghĩa cũ. Không đổi trạng thái chỉ để phù hợp màu mới.

## Kiểu chữ và mật độ

- Roboto tự lưu trong dự án, có Latin, Latin mở rộng và tiếng Việt; fallback Roboto/Segoe UI/Arial/sans-serif.
- Tiêu đề trang 26px desktop, 24px mobile; tiêu đề khối 16px desktop, 15px mobile.
- Nội dung 14px; bảng 13–14px; nhãn và chú thích 12px; nhãn trạng thái nhỏ nhất 11px trên desktop.
- Giá trị KPI 30px desktop, 28px mobile. Dùng chữ số tabular; số liệu trong cột căn phải.
- Weight chính 400/500/600. Không viết hoa giãn chữ cho nhãn bảng.
- Khoảng cách khối 20px desktop, 16px khi hẹp hơn. Radius khối 12px; dùng viền nhẹ, không đổ bóng lên mọi khối.

## Bố cục và component

- Dải hoạt động bốn số liệu nằm trên cùng. Các giá trị, cách tính và đích liên kết giữ nguyên.
- Bảng đơn hàng và bảng tồn kho tiếp tục là nội dung chính; giữ tab, sort, số hàng giới hạn và các cột hiện có.
- Việc cần làm và Gợi ý SYNERA là cột phụ trên desktop. Tablet sắp lại phần trình bày để không có một khối ngắn cạnh một khối dài tạo khoảng trống lớn.
- Hành trình mới nhất là dải ngang trên desktop và danh sách dọc trên mobile; giữ nguyên thứ tự sự kiện, thông tin nguồn và thời điểm ghi nhận.
- Bổ sung icon Lucide cùng họ cho tiêu đề khối và phần gợi ý; số cần xử lý và tồn khả dụng có nền xanh nhạt.
- Mobile giữ toàn bộ trường dữ liệu; các con số tồn kho chia bốn cột nhỏ trong mỗi hàng sản phẩm.

## Motion và ranh giới hành vi

- Feedback hover/focus cho nút, link và hàng; mũi tên dịch chuyển nhẹ khi hover. Timing chung 180ms với easing giảm tốc.
- Không có chuỗi animation mở trang làm chờ thao tác; nội dung hiển thị ngay.
- `prefers-reduced-motion` tắt chuyển động bổ sung.
- Không thêm bộ lọc, biểu đồ, bước xác nhận, callback, state hay thuật toán mới. Không thêm số liệu mẫu để lấp khoảng trống.

## Nguồn tham khảo

- Sapo: [Giới thiệu giao diện Tổng quan](https://help.sapo.vn/gioi-thieu-giao-dien-tong-quan-phan-mem-quan-ly-ban-hang-sapo), tham khảo cách nhóm số liệu và công việc.
- KiotViet: [Tổng quan](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-bao-cao/tong-quan/), tham khảo phân cấp thông tin trên màn hình quản lý.
- UI/UX Pro Max: tra cứu inventory dashboard, React và reduced motion. Áp dụng nguyên tắc phù hợp ứng dụng; không dùng bố cục landing page mà kết quả tổng hợp gợi ý.
- Taste: app style `accent-ladder`, seed `793879674`; giữ palette/type đã được chủ dự án chỉ định, giữ các luồng hiện hữu.
- Impeccable: scoped polish và kiểm tra cơ học. Đánh giá detector không thay thế kiểm tra render và tương tác.

## Font và giấy phép

Roboto được lấy từ Google Fonts, khai báo weight biến thiên 400–700 và tự phục vụ dưới `/assets/fonts/roboto/`. Ba file WOFF2 khoảng 87KB tổng cộng; trình duyệt chỉ tải subset cần dùng.

- CSS nguồn: `https://fonts.googleapis.com/css2?family=Roboto:wght@400..700&display=swap`.
- Giấy phép OFL: `frontend/public/assets/fonts/roboto/OFL.txt`, từ kho [google/fonts/ofl/roboto](https://github.com/google/fonts/tree/main/ofl/roboto).
- Không gọi Google Fonts khi chạy ứng dụng; không thêm dependency.
