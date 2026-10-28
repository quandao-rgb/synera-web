# Triển khai SYNERA trên Render

Bản Render dùng cùng giao diện và domain SYNERA. `vite.render.config.mjs` build React thành SPA; `backend/server/render.mjs` phục vụ frontend và API bằng Node.js. Không chạy `wrangler dev` trên máy chủ production, không dùng binding D1 hoặc header đăng nhập Sites cho bản Render.

## Cấu hình

- Runtime: Node, vùng Singapore, gói Free.
- Build: `npm ci --include=dev --no-audit --no-fund && npm run build:render`
- Start: `npm run start:render`
- Health check: `/healthz`
- Node: `24.22.1`; `NODE_ENV=production`.
- Máy chủ lắng nghe `0.0.0.0` và `PORT` do Render cấp.
- Blueprint có sẵn tại `render.yaml`. Không chứa API key hoặc cookie.

## Truy cập public và tài khoản

Link: **https://synera-web-mpdu.onrender.com/**. Repository GitHub public là nguồn code; Render phục vụ cả frontend và backend. Chưa gắn synera.com vì chủ dự án chưa có quyền quản lý DNS của tên miền.

Landing cho đăng ký/đăng nhập email và mật khẩu. Server lưu password hash và phiên HttpOnly trong SQLite `.data/accounts.sqlite`; workspace theo từng tài khoản. Chỉ chuyển vào `/#/` sau khi client xác minh phiên. Tài khoản online không tự dùng chung với tài khoản local.

## Dữ liệu và phiên demo

Mỗi trình duyệt nhận một session ID ngẫu nhiên 256-bit trong cookie HttpOnly/SameSite=Lax, Secure trên Render. API không tin các header danh tính do trình duyệt gửi. Vai trò chủ/kho là bộ chuyển trải nghiệm demo, không phải IAM sản xuất. Mọi dữ liệu đều giả lập; không nhập dữ liệu kinh doanh thật vào bản demo công khai.

State lưu phía server tại `.data/`, không nằm trong assets và không commit Git. Ghi nguyên tử và kiểm soát version tránh hai cập nhật ghi đè nhau. Kho vẫn chỉ nhận projection cho phép, không có tiền hàng, COD hoặc công nợ. Trang người nhận trong bản này thuộc phiên demo đang mở, chưa phải cổng theo dõi chia sẻ công khai độc lập.

Render Free dùng filesystem tạm: dữ liệu có thể mất khi deploy, restart hoặc spin down. Không có disk trả phí hay database trả phí được tạo. Để vận hành thật cần storage bền vững, membership nhân viên và cấu hình backup riêng. Kiến trúc này phục vụ trình diễn, không chốt D27.

## Kiểm tra local

```powershell
npm.cmd ci --include=dev
npm.cmd run build:render
npm.cmd run test:render
node tests/client-bundle-check.mjs dist-render/client
$env:PORT='4180'
npm.cmd run start:render
```

Lệnh start:render bật cookie Secure khi NODE_ENV=production. Để kiểm tra đăng nhập qua HTTP loopback, dùng npm.cmd run dev:local (cổng mặc định 4182); script local tắt Secure riêng cho loopback. Bản Render public dùng HTTPS và không cần đăng nhập ChatGPT. Các script `build`, `dev` và `start` cũ vẫn phục vụ profile Sites/Cloudflare.

Nguồn: [Render Web Services](https://render.com/docs/web-services), [gói Free](https://render.com/docs/free), [Blueprint](https://render.com/docs/blueprint-spec).
