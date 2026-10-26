# Landing page SYNERA — local

## Xem và chạy

Source tại `C:\SYNERA`, nhánh `feat/synera-landing-auth`. Landing: `http://localhost:4182/`; trang chủ ứng dụng đã có: `http://localhost:4182/#/`.

Node/npm hiện có; không thêm dependency và không đổi lockfile.

```powershell
cd C:\SYNERA
npm.cmd run build:render
$env:PORT = '4182'
$env:SYNERA_PUBLIC_ORIGIN = 'http://localhost:4182'
npm.cmd run start:render
```

Nếu bản xem trước đang chạy, dừng đúng tiến trình đang giữ cổng 4182 trước khi khởi động một bản khác. `SYNERA_PUBLIC_ORIGIN` phải khớp origin thực tế của trình duyệt (kể cả cổng).

## File thay đổi

- `components/landing/`: bảy khối Tailark đã chuyển thành JSX; `ProductPreview.jsx`, `landing-data.mjs`, `LandingPage.jsx`, `AuthDialog.jsx`, `SiteEntry.jsx`.
- `app/landing.css`: toàn bộ CSS giới hạn trong `.synera-landing`; một lớp loading riêng. `html:has(.synera-landing)` chỉ điều chỉnh khoảng neo khi landing hiện diện.
- `render/main.jsx`, `app/page.tsx`, `app/layout.tsx`: nối entry và nạp CSS landing. Render/Node dùng email/mật khẩu; bản Cloudflare giữ cơ chế ChatGPT hiện có.
- `lib/app-routes.mjs`: route trang chủ `/#/`, lấy từ hash router hiện có.
- `server/account-auth.mjs`, `server/render.mjs`: tài khoản, phiên, lưu workspace theo tài khoản và bốn endpoint xác thực.
- `public/assets/landing/synera-overview.jpg`: ảnh thật của giao diện SYNERA được khôi phục, chứa dữ liệu mẫu.
- `tests/auth.test.mjs`: kiểm thử xác thực qua HTTP và kho lưu tài khoản.
- `vendor/tailark/`: đầy đủ bản gốc 7 block và dependency nội bộ, manifest nguồn và giấy phép MIT. Mã gốc giữ dưới đuôi `.source.txt` để không lọt vào compilation của ứng dụng.
- Tài liệu nguồn: [TAILARK-SOURCES.md](TAILARK-SOURCES.md). Kiểm tra giao diện: [LANDING-QA.md](LANDING-QA.md).

`app/interface.jsx`, CSS quản trị, menu, router, logic nghiệp vụ, quyền chủ/kho và các screen quản trị không đổi. Package/lockfile không đổi. Không push GitHub hoặc deploy Render.

## Chức năng đã nối thật

- Hai biểu mẫu riêng Đăng nhập / Đăng ký, mở từ các nút tài khoản; CTA đăng ký dùng cùng biểu mẫu.
- `POST /api/auth/register`: kiểm tra đầu vào, email trùng, mật khẩu nhập lại; tạo tài khoản + workspace + phiên trong một transaction.
- `POST /api/auth/login`: kiểm tra mật khẩu và cấp token phiên mới.
- `GET /api/auth/session`: xác minh cookie phía server; client kiểm tra lại phiên và đúng user trước khi chuyển về `/#/`.
- `POST /api/auth/logout`: thu hồi token phía server, xóa cookie. Lỗi không giả lập thành công hoặc chuyển trang.
- SQLite `.data/accounts.sqlite` lưu tài khoản, workspace, hash token và hạn phiên. Mật khẩu băm scrypt với salt riêng, `N=32768,r=8,p=3`; tham số được ghi cùng hash. Không lưu mật khẩu thô. Tham khảo [Node crypto](https://nodejs.org/api/crypto.html) và [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt).
- Cookie `synera_session`: HttpOnly, SameSite=Lax, thời hạn 7 ngày; Secure khi cấu hình production/Render. Auth POST yêu cầu JSON và Origin đúng, giới hạn kích thước và số lần thử.
- Workspace của mỗi tài khoản riêng biệt, bền qua lần khởi động server. API nghiệp vụ và phép kiểm tra version/quyền cũ được tái sử dụng. Cookie demo cũ vẫn được hỗ trợ để không làm mất phiên/dữ liệu demo có sẵn; route người nhận `#/track/...` giữ các kiểm tra token/session cũ.
- Liên hệ Pro: mở trình soạn email tới `synera.suz26@gmail.com`; footer có `tel:+84345666888`. Không tự gửi email hay gọi điện.

## Demo và phần chưa triển khai

- Landing dùng dữ liệu minh họa tập trung tại `landing-data.mjs`, không gửi các thao tác tab/bước minh họa vào API vận hành. Một đơn `DH-MH03`, ba thùng nước, 37,5 kg; tiền hàng 288.000 ₫; ba mốc cước 137.000/137.000/139.000 ₫, chênh lệch 2.000 ₫. Số bổ sung tính từ tồn/giữ/đang về, không cộng trừ tùy ý.
- Tài khoản và phiên là thật; dữ liệu nghiệp vụ khởi tạo vẫn là bộ dữ liệu mẫu của ứng dụng hiện có. Không kết nối hãng vận chuyển thật, không đặt vận đơn, thanh toán hay mua gói thật.
- Chọn vai trò trong ứng dụng vẫn là cơ chế mô phỏng chủ/kho sẵn có, chưa phải hệ thống mời nhân viên và quản lý thành viên của doanh nghiệp.
- Email ở đây là định danh đăng nhập; chưa có xác minh hộp thư, quên mật khẩu, SMTP, MFA hay quản trị vòng đời tài khoản. Không thêm nút giả cho các chức năng này.
- Giá chính thức/chính sách chưa có: Pro dùng “Liên hệ tư vấn”, cước vận chuyển tính riêng; không thêm điều khoản, khách hàng, review hoặc số liệu quảng cáo giả.
- Tài khoản email/mật khẩu chỉ ở runtime Node/local theo lựa chọn đã xác nhận. Cloudflare tiếp tục ChatGPT; chưa chia sẻ database tài khoản giữa hai runtime.
- Khi triển khai sau này cần nơi lưu SQLite bền vững và quy trình sao lưu DB nhất quán (bao gồm WAL khi đang chạy); `.data/` đã được gitignore. Không xóa `.data` để rebuild giao diện.

## Kiểm tra

```powershell
npm.cmd run check
node --test tests/*.test.mjs
npm.cmd run build:render
```

Toàn bộ 47 kiểm thử đã qua, gồm đăng ký, đăng nhập sai/đúng, email trùng, phiên, logout, restart, cách ly workspace, stale version, quyền kho, CSRF, lỗi JSON, giới hạn body/rate và toàn bộ hồi quy nghiệp vụ cũ. Chi tiết browser ở LANDING-QA.md.
