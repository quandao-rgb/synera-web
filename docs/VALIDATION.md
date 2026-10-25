# Kiểm chứng prototype — 25/10/2026

## Giao diện quản trị v0.2 theo Sapo

- TypeScript và 17 kiểm thử domain: qua sau thay đổi giao diện. Build Vinext: qua.
- Desktop 1440px: đã kiểm tra nền sidebar `rgb(18,43,73)` và nút chính `rgb(23,105,194)`; không tràn ngang toàn trang.
- Reflow tổng quan 375/768/1024/1440/1920px: scrollWidth bằng clientWidth. Hàng đợi và chi tiết DH1026 ở 375px cũng không tràn ngang.
- Link “Đơn chờ đặt giao” → `#/packing/ready`, chọn đúng hàng đợi và hiển thị DH1026. Bốn trạng thái có số lượng từ dữ liệu.
- Search toàn cục SKU TD-350 → danh mục với đúng một dòng và bộ lọc SKU; search số điện thoại khách → CRM với đúng một dòng. Tên khách có thể trả cả đơn của khách và hồ sơ CRM, phân biệt bằng nhãn loại kết quả.
- Thu gọn sidebar đo được 68px, mở rộng lại được. Vai trò kho trên màn xử lý đơn: không có cột tiền hàng, không có ký hiệu tiền trong nội dung và không có mục công nợ.
- Form tạo đơn chọn KH01 và 2 thùng: xuất hiện ba phương án minh họa, trong đó điều kiện không phù hợp được nêu rõ; trang không tràn ngang.
- Ảnh mới tại `screenshots/v0.2/`. Các ảnh ở thư mục gốc là lịch sử giao diện trước.
- API/domain không đổi trong vòng chỉnh UI này; kết quả 10 HTTP checks bên dưới thuộc lượt kiểm chứng API trước đó. Giới hạn production và các FR chưa hoàn tất vẫn theo COVERAGE.md.

## Tự động

- Domain: 17/17 ca đã qua, bao gồm điều kiện vùng/tải/thiếu dữ liệu và lọc sự kiện nội bộ khỏi trang người nhận.
- TypeScript `tsc --noEmit`: đã qua sau khi bổ sung kiểm tra cấu trúc request API.
- Build Vinext/Sites: đã build thành công. Output có Worker và assets riêng; chỉ build lại khi source runtime thay đổi.
- Worker HTTP: 10 kiểm tra đã qua cho xác thực, dữ liệu kho, quyền, write version cũ, Origin khác, token theo dõi và raw source 404. Danh tính được mô phỏng bằng header trên loopback, không kiểm chứng cơ chế đăng nhập của Sites production.
- `tests/client-bundle-check.mjs`: không tìm thấy các dấu hiệu bản ghi riêng tư mẫu đã chọn trong bundle JS công khai. Đây là kiểm tra bổ sung, không thay thế kiểm chứng phân quyền API.

## Trình duyệt Chrome

Đã thao tác thành công: tạo DH1029 với 2 thùng trà đào; gợi ý tự xuất hiện; đổi vai trò kho; sửa khối lượng kiện đầu thành 9,5 kg kèm lý do; xác nhận kiện; kho không có giá bán/COD/tiền hàng; đổi chủ; chọn dịch vụ; mô phỏng timeout; kiểm tra tìm thấy vận đơn cũ; bàn giao; mở trang người nhận với điện thoại che bớt.

Đã mở 12 phân hệ desktop 1440px. Các trang hàng, kho, khách, nhắc mua, gợi ý, giao hàng, hãng, hoàn, tài chính và báo cáo không tràn ngang toàn trang. Thiết lập/đơn cũng mở được. Không thấy lỗi runtime ứng dụng trong lượt kiểm tra các route sau khi sửa import.

Mobile 375px đã phát hiện và sửa lỗi CSS layers làm ẩn nút menu. Sau sửa đã mở menu và điều hướng sang kho. Drawer có focus trap/Escape, khóa cuộn nền và inert khi đóng. Bảng chuyển thành card. Kiểm chứng kích thước còn lại được ghi trong kết quả cuối.

## Giới hạn

- Chrome đang có extension thêm thuộc tính `bis_skin_checked`, `bis_register` và `__processed_*` trước hydration. Console dev có cảnh báo hydration thuộc tính này; không chỉnh cấu hình hoặc tắt extension của người dùng, không che cảnh báo bằng suppressHydrationWarning.
- Không chạy load test, audit WCAG đầy đủ, kết nối hãng, gửi tin nhắn, thanh toán hay thử dữ liệu Sapo thật.
- Khi chạy Vite và Worker cùng lúc, dùng database local riêng `.wrangler/http-test-state` cho kiểm tra HTTP để tránh khóa SQLite. Production D1 là môi trường riêng. API đọc không ghi lại dữ liệu ở mỗi GET.
- Bộ chuyển vai trò là demo, chưa phải IAM sản xuất. Cấu hình Sites dự kiến riêng tư; chưa có deployment thành công. Trang người nhận hiện được xem trong phiên demo đã đăng nhập, chưa phải cổng công khai.

## Kết quả đóng gói cuối

- TypeScript: qua. Domain: 17/17. Worker HTTP: 10/10. Client bundle check: qua.
- Đã kiểm tra reflow 375/768/1024/1440/1920px ở bản đầu; không tràn ngang toàn trang. Lượt cuối kiểm tra lại desktop 1440 và kho mobile 375px, menu điều hướng bằng bàn phím. Command menu Ctrl+K → tìm DH1029 → Enter hoạt động. Chưa thực hiện kiểm tra zoom 200% độc lập hoặc audit WCAG đầy đủ.
- Sửa lỗi mobile-only theo CSS layers; focus drawer dùng preventScroll để không kéo lệch khung nhìn. Chụp ảnh tại `screenshots/`.
- Regression API đã được tìm nguyên nhân và sửa: request sai Origin được từ chối sau khi đọc body; trước đó việc trả sớm để lại body chưa đọc khiến preview Worker treo request sau. Chuỗi kiểm tra sai Origin → GET tracking → GET API nay qua trên HTTP thực. Không cần fallback HTTP client Windows.
- Xuất bản đang bị chặn ở dịch vụ: `get_site` với ID lưu trong `.openai/hosting.json` trả `SitesConnectorError: Sites project not found` khi tiếp tục phiên. Không có commit source nào được xác nhận push và không có deployment ID. Giữ nguyên identity, không tạo trùng hay đổi sang Site Sapo. Bản local và ZIP source là đầu ra đã xác minh.
- Các kết quả trên không suy ra đã hoàn tất các FR chưa triển khai trong COVERAGE.md.
