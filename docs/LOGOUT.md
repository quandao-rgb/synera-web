# Đăng xuất tài khoản

Nút **Đăng xuất** nằm dưới **Thiết lập** ở cuối sidebar, dùng chung cho Chủ cơ sở và Nhân viên kho. Khi sidebar thu gọn, nút giữ biểu tượng và tên truy cập; trên điện thoại nằm trong menu, vùng bấm cao 44 px.

`frontend/app/interface.jsx` gọi callback xác thực từ `frontend/components/landing/SiteEntry.jsx`. Trong lúc gửi, nút bị khóa và hiển thị “Đang đăng xuất…”. Node/local dùng `POST /api/auth/logout` hiện có để thu hồi phiên phía server và xóa cookie. Chỉ khi server xác nhận `authenticated: false` mới chuyển bằng `location.replace('/?auth=login')` về landing và mở form đăng nhập. Bản Cloudflare tiếp tục dùng sign-out ChatGPT với cùng trang đích.

Nếu lỗi mạng/server, ở lại ứng dụng, dùng toast lỗi hiện có và bật lại nút để thử lại. Không thay menu nghiệp vụ, quyền, dữ liệu hoặc tạo cơ chế xác thực mới.

Đã kiểm tra trên bundle local: build:render và check đạt; 8/8 test xác thực đạt. Browser: desktop và mobile đăng xuất về đúng URL, không còn workspace; truy cập lại `/#/` khi đã thoát chỉ hiện form đăng nhập. Ngắt riêng server QA để thử lỗi mạng: ở nguyên `/#/`, thấy thông báo lỗi, có thể bấm lại; khởi động lại QA rồi thử lại thành công. Kiểm tra bằng Enter trên nút, focus về trường email trên form đích. Server chính 4182 được giữ mở; server QA được dừng sau kiểm tra.
