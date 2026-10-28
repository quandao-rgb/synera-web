# SYNERA — Không gian vận hành

Prototype độc lập dùng để phát triển và đánh giá trải nghiệm vận hành của SYNERA theo SRS v0.2 và các yêu cầu thiết kế của dự án.

Repository này chỉ chứa mã nguồn web SYNERA và các tài nguyên liên quan đến sản phẩm. Toàn bộ cấu trúc giao diện, luồng nghiệp vụ, thành phần chức năng và định hướng trải nghiệm được phát triển riêng cho SYNERA.

Repository không bao gồm mã nguồn, lịch sử Git hoặc tài nguyên của bất kỳ dự án tham chiếu bên ngoài nào.

## Clone và chạy local trên máy mới

Cài Git và Node.js 24 LTS (tối thiểu Node 22.13). Mở terminal:

```powershell
git clone https://github.com/quandao-rgb/synera-web.git
cd synera-web
npm.cmd ci
npm.cmd run build:render
npm.cmd run dev:local
```

Mở **http://localhost:4182/**. Trên Windows có thể chạy `START-SYNERA.cmd` sau khi cài dependency; file này tự build giao diện rồi khởi động server. Trên macOS/Linux dùng `npm` thay cho `npm.cmd`.

Bản Node/local không cần file môi trường, API key, tài khoản Cloudflare hay database cài riêng. Lần đầu chọn **Đăng ký** để tạo tài khoản của bạn; database và dữ liệu mẫu được tạo tự động trong `.data/`. Tài khoản và dữ liệu ở mỗi máy độc lập; tài khoản trên máy người khác hoặc web online không tự đồng bộ về local.

Để làm việc riêng sau khi clone, chạy `git switch -c feat/ten-cong-viec` trước khi sửa. Không commit `.data/`, file `.env`, dependency hoặc file build.

## Cấu trúc source và chạy local

Giao diện ở `frontend/`, API và nghiệp vụ ở `backend/`. Xem [sơ đồ và quy tắc chỉnh sửa](docs/PROJECT-STRUCTURE.md). Mở `START-SYNERA.cmd` hoặc chạy `npm.cmd run build:render` rồi `npm.cmd run dev:local` để dùng bản Node/local tại `http://localhost:4182/`. Các lệnh Cloudflare bên dưới thuộc profile riêng.

## Landing và tài khoản Node/local

Bản local hiện tại: `http://localhost:4182/`. Landing có Đăng nhập/Đăng ký riêng bằng email và mật khẩu thật; chỉ vào `/#/` khi server đã xác nhận phiên. Giao diện quản trị đang có được giữ nguyên. Tài khoản/workspace lưu tại `.data/accounts.sqlite`; dữ liệu vận hành khởi tạo vẫn là dữ liệu mẫu.

Xem [cách chạy và phạm vi chức năng](docs/LANDING.md), [nguồn Tailark và giấy phép](docs/TAILARK-SOURCES.md), [kết quả kiểm tra và ảnh](docs/LANDING-QA.md). Không thêm dependency. Các hướng dẫn Sites/Cloudflare ở dưới là profile khác, vẫn dùng cơ chế ChatGPT hiện có.
Bản giao diện v0.2 theo yêu cầu mới: khung quản trị gần Sapo với sidebar xanh đậm, header tìm kiếm, nền xám, bảng/form trắng và nút xanh dương. Có màn Xử lý đơn hàng với bốn hàng đợi; tìm nhanh mở mặt hàng/khách kèm bộ lọc; sidebar thu gọn được. Chi tiết tại [ghi chú v0.2](docs/UI-V0.2.md).

## Render

Đã bổ sung profile Node cho Render: `npm run build:render` và `npm run start:render`. Xem [hướng dẫn Render](docs/RENDER.md). Mỗi trình duyệt có dữ liệu minh họa riêng; filesystem gói Free không đảm bảo giữ dữ liệu qua deploy/restart.

