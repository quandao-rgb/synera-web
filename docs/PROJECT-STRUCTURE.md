# Cấu trúc frontend / backend

Mã nguồn SYNERA ở `C:\SYNERA`. Giao diện và nghiệp vụ được chia theo trách nhiệm; vẫn dùng một package.json, một lần cài dependency và cùng origin HTTP như trước.

```text
frontend/
  app/           Màn hình, điều hướng client, CSS, trạng thái giao diện
  components/    Landing, form đăng nhập/đăng ký, sidebar, select, toast, stepper
  render/        Điểm vào React cho Node/local và Render
  public/        Logo, favicon, ảnh được phục vụ công khai
  lib/           Tiện ích giao diện
  vendor/        Nguồn tham khảo và giấy phép giao diện
backend/
  server/        Node HTTP, đăng nhập, phiên, nghiệp vụ, danh mục vận chuyển mẫu
  api/demo/      Handler API Cloudflare
  auth/          Xác thực ChatGPT của profile Cloudflare
  db/            Schema và kết nối D1
  drizzle/       Migration SQL có sẵn
  lib/           Connector phía server
  worker/        Điểm vào Cloudflare
shared/          Hằng số route công khai dùng chung
app/             Ba adapter cho router framework: page, layout, API
scripts/         Lệnh chạy và hạ tầng build
tests/           Kiểm thử nghiệp vụ, HTTP, xác thực và ranh giới import
docs/            Hướng dẫn và kết quả kiểm tra
.data/           Tài khoản/workspace local, không commit
```

## Chỉnh sửa đúng phần

- Chỉnh giao diện trong `frontend/`. Giữ tên field, giá trị trạng thái, ID, payload và API hiện có.
- Quy tắc nghiệp vụ, phân quyền, tồn kho, chuyển trạng thái, phiên và lưu dữ liệu ở `backend/`. Thay đổi những phần này cần kiểm thử tương ứng.
- `shared/` chỉ chứa dữ liệu công khai dùng chung; không chứa secret hoặc dữ liệu người dùng.
- Frontend gọi backend qua API hiện có. Không import trực tiếp source backend vào frontend. Backend cũng không import component giao diện.
- `app/` ở gốc chỉ nối framework với frontend/backend. Không đặt màn hình hoặc nghiệp vụ mới ở đây.
- Một số kiểm tra khả dụng, xếp hạng hiển thị và state form vẫn nằm trong frontend như trước; backend tiếp tục kiểm tra quyền và điều kiện nghiệp vụ khi ghi. Lần tổ chức này không viết lại các thuật toán đó.

`npm test` có bài kiểm tra tự động ngăn import chéo giữa frontend/backend. Việc chia folder không tự ngăn mọi thay đổi sai nghiệp vụ; các bài kiểm thử nghiệp vụ hiện có vẫn cần chạy.

## Chạy local

Nhấp `START-SYNERA.cmd`, hoặc chạy từ thư mục gốc:

```powershell
npm.cmd run build:render
npm.cmd run dev:local
```

Mở `http://localhost:4182/`. Node local chỉ lắng nghe loopback. Tài khoản và workspace tiếp tục dùng `.data/accounts.sqlite` cũ; không đổi nơi lưu, không tạo lại tài khoản. Đăng xuất quay về landing mở biểu mẫu đăng nhập như trước.

## Kiểm tra

```powershell
npm.cmd run check -- --incremental false
npm.cmd test
npm.cmd run build:render
node tests/client-bundle-check.mjs dist-render/client
npm.cmd run build
node tests/client-bundle-check.mjs dist/client
```

Profile Cloudflare tiếp tục dùng `npm run dev` / `npm run build`, D1 và xác thực ChatGPT. `render.yaml` giữ lệnh build/start cũ; `start:render` đã trỏ đến `backend/server/render.mjs`.

Bản sao source trước khi tổ chức: `C:\SYNERA-backups\before-frontend-backend-20261027\source.zip`. Không chuyển dữ liệu riêng tư vào Git.

## Kết quả kiểm tra ngày 27/10/2026

- TypeScript: đạt.
- 50/50 bài kiểm thử đạt (47 bài hiện có và 3 bài kiểm tra ranh giới import).
- Node/Render build và Cloudflare build: đạt; Cloudflare giữ route `/` và `/api/demo`.
- Bundle Node giữ nguyên các tên hash `index-BCPvWTZz.js`, `interface-eJfr7SO2.js`, `index-CIT8XaZl.css` như trước khi chuyển thư mục.
- Kiểm tra bundle của cả hai profile: không chứa bản ghi demo riêng tư.
- So sánh với source trước chuyển: domain, account-auth, shipping-service-catalog, interface và order-flow không đổi nội dung ngoài vị trí file.
- Server local khởi động bằng `scripts/start-local.mjs`; health OK, landing mở và vào được trang Tổng quan bằng phiên đã có, dữ liệu hiện có vẫn hiển thị.
- Không push GitHub hoặc deploy trong lần tổ chức này.
