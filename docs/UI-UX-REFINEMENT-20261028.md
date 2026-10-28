# Tinh chỉnh giao diện và bổ sung danh mục — 28/10/2026

## Thay đổi theo góp ý

- Bỏ toàn bộ nền/viền/chấm của nhãn trạng thái; giữ nhãn chữ và màu đủ rõ trên trắng. Thao tác trong bảng dùng link và mũi tên; các CTA tạo/lưu/xác nhận vẫn là nút.
- Bỏ khung số liệu, count của tab/việc cần làm và ô khả dụng. Màn xử lý dùng lựa chọn có gạch chân. Counter hữu hạn tham khảo Count Up; khối bằng chứng báo cáo có phản hồi con trỏ tham khảo Spotlight Card của React Bits, thích ứng với GSAP đang có.
- Thẻ cơ sở rút còn tên và dấu mở. Đưa ảnh người dùng cung cấp vào chi tiết cơ sở và cột báo cáo. Báo cáo dùng nội dung + ảnh để cân bố cục; không thêm số liệu hoặc kết quả giả.
- Tăng phân biệt header bảng xanh nhạt với các hàng trắng, giữ tên chính rõ hơn phần liên hệ phía dưới. Áp dụng trên các bảng hiện có.
- Sửa hai lớp focus tìm kiếm: chỉ wrapper vẽ viền, input không có viền/outline/shadow riêng. Bộ lọc giữ dữ liệu thật.
- Quản lý kho có hình riêng cho sáu mặt hàng mẫu; ảnh của mặt hàng mới được tải và lưu cùng bản ghi. Rút gọn các đoạn giải thích lặp ở tạo đơn/kho, giữ ý nghĩa giá tham khảo và các xác nhận riêng.

## Hai chức năng mới được người dùng yêu cầu

`product-create`: chủ cơ sở thêm tên, SKU, nhóm hàng, tồn đầu kỳ, giá và quy cách một thùng. Ảnh JPG/PNG/WebP tùy chọn được tối ưu trong trình duyệt xuống tối đa 320px và data URI không quá 70.000 ký tự, vừa giới hạn request hiện có. Server chỉ chấp nhận raster inline, kiểm tra MIME/chữ ký định dạng và kích thước, không tải URL ngoài. SKU không trùng; ID do server cấp; không cho payload ghi đè số giữ/cách ly/đang về hoặc ID. Tồn đầu kỳ là trường nhập rõ ràng cho mặt hàng mới.

`customer-create`: chủ cơ sở thêm tên khách/cửa hàng, người liên hệ, điện thoại, địa chỉ, vùng giao và ghi chú tùy chọn (hỗ trợ xuống dòng). Chuẩn hóa số điện thoại và chặn trùng. Khách mới có lịch sử mua chưa có, không tạo đơn hoặc công nợ giả. Có nút ở danh mục và ngay trong tạo đơn; sau lưu, khách được chọn, nội dung đơn đang nhập giữ nguyên. Select được tạo lại riêng khi thêm lựa chọn mới để tránh native option registry của Radix xóa giá trị vừa chọn; thao tác chọn khách cũ không bị thay đổi.

Hai action đi qua session, version/CAS, audit, lưu trữ và kiểm tra quyền hiện có tại `/api/demo`. Không đổi endpoint, schema, dependency, cấu hình hoặc reset dữ liệu. Nhân viên kho bị từ chối hai action và tiếp tục không nhận giá bán, COD, công nợ hay trường tài chính.

## Bằng chứng và kiểm tra

- `npm test`: 57/57 đạt, không skip; gồm 50 bài cũ và 7 bài bổ sung cho danh mục. Bao phủ input sai, SKU/điện thoại trùng, ảnh không hợp lệ, quyền kho, không sửa bản ghi cũ, dùng mặt hàng/khách mới tạo đơn, xung đột version, cách ly tài khoản và tồn tại sau khi restart server.
- `npm run check -- --incremental false`, `npm run build:render`, kiểm tra client bundle và `git diff --check`: đạt.
- 58 lượt render desktop/mobile trên toàn bộ tuyến/trạng thái hiện có: không tràn ngang, ảnh lỗi hoặc exception JavaScript. Rà lại ảnh Tổng quan, đơn, xử lý, kho, khách, báo cáo, settings và các phiên bản mobile.
- Kiểm tra thao tác trình duyệt trên server QA/database riêng cổng 4183: thêm sản phẩm có upload ảnh → kiểm tra tồn → tải lại vẫn có ảnh; tìm tên lọc đúng một hàng và chỉ có một lớp focus; thêm khách ở danh mục; thêm khách ngay trong đơn và tự chọn; chọn sản phẩm mới → tạo đơn ở trạng thái packing và giữ tồn đúng số lượng.
- Form thêm sản phẩm vừa viewport điện thoại, scroll trong dialog, Escape đóng được. Báo cáo không tràn ở 320/390/768/1440px; reduced-motion tắt chuyển động bổ sung.
- Impeccable static detector cho CSS/component mới: không finding. Taste browser inspector cho kho/báo cáo không có FAIL; đơn vị kho được chỉnh đậm sau cảnh báo tương phản. Cảnh báo so chiều cao ở báo cáo so panel trái với riêng panel bằng chứng, không tính ảnh ngay dưới panel phải; đã xem render và giữ stack nội dung + ảnh để cân cả cột, không kéo dài vùng trắng.
- Đối chiếu diff `backend/server/domain.mjs`: chỉ thêm import/helper cho hai action, hai nhánh tạo mới sau kiểm tra quyền và trường ảnh tùy chọn trong projection. Các nhánh đặt đơn/đóng kiện/đặt giao/kiểm tra/bàn giao/hoàn và công thức kho cũ không sửa. Auth, API transport, schema và các test cũ giữ nguyên.
- Kiểm tra bảo toàn source xác nhận 59 file được bảo vệ (backend còn lại, shared, scripts/config, thuật toán và test cũ) khớp SHA256 mốc trước. Khi bỏ đúng ba phần bổ sung kể trên, nội dung domain khớp nguyên bản đầu đợt. Taste kiểm tra lại kho sau chỉnh tương phản đạt 0 FAIL/0 WARN tại 1440/768/390px.