## Mở bản demo

- Public trên Render: **https://synera-web-mpdu.onrender.com/**. Landing và trang `/login` chạy cùng backend Node. Chọn Đăng ký để tạo tài khoản dùng thử; tài khoản/workspace online độc lập với local.
- Local dev: `http://127.0.0.1:4177/`. Lần đầu bấm **Đăng nhập để mở demo** để bật danh tính giả lập loopback của starter Sites. Đây không phải tài khoản Sapo.
- `START-SYNERA.cmd` mở profile Node/local tại cổng 4182; profile Cloudflare ở cổng 4177 chạy bằng lệnh riêng bên dưới. Giữ cửa sổ server trong lúc xem.
- Góc phải có bộ chuyển vai trò **Chủ cơ sở / Nhân viên kho** để thử giới hạn dữ liệu. Đây là chức năng trải nghiệm demo; chưa phải quản trị nhân viên sản xuất.
- Dữ liệu lưu D1 riêng theo người dùng Sites. Hãng A/B/C, giá, hồ sơ khách và quy tắc đều minh họa. Không kết nối dịch vụ thật.

## Chạy trên Windows

Yêu cầu Node >=22.13.0. Dùng `npm.cmd` trong PowerShell nếu máy chặn npm.ps1. Không cần Python để chạy website.

```powershell
npm.cmd run install:ci
npm.cmd run db:generate # Chỉ khi sửa backend/db/schema.ts; không tạo lại migration đã có
npm.cmd run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file backend/drizzle/0000_brief_gertrude_yorkes.sql
npm.cmd run dev -- --port 4177 --host 127.0.0.1
```

Chỉ áp migration mới chưa chạy trên database local. Hosted D1 được Sites áp migration khi publish. Không nối database sản xuất vào môi trường test.

```powershell
npm.cmd run check
npm.cmd test
# Kiểm tra HTTP của bản build, tắt dev trước để tránh hai Miniflare cùng mở SQLite local:
$env:XDG_CONFIG_HOME="$PWD/.sites-runtime/xdg"
npm.cmd start -- --port 4178
# Terminal khác, cùng thư mục:
$env:SYNERA_TEST_URL='http://127.0.0.1:4178'
npm.cmd run test:http
```

HTTP check chỉ chấp nhận loopback, mô phỏng header danh tính do Sites cấp và dùng user ID riêng `synera-local-http-test`. Không gửi các header này tới hosted Site. Máy chủ dev Vite phục vụ source để phát triển; kiểm tra chặn đường dẫn source được chạy trên Worker đã build, không coi Vite là môi trường bảo mật sản xuất.

## Thư mục

```text
frontend/               Giao diện, component, CSS, assets, entry React
backend/                HTTP/API, xác thực, nghiệp vụ, DB, migration, worker
shared/                 Hằng số route công khai dùng chung
app/                    Adapter router framework (page/layout/API)
tests/                  Kiểm thử nghiệp vụ, xác thực, ranh giới source
scripts/                Hạ tầng build và lệnh chạy
docs/                   Hướng dẫn, phân tích, kiểm chứng
design-system/synera/   Quyết định thiết kế
.data/                  Tài khoản/workspace local (không commit)
```

Không commit `node_modules`, `dist`, `.wrangler`, `.sites-runtime`, file môi trường, cookie hay credential. Bộ component mẫu không dùng và ví dụ D1 đã được dọn sau khi rà import. Giữ hạ tầng `scripts/`, `worker/`, database/migration và tài liệu nguồn/giấy phép. Xem [biên bản dọn source](docs/SOURCE-CLEANUP.md).

Đọc [phân tích sản phẩm](docs/PRODUCT-ANALYSIS.md), [phạm vi prototype](docs/COVERAGE.md), [design system](design-system/synera/MASTER.md) và [kiểm chứng](docs/VALIDATION.md).
