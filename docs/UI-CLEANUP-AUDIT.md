# Rà soát frontend SYNERA — 26/10/2026

## Phạm vi đã chốt

Dọn toàn bộ frontend tại `C:\SYNERA`: bỏ nội dung thừa và nhãn demo/prototype khỏi giao diện; giữ dữ liệu mẫu và cơ chế lưu hiện tại. Chuyển vai trò và đặt lại dữ liệu nằm trong Thiết lập. Giữ bố cục Sapo, màu trắng/xám/xanh dương/xanh đậm, chức năng SYNERA và phản hồi GSAP.

Đã đọc router hash trong `app/interface.jsx`, bốn module view, các thành phần dùng chung, hai điểm vào Render/Sites và các luồng form/dialog. Không dùng riêng sidebar làm danh mục màn hình.

## Danh mục đầy đủ

Có **21 mục đường dẫn** gồm cả alias của phân hệ xử lý đơn, cộng **1 màn fallback**. Route động được tính theo mẫu, không theo số bản ghi. Tất cả đã được rà; mọi màn nhận thay đổi từ khung chung và typography.

| Đường dẫn | Câu hỏi màn hình cần trả lời | Phần được dọn |
| --- | --- | --- |
| `/` | Việc nào cần xử lý trước? | Bỏ chào mừng, ngày cố định, footer và giải thích lặp; giữ số liệu, đơn, tồn kho, việc cần làm và gợi ý có căn cứ |
| `/orders` | Đơn nào cần tìm và xử lý? | Tiêu đề, tab, tìm kiếm, bảng, căn số và trạng thái |
| `/orders/new` | Xác nhận đơn với khách và hàng nào? | Bỏ nhãn bước/metadata; giữ form, COD, báo giá sơ bộ và cảnh báo xác nhận kiện |
| `/orders/:id` | Đơn đang ở bước nào và thao tác tiếp theo là gì? | Bỏ nhãn phụ thừa; giữ khách/ngày, kiện, quyền, giá, xác nhận và hành trình |
| `/packing` | Các đơn chờ đóng kiện là đơn nào? | Bỏ đánh số và mũi tên trang trí; giữ bộ đếm và hành động |
| `/packing/packing` | Đơn nào chờ kiểm tra kiện? | Như trên |
| `/packing/ready` | Đơn nào chờ chọn giao? | Như trên, giữ quyền đặt giao |
| `/packing/booked` | Đơn nào chờ bàn giao? | Bảng và trạng thái rỗng |
| `/packing/verification` | Yêu cầu đặt giao nào chưa rõ kết quả? | Giữ cảnh báo kiểm tra vận đơn trước khi gửi lại |
| `/products` | Hàng có quy cách và tồn khả dụng thế nào? | Bỏ hình kiện trang trí, banner hướng dẫn; giữ tên/SKU, quy cách, đặc tính và giá theo quyền |
| `/inventory` | Tồn thực, hàng giữ và hàng về đang thế nào? | Bỏ công thức minh họa cố định; giữ các tab, số liệu và thao tác kho |
| `/customers` | Cần liên hệ khách nào và kết quả ra sao? | Bỏ banner giải thích; giữ liên hệ, chu kỳ, lọc và ghi kết quả |
| `/repeat` | Khách nào đến kỳ liên hệ? | Đồng nhất tiêu đề, bỏ chữ “mẫu” và hướng dẫn lặp |
| `/suggestions` | Quyết định nào cần xem căn cứ? | Bỏ số 01/02/03 và đoạn giải thích chung; giữ dữ liệu tính từ kho/khách/đơn và liên kết |
| `/shipments` | Đơn giao nào đang cần theo dõi? | Bỏ mô tả và banner thường trực; giữ bảng và trạng thái |
| `/carriers` | Dịch vụ nào phù hợp và căn cứ là gì? | Bỏ avatar trang trí; giữ điều kiện, mẫu số, kỳ và nguồn chưa xác minh |
| `/returns` | Hàng hoàn nào đã nhận thực tế? | Bỏ mô tả đầu trang; giữ xác nhận nhận hoàn, cách ly và cảnh báo đối soát tiền |
| `/finance` | Phải thu, COD và tiền về hiện bao nhiêu? | Bỏ hai thẻ giải thích tính năng/gói chưa chốt; giữ số liệu và bảng công nợ |
| `/reports` | Phân bố đơn và bằng chứng giao nhận ra sao? | Bỏ tỷ lệ 80% viết cố định; giữ tỷ lệ do Evidence tính từ dữ liệu và nhật ký |
| `/settings` | Vai trò, quyền kho và dữ liệu được quản lý thế nào? | Gom chuyển vai trò/đặt lại, bỏ danh sách quyết định dự án, metadata và trạng thái thử nghiệm |
| `/track/:token` | Hành trình đơn hàng và người nhận là gì? | Bỏ nhãn môi trường, slogan, footer; giữ trạng thái, liên hệ đã che và hành trình |
| Fallback | Đường dẫn không tồn tại thì làm gì? | Một h1, thông báo lỗi và hành động quay về |

