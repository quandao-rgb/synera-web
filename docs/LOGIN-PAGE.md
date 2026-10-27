# Trang đăng nhập riêng của SYNERA

Nút **Đăng nhập** trên landing mở `/login` bằng điều hướng trang thật, thay cho modal đăng nhập. Có thể mở trực tiếp hoặc tải lại `/login` và `/login/` trên Node/local; Cloudflare có route adapter riêng tại `app/login/page.tsx`.

## Hành vi

- Dùng lại `LoginForm`, API và bước kiểm tra cookie/session hiện có trong `AuthDialog.jsx`. Chỉ chuyển đến `/#/` sau khi server xác nhận cùng tài khoản và đúng home route.
- Form thiếu dữ liệu dùng validation native. Sai thông tin hoặc lỗi mạng giữ nguyên trang, giữ dữ liệu form và đưa focus đến thông báo lỗi có `role="alert"`.
- Nút hiện/ẩn mật khẩu có tên truy cập và `aria-pressed`; hỗ trợ Tab, Space và Enter.
- Phiên hợp lệ khi vào `/login` đưa về trang chủ hiện có. Người chưa đăng nhập mở route ứng dụng được chuyển đến `/login`; route theo dõi người nhận giữ nguyên.
- Link cũ `/?auth=login` và luồng đăng xuất cũ vẫn tương thích, chuyển tiếp đến trang đăng nhập mới.
- Đăng ký vẫn dùng modal sẵn có trên landing; link `/?auth=register` mở đúng form. Đăng ký thành công vẫn tạo phiên và vào `/#/`.
- Bản Cloudflare dùng nút đăng nhập ChatGPT hiện có, không gọi API email/mật khẩu của Node.
- Không thêm nút quên mật khẩu, đăng nhập mạng xã hội hay cam kết chưa có backend thực hiện.
- Không thay đổi bộ máy nghiệp vụ, phân quyền, session storage, seed dữ liệu hoặc màn hình quản trị.

## Thiết kế và nguồn tham khảo

Tham khảo luồng website → trang đăng nhập riêng của [Sapo](https://www.sapo.vn/dang-nhap-kenh-ban-hang.html) và khung tài khoản tập trung tại [Sapo Accounts](https://accounts.sapo.vn/login). Không sử dụng logo, ảnh hoặc thông tin tài khoản Sapo.

Áp dụng `design-taste-frontend` trong phạm vi component xác thực hiện có: giữ Segoe UI và bảng màu trắng/xám/xanh/navy của SYNERA. Bố cục form 400px trên nền trắng, một ảnh kho thật ở cột bên phải, không gradient hoặc glass trên trang đăng nhập. Trang landing và video đã merge của cộng tác viên giữ nguyên.

Ảnh: **Boxes on Shelves inside a Warehouse**, **Maor Attias**, [Pexels source](https://www.pexels.com/photo/boxes-on-shelves-inside-a-warehouse-5156696/), [Pexels License](https://www.pexels.com/license/). Tải bản 1000×1500px về `frontend/public/assets/login/warehouse-maor-attias.jpg`, phục vụ cùng origin. Credit có link nằm dưới ảnh. Ảnh thể hiện bối cảnh kho hàng, không đại diện cho cơ sở thuộc SYNERA hay ngụ ý bên chụp xác nhận sản phẩm.

## Kiểm tra

- `npm test`: **51/51 đạt**, gồm kiểm tra route mới, HEAD, cache, đường dẫn không hợp lệ và chặn source riêng tư.
- `npm run check -- --incremental false`: đạt.
- `npm run build:render` và `npm run build`: đạt, Cloudflare liệt kê `/login`.
- Client bundle privacy check: đạt ở cả hai profile.
- Lint thiết kế trên component/CSS mới: **0 FAIL, 0 WARN**.
- Kiểm tra bằng công cụ trình duyệt tại **1440×900**, **768×1024**, **390×844**: không overflow ngang; h1 một dòng; form 50px và nút hiện mật khẩu 44px. Ảnh ẩn trên tablet/phone để ưu tiên đăng nhập.
- Đã thử trên Node preview: landing → login → refresh, validation trống, thông tin sai, hiện/ẩn mật khẩu, Tab/Space, Enter để đăng nhập đúng, về Tổng quan, đăng xuất, đăng ký và tự vào ứng dụng, phiên có sẵn quay về home.
- Reduced motion: CSS mới tắt transition/animation trong media query; trang không có animation xuất hiện hoặc ảnh chuyển động. Không giả lập hệ điều hành để tuyên bố đã kiểm thử media preference thực tế.
- Không chạy `inspect.mjs` vì kiểm tra trình duyệt phải dùng công cụ CUA của phiên này; dùng ảnh và phép đo DOM trực tiếp ở ba kích thước thay thế.

Đánh giá sau khi xem ảnh: form là trọng tâm, ảnh và khoảng trắng cân bằng; không thêm nội dung quảng cáo, số liệu hay tính năng giả. Phần hỗ trợ dùng liên hệ đã được chủ dự án cung cấp. Màn hình không có dữ liệu nghiệp vụ mẫu mới.

![Desktop](login-desktop.png)

![Mobile](login-mobile.png)

## Chạy thử

```powershell
git fetch origin
git switch --track origin/feat/dedicated-login-page
npm.cmd ci
npm.cmd run build:render
npm.cmd run dev:local
```

Mở `http://localhost:4182/login`. Bản xem thử riêng trong phiên làm việc dùng `http://127.0.0.1:4186/login` và database QA riêng; không chia sẻ cookie với `localhost`.
