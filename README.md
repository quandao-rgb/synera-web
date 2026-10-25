# SYNERA — Không gian vận hành

Prototype để đánh giá hướng cá nhân hóa từ bản quản trị Sapo sang SYNERA, theo SRS v0.2 và master prompt của người dùng. Đây là repository độc lập chỉ chứa web SYNERA; không bao gồm mã nguồn hoặc lịch sử Git của reverse-skill.

Bản giao diện v0.2 theo yêu cầu mới: khung quản trị gần Sapo với sidebar xanh đậm, header tìm kiếm, nền xám, bảng/form trắng và nút xanh dương. Có màn Xử lý đơn hàng với bốn hàng đợi; tìm nhanh mở mặt hàng/khách kèm bộ lọc; sidebar thu gọn được. Chi tiết tại [ghi chú v0.2](docs/UI-V0.2.md).

## Render

Đã bổ sung profile Node cho Render: `npm run build:render` và `npm run start:render`. Xem [hướng dẫn Render](docs/RENDER.md). Mỗi trình duyệt có dữ liệu minh họa riêng; filesystem gói Free không đảm bảo giữ dữ liệu qua deploy/restart.

## Mở bản demo

- Online: chưa xuất bản. Sites trả về `Sites project not found` khi đọc lại ID đã cấp ở phiên trước. URL dự kiến không phải bằng chứng đã deploy. Giữ nguyên ID trong `.openai/hosting.json` để khôi phục, không đăng ký dự án trùng.
- Local dev: `http://127.0.0.1:4177/`. Lần đầu bấm **Đăng nhập để mở demo** để bật danh tính giả lập loopback của starter Sites. Đây không phải tài khoản Sapo.
- Sau khi cài dependency và tạo database local theo hướng dẫn bên dưới, mở `START-SYNERA.cmd` để chạy; giữ cửa sổ server trong lúc xem.
- Góc phải có bộ chuyển vai trò **Chủ cơ sở / Nhân viên kho** để thử giới hạn dữ liệu. Đây là chức năng trải nghiệm demo; chưa phải quản trị nhân viên sản xuất.
- Dữ liệu lưu D1 riêng theo người dùng Sites. Hãng A/B/C, giá, hồ sơ khách và quy tắc đều minh họa. Không kết nối dịch vụ thật.

## Chạy trên Windows

Yêu cầu Node >=22.13.0. Dùng `npm.cmd` trong PowerShell nếu máy chặn npm.ps1. Không cần Python để chạy website.

```powershell
npm.cmd run install:ci
npm.cmd run db:generate # Chỉ khi sửa db/schema.ts; không tạo lại migration đã có
npm.cmd run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_brief_gertrude_yorkes.sql
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
app/
  interface.jsx          Điều hướng, tải dữ liệu, trạng thái ứng dụng
  views/
    dashboard.jsx        Tổng quan và ba gợi ý
    operations.jsx       Đơn, danh mục, kho, khách, nhắc mua
    order-flow.jsx       Lên đơn, xác nhận kiện, chọn/đặt giao
    management.jsx       Hành trình, hoàn, tài chính, báo cáo, thiết lập
  api/demo/route.ts       Danh tính, phân quyền, CAS, dữ liệu theo người dùng
  synera.css             Tokens, component và responsive theo CSS layers
components/synera/ui.jsx Form, bảng, dialog, badge và các thành phần dùng chung
server/domain.mjs        Dữ liệu giả và các quy tắc nghiệp vụ, chỉ phía server
db/                      Schema và kết nối D1
drizzle/                 Migration SQL và metadata được version hóa
tests/                   Kiểm thử domain và API của Worker build
docs/                    Phân tích, phạm vi, kiểm chứng
design-system/synera/    Quyết định thiết kế theo master prompt + UI/UX Pro Max
public/                  Tài nguyên công khai
scripts/,worker/         Hạ tầng starter Sites/Vinext
.openai/hosting.json     Site ID và binding, không chứa bí mật
```

Không commit `node_modules`, `dist`, `.wrangler`, `.sites-runtime`, file môi trường, cookie hay credential. Các component mẫu khác trong `components/ui`, `examples` và script nền thuộc starter, không phải màn hình nghiệp vụ đã được triển khai.

Đọc [phân tích sản phẩm](docs/PRODUCT-ANALYSIS.md), [phạm vi prototype](docs/COVERAGE.md), [design system](design-system/synera/MASTER.md) và [kiểm chứng](docs/VALIDATION.md).