Không có màn nào giữ nguyên hoàn toàn về hình thức vì khung chung đã thay đổi. Các trạng thái lỗi, quyền, validation, loading và xác nhận được giữ về chức năng; chỉ dọn nhãn và đồng nhất trình bày.

## Tab, biến thể và luồng đã rà

- Tổng quan: Cần xử lý/Tất cả. Danh sách đơn: toàn bộ 5 tab, tìm kiếm, sắp xếp và không có kết quả.
- Kho: Tồn kho/Hàng đang về/Kiểm kê & điều chỉnh; kế hoạch mới, nhận một phần, nhận đủ, yêu cầu chờ duyệt/đã duyệt và trạng thái rỗng.
- Khách hàng/Nhắc mua lại: tất cả/chưa liên hệ, ghi kết quả và lọc sau khi lưu.
- Chi tiết đơn: packing, ready, verification, booked, transit, delivered, returning, returned, cancelled và mã không tồn tại. Các trạng thái thiếu từ bộ khởi tạo được tạo bằng thao tác UI trong phiên local.
- Theo dõi: có dữ liệu, đang tải, token không hợp lệ và liên kết bị thu hồi.
- Tạo đơn: chưa chọn khách, báo giá đang tải, báo giá hợp lệ/không phù hợp, lỗi số lượng và tạo thành công.
- Dialog: lập kế hoạch, nhận hàng, gửi kiểm kê, duyệt điều chỉnh, ghi liên hệ, nhận hoàn, đổi quyền kho, đặt lại, xác nhận kiện chuẩn, chỉnh kiện khác chuẩn, hủy đơn, đặt giao, bàn giao và thu hồi liên kết.
- Tìm nhanh: kết quả/không có kết quả, bàn phím/Escape. Menu điện thoại: mở/đóng, khóa cuộn, Tab giữ trong menu và trả focus về nút mở.
- Vai trò kho: rà 16 đường dẫn; 7 màn dành cho chủ cơ sở vẫn trả màn giới hạn quyền. Tiền hàng/COD không xuất hiện. Quyền đặt giao tắt vẫn có thông báo chờ người được cấp quyền.
- Trạng thái khởi động: loading, lỗi tải dữ liệu, thử lại thành công và điểm vào đăng nhập được kiểm tra bằng proxy lỗi local riêng; không sửa API ứng dụng để tạo lỗi.

Có **55 bản ghi kiểm tra tương tác** trong nhật ký local, ngoài các lượt đi qua route và kiểm tra phản hồi khởi động. Đây là số lần kiểm tra, không phải 55 đường dẫn khác nhau.

## Thành phần dùng chung và code thừa

- `Interface`/khung ứng dụng: gỡ badge, caption, footer và hộp giới thiệu prototype; header chỉ giữ điều hướng, tìm kiếm và phạm vi vai trò có dữ liệu.
- `PageHead`: bỏ eyebrow và các mô tả hiển nhiên tại nơi gọi; chỉ giữ dòng khách/ngày của chi tiết đơn vì đó là dữ liệu nghiệp vụ. Không tạo wrapper hành động rỗng.
- `Empty`/`Forbidden`: bỏ icon trang trí, giữ thông báo/hành động và dùng h1 khi là toàn màn.
- `Table`: cột số căn phải với tabular figures; tiêu đề và giá trị thẳng hàng; glyph sắp xếp chỉ xuất hiện ở cột đang sắp xếp.
- `Modal`, `Evidence`, `Timeline`: gỡ tag và props không dùng; làm sạch nhãn môi trường khi trình bày, không sửa bản ghi nguồn.
- `MotionShell`: giữ sidebar, chỉ báo điều hướng, menu và nút; bỏ hiệu ứng vào trang trên các khối dữ liệu vận hành. Nền điều hướng dùng màu phẳng.
- Xóa wrapper/import thừa và selector của phần bị gỡ. Rà thêm được 17 tên lớp không còn xuất hiện trong source UI có thể truy cập; xóa các selector tương ứng.
- Không thêm thẻ thay thế để lấp chỗ trống. Không gỡ thư viện component chưa dùng hoặc tài liệu nội bộ ngoài phạm vi màn hình.