QA dùng tài khoản riêng trong `.sites-runtime/ui-ux-qa/data/`, không dùng `.data/` người dùng. Artifact tại `.sites-runtime/ui-refine-20261028/` được Git bỏ qua, gồm snapshot mã trước đợt này, ảnh render, báo cáo và script kiểm tra. Kiểm tra viewport giả lập trên Chrome headless, không phải audit WCAG đầy đủ hoặc kiểm thử thiết bị vật lý.

Nhánh local: `feat/ui-ux-redesign`; chưa commit/push/merge. Localhost dành cho người dùng tiếp tục ở `http://localhost:4182/#/`.

## Lượt phản hồi tiếp theo qua 8 ảnh chụp màn hình

Đổi canvas sang #F6F6F6 với ba kênh RGB bằng nhau, thêm shadow rất nhẹ cho khối trắng, làm sáng/chọn màu bão hòa hơn cho trạng thái và kết quả liên hệ; chờ bàn giao chuyển tím, theo dõi thêm dùng cyan. Không đổi màu nền sidebar hoặc đóng khung trạng thái trở lại.

Mở rộng trạng thái đơn trong báo cáo, thu cột bên phải còn 312px trên desktop. Khối 80% còn tỷ lệ + nhãn cùng hàng, một dòng “8/10 đơn · 2 quá hạn”; nhóm, thời kỳ, nguồn và trạng thái chưa xác minh chuyển vào “Chi tiết mẫu”. Dữ liệu và công thức tỷ lệ giữ nguyên. Hai cột cân theo tổng nội dung panel + ảnh, không kéo dài phần bằng chứng để lấp trống.

Bảng có colgroup và thuộc tính nhận diện cột dùng riêng cho trình bày. Nhóm số lượng/SKU/mã/giá/trạng thái nhận độ rộng gọn; tên khách và nội dung được mở rộng. Cột ghi kết quả liên hệ rộng hơn để không xuống dòng. Tablet có cấu hình cột riêng giúp các thao tác đơn hiện đầy đủ, mobile giữ cách trình bày sẵn có.

Bỏ note giá tham khảo, giải thích COD/tổng tiền, hướng dẫn lặp ở đóng kiện, tài chính, hàng hoàn, hãng và settings. Giữ các xác nhận thao tác, lỗi tải/lưu, kết quả đặt giao chưa rõ và ghi chú thực tế của người dùng. Không sửa backend, endpoint, payload hoặc luồng trong lượt này.

Kiểm tra: 57/57 test, TypeScript, build và diff check đạt; 58 lượt render toàn bộ màn ở desktop/mobile không ghi nhận lỗi JS, ảnh lỗi hoặc tràn trang. Kiểm tra tập trung thêm bảy màn ở 320/390/768/1440/1920px, kiểm tra sort tăng/giảm, disclosure nguồn, nút liên hệ một dòng, canvas/shadow thực tế và dữ liệu API trước/sau không đổi. Bảo toàn các callback/đích/ràng buộc input/disabled trong bốn JSX sửa bằng đối chiếu AST. Đã xem và sửa riêng cột cuối trên tablet.

Impeccable static: không finding. Taste màn Đơn hàng: 0 FAIL/0 WARN ở desktop/tablet/mobile. Báo cáo: 0 FAIL, cảnh báo ragged-row so riêng panel bằng chứng với khối biểu đồ; ảnh ngay dưới panel phải đã cân cả cột theo yêu cầu. Artifact của lượt này ở `.sites-runtime/ui-polish-20261028/`, được Git bỏ qua. Đây là kiểm tra Chrome headless/viewport giả lập, không phải audit WCAG đầy đủ.

## Đồng nhất màu và ánh sáng chữ theo phản hồi mới nhất

Thu bảng màu về trắng/xám trung tính và xanh #0668D5; trạng thái kết thúc/trung tính dùng slate. Biểu đồ cùng xanh, bỏ nền mint/amber ở nhóm tiền hàng, hãng, settings và bước hoàn tất; giữ nguyên nhãn trạng thái, dữ liệu và ảnh/logo gốc. Lỗi và thao tác nguy hiểm tiếp tục được phân biệt. Bóng khối đã tăng rõ hơn thành hai lớp theo yêu cầu trước.

