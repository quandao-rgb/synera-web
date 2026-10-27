# Dọn source SYNERA — 27/10/2026

Phạm vi: chỉ `C:\SYNERA`; giữ chức năng và hai runtime hiện có. Bản đồng bộ gồm logo chính và nút Đăng xuất đã hoàn thiện trước đó.

## Đã dọn

| Nhóm | Số file | Căn cứ |
| --- | ---: | --- |
| Component UI mẫu, ví dụ D1, hook mobile mẫu và component lỗi connector mẫu | 65 | Rà import/export tĩnh, dynamic import và require bằng TypeScript AST: không có module giữ lại nào tham chiếu tới nhóm này. SYNERA dùng các component riêng trong `components/synera/`, `components/landing/`, `components/brand/`. |
| Ảnh hero cũ `public/assets/landing/synera-overview.jpg` | 1 | Hero hiện dùng `synera-overview-logo.jpg`; cập nhật tài liệu trỏ đúng ảnh hiện tại. |
| `docs/logo-sidebar-desktop.jpg` | 1 | Nội dung SHA-256 trùng hoàn toàn ảnh hero hiện có; tài liệu trỏ trực tiếp tới bản còn lại. |
| Hướng dẫn local cũ `HUONG-DAN-MO-WEB.txt` | 1 | File ignored, trỏ phiên bản/cổng cũ; README và `docs/LANDING.md` là hướng dẫn hiện hành. |
| Cache `tsconfig.tsbuildinfo` | 1 | File tự sinh; kiểm tra kiểu lần này dùng `--incremental false`. |

Tổng 69 file, 999.345 byte trước khi xóa. Bỏ hơn 7.400 dòng component/demo không dùng. Xóa các thư mục chỉ khi đã rỗng; cập nhật eslint để bỏ ngoại lệ cho component đã xóa, bỏ exclude `examples` hết dùng khỏi tsconfig.

Đã sao lưu toàn bộ file bị xóa và phiên bản trước của tài liệu/cấu hình được sửa tại:

`C:\SYNERA-backups\source-cleanup-20261027-085057`

Backup có `cleanup-plan.json` và `backed-up-files.json` liệt kê từng đường dẫn và dung lượng. Backup nằm ngoài repo, không đưa lên GitHub.

## Giữ lại

- `.data/`, database tài khoản, phiên, dữ liệu vận hành, `.env.local` và Git history.
- Mã nghiệp vụ, router/quyền, component SYNERA, logo, đăng nhập/đăng ký/đăng xuất và toàn bộ kiểm thử.
- Worker, D1/Drizzle, migration, scripts của hai runtime, cấu hình chạy và deployment.
- `components.json`, `frontend/lib/utils.ts`, CSS Tailwind và giấy phép stylesheet: hạ tầng registry hiện có vẫn hợp lệ; khi cần cài component, thư mục đích sẽ được công cụ tạo lại.
- Snapshot nguồn Tailark, manifest và giấy phép MIT theo yêu cầu ban đầu; tài liệu phân tích, design system và ảnh kiểm chứng có chủ đích.
- Package/lockfile và dependency cài đặt hiện có. Không thay phiên bản package trong tác vụ dọn file này.

Các bản build dùng để kiểm tra là artifact ignored. Giữ bundle `dist-render/client` đang phục vụ local; dọn artifact Cloudflare và metadata vừa sinh trong lượt kiểm tra, không đưa build/cache vào GitHub.

## Kiểm tra sau dọn

- Rà AST lại: không có import cục bộ không giải được, không còn module thuộc danh sách xóa, không còn ảnh trùng byte trong source.
- `npm.cmd run build:render`: đạt. Bundle trình duyệt giữ cùng hash như trước dọn, không thay UI đang chạy.
- `npm.cmd run build` (Cloudflare/Vinext): đạt; không publish.
- `npm.cmd run check -- --incremental false`: đạt.
- `node --test tests/*.test.mjs`: 47/47 đạt.
- Kiểm tra không có bản ghi nghiệp vụ riêng trong cả hai client bundle: đạt.
- Local `http://localhost:4182/healthz`: hoạt động.
- Rà source trước commit để không đưa database, môi trường, credential hoặc reverse-skill vào GitHub; đồng bộ nhánh `feat/synera-landing-auth`, giữ nguyên `main` đang được Render theo dõi.