## Những phần cố ý giữ

- Số liệu tính từ dữ liệu hiện có, gợi ý bổ sung/nhắc mua/so sánh vận chuyển, nguồn và cảnh báo chưa đủ bằng chứng: phục vụ quyết định nghiệp vụ.
- Trạng thái kho, giao nhận, ngoại lệ timeout, loading, lỗi, thành công, disabled và xác nhận thao tác: phản hồi hệ thống cần thiết.
- Tùy chọn kiểm tra timeout trong disclosure đặt giao: giữ đường đi hiện có đến nhánh xác minh; không đổi state hay payload của form.
- Menu xanh đậm và nút xanh dương: ràng buộc thương hiệu/bố cục Sapo đã được người dùng chốt, ưu tiên hơn khuyến nghị sidebar trung tính của skill.
- URL, token mẫu, tên endpoint và metadata trong tài liệu/package: thuộc contract hoặc công cụ phát triển; không còn là nhãn trang trí trên UI.
- Bộ dữ liệu mẫu trong `server/domain.mjs` và lưu phiên Render: người dùng đã xác nhận giữ nguyên. Đây không phải thay đổi backend sản xuất.

## Kiểm tra và nhận xét cuối

Đối chiếu `design-taste-frontend`, nhánh app screens; sheet **Accent ladder**, seed **4977123**, giữ palette/type và khung Sapo đã có. Không thêm ảnh, chart library hoặc phụ thuộc mới.

Đã chạy ít nhất hai lượt qua toàn bộ danh mục. Lượt cuối có **28 trường hợp route × 3 kích thước = 84 kiểm tra**, tại 1440×900, 768×1024 và 390×844: mỗi trang có một h1; không phát hiện tràn ngang trang, chữ hiển thị dưới 11px hoặc các nhãn demo/prototype/minh họa được rà. Có DOM snapshot và ảnh toàn trang, cùng ảnh tổng hợp từng nhóm.

Rà trình duyệt bằng CUA; không chạy `inspect.mjs`, vì vậy không công bố điểm hoặc kết quả inspector chưa đo. Lint source app: **0 FAIL, 5 WARN**; năm cảnh báo là khai báo `box-shadow: none` và bóng khi hover, không phải bóng thẻ tĩnh. Không thêm ngoại lệ để giấu lỗi.

Các kiểm tra đã qua: build Render, TypeScript, 17 kiểm tra domain, 4 kiểm tra HTTP/phiên Render, kiểm tra bundle không chứa bản ghi mẫu riêng tư, và Git diff whitespace.

Nhận xét theo rubric app: đơn/kho/thao tác là trọng tâm; cạnh và khoảng đệm nhất quán; không thay số liệu để làm đẹp; cột tiền/số lượng căn phải; trạng thái rỗng/không đủ bằng chứng vẫn rõ; sidebar gập trên điện thoại. Danh sách có nhiều trường trên điện thoại vẫn cần cuộn dọc để giữ đủ thông tin. Không chấm điểm thẩm mỹ giả định.

Không phát hiện route ứng dụng nào bị bỏ qua. Trang đăng nhập do nhà cung cấp Sites/ChatGPT quản lý không nằm trong source này; chỉ điểm vào và nhánh yêu cầu đăng nhập của frontend được rà. Không chạy lại triển khai Cloudflare/Sites cũ; bản được kiểm tra và cập nhật là profile Render dùng cùng frontend.

## File thay đổi

`app/interface.jsx`, `app/views/dashboard.jsx`, `app/views/operations.jsx`, `app/views/management.jsx`, `app/views/order-flow.jsx`, `components/synera/ui.jsx`, `components/synera/motion.jsx`, `app/synera.css`, `app/admin-layout.css`, `app/motion.css`, `app/layout.tsx`, `render/index.html`, `docs/MOTION.md`, `docs/UI-CLEANUP-AUDIT.md`.

Không sửa `server/`, route API, database, test nghiệp vụ, package/dependency, cấu hình auth hoặc quyền máy chủ. Dữ liệu dùng để kiểm tra tương tác chỉ nằm trong phiên local và đã được đặt lại sau khi kiểm tra.