Tiêu đề, mục điều hướng đang chọn và tab đang chọn có hiệu ứng ánh sáng trên chữ: màu chữ cố định, shadow tăng/giảm nhẹ trong 2,2 giây, tối đa hai lượt rồi dừng. Không thay đổi độ mờ chữ hay tạo nhấp nháy. Reduced motion tắt hiệu ứng; chữ dữ liệu trong bảng chỉ phản hồi nhẹ khi hover.

Lượt này chỉ sửa CSS và tài liệu, không đổi JSX/logic/backend. Build render và diff check đạt. Kiểm tra lại 58 trạng thái desktop/mobile không tràn trang, ảnh lỗi hoặc exception JS; thêm 14 màn xác nhận trạng thái chỉ xanh/slate, biểu đồ cùng xanh, animation chỉ đổi shadow và dừng sau hai lượt, reduced motion tắt animation. Dữ liệu API trước/sau các thao tác kiểm tra không đổi. Artifact màu/animation: `palette-results.json`, `screens/palette-*.png` trong thư mục QA đã bỏ qua ở trên.

## Phản hồi tiếp theo: số đếm, khoảng cách cột và trạng thái

Sửa xung đột CSS làm số đếm ở tab chọn có ô nền riêng, kích cỡ/căn dòng khác tab thường. Hai tab Tổng quan và các tab đơn dùng `.tab-count` cùng chiều cao 22px, chữ số tabular, không ô nền và không glow trên số. Đối chiếu số với API, kiểm tra đổi qua lại hai tab và giữ nguyên công thức lọc/giới hạn năm dòng Tổng quan.

Bảng desktop dùng tỷ lệ theo nội dung để giảm khoảng trống dồn vào cột tên. Danh mục Khách hàng/Nhắc mua giữ nguyên cách phân bố auto đã được chấp nhận. Tablet giữ độ rộng theo nội dung, điện thoại tiếp tục dạng hàng thông tin. Gợi ý bổ sung tồn kho trên điện thoại chiếm trọn một dòng để không tràn ô.

Trạng thái dùng chữ và icon nghĩa tương ứng (đóng kiện, chờ, giao, hoàn, hoàn tất); vẫn không khung. Giữ bảng màu xanh/slate, thêm xanh đậm cho chờ bàn giao, màu lỗi hiện có cho cần kiểm tra. Thích ứng layered glow từ Uiverse cho icon/chữ, giảm kích thước ánh sáng và tắt theo reduced motion. Nguồn và giấy phép: `docs/UI-COMPONENT-SOURCES.md`.

Xác minh: 57/57 test, TypeScript, build render và diff check đạt. 58 trạng thái toàn bộ màn desktop/mobile không lỗi ảnh/JS/tràn trang. Kiểm tra tập trung 60 lượt ở 320/390/768/1051/1440/1920px không ô bị tràn nội dung, số đếm căn cùng tâm và khớp API; sort vẫn hoạt động; dữ liệu API trước/sau không đổi. Đối chiếu AST ba JSX sửa trong lượt này xác nhận callback, đích điều hướng, ràng buộc input và biểu thức rows giống hệt snapshot đầu lượt. Artifact: `.sites-runtime/ui-table-review-20261028/`, không nằm trong Git. Localhost vẫn ở 4182, QA dùng dữ liệu riêng ở 4183.

## Phản hồi tiếp theo: Thiết lập và banner hướng dẫn

Thiết lập dùng hai hàng cân nhau: cơ sở/tài khoản, vai trò/phân quyền. Ảnh cơ sở giữ nguyên asset, chiều cao 168px desktop và 156px mobile, bỏ span hai hàng và kéo giãn theo khối cạnh bên. Đặt lại dữ liệu thành hàng gọn riêng, tiêu đề/nút ngang nhau trên desktop, xuống dòng trên điện thoại. Nội dung rộng tối đa 1280px, không thêm văn bản giải thích.

Bỏ banner hướng dẫn đúng nội dung người dùng đánh dấu ở danh sách xử lý cần kiểm tra. Không thay đổi trạng thái đơn, xác minh vận đơn, ghi nhận kết quả đặt giao, thông báo lỗi hoặc quy trình đặt giao. Các xác nhận cấp/thu hồi quyền và đặt lại dữ liệu giữ nguyên.

Kiểm tra: 57/57 test, TypeScript, build render và diff check đạt. Kiểm tra Thiết lập ở 320/390/768/1051/1440/1920px: các cặp khối cùng chiều cao, ảnh đúng kích thước, đủ năm khối và không tràn trang. Mở rồi đóng hai dialog phân quyền/reset, không thực thi thay đổi. AST xác nhận callback/giá trị/ràng buộc/điều hướng trong hai JSX giống hệt snapshot đầu lượt; dữ liệu API trước/sau kiểm tra không đổi, không exception JS. Artifact tại `.sites-runtime/ui-settings-review-20261028/`, được Git bỏ qua.
