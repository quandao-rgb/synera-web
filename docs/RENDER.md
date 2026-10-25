# Triển khai SYNERA trên Render

Bản Render dùng cùng giao diện và domain SYNERA. `vite.render.config.mjs` build React thành SPA; `server/render.mjs` phục vụ frontend và API bằng Node.js. Không chạy `wrangler dev` trên máy chủ production, không dùng binding D1 hoặc header đăng nhập Sites cho bản Render.

## Cấu hình

- Runtime: Node, vùng Singapore, gói Free.
- Build: `npm ci --include=dev --no-audit --no-fund && npm run build:render`
- Start: `npm run start:render`
- Health check: `/healthz`
- Node: `24.22.1`; `NODE_ENV=production`.
- Máy chủ lắng nghe `0.0.0.0` và `PORT` do Render cấp.
- Blueprint có sẵn tại `render.yaml`. Không chứa API key hoặc cookie.

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

Vào `http://127.0.0.1:4180/`. Bản Render tạo phiên demo tự động; không cần đường dẫn đăng nhập ChatGPT. Các script `build`, `dev` và `start` cũ vẫn phục vụ profile Sites/Cloudflare.

Nguồn: [Render Web Services](https://render.com/docs/web-services), [gói Free](https://render.com/docs/free), [Blueprint](https://render.com/docs/blueprint-spec).
