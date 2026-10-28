# SYNERA — toàn bộ giao diện, 27/10/2026

## Bố cục Thiết lập theo phản hồi tiếp theo, 28/10/2026

Desktop: hai khối cùng hàng và chiều cao, cơ sở cạnh tài khoản, vai trò cạnh phân quyền kho. Ảnh cơ sở cao 168px, không kéo giãn qua hai hàng. Đặt lại dữ liệu thành một hàng riêng, tiêu đề và nút cùng hàng; tổng chiều rộng nội dung tối đa 1280px. Mobile xếp dọc theo thứ tự cũ, ảnh 156px, nút reset xuống dòng. Không thêm note giải thích hoặc thay đổi hành vi quyền/vai trò/reset.

Bỏ đúng banner lặp “Kết quả đặt giao chưa rõ. Kiểm tra vận đơn hiện có trước khi gửi lại yêu cầu.” ở danh sách xử lý cần kiểm tra. Nhãn trạng thái, kiểm tra vận đơn trong chi tiết và các xác nhận thao tác giữ nguyên.

## Căn số đếm, bảng và trạng thái theo ảnh tiếp theo, 28/10/2026

Số đếm tab dùng chung `.tab-count`: không nền/viền ở cả trạng thái chọn và thường, cùng dòng cao 22px, chữ số tabular và không nhận glow của nhãn tab. Giữ nguyên công thức đếm và giới hạn năm dòng của bảng Tổng quan.

Bảng desktop trên 1050px chia tỷ lệ theo nội dung (mã, danh tính, số, trạng thái, thao tác), không cho một cột tự hấp thụ toàn bộ khoảng trống. Bảng Khách hàng/Nhắc mua giữ layout auto đã được chấp nhận. Tablet tiếp tục độ rộng theo nội dung, mobile giữ hàng dạng thông tin và cho gợi ý tồn kho chiếm cả hàng.

Trạng thái vẫn không khung: thêm icon Lucide theo nghĩa, dùng xanh chính/xanh đậm/slate; riêng cần kiểm tra dùng màu lỗi hiện có. Tham khảo glow nhiều lớp từ Uiverse `mrhyddenn/moody-badger-62`, thu nhỏ cho chữ/icon trên nền trắng, không lấy khung nút. Hiệu ứng icon đang giao chạy tối đa hai lượt, hover sáng nhẹ, reduced motion tắt. Nguồn và MIT license ở `docs/UI-COMPONENT-SOURCES.md`. Không đổi giá trị trạng thái hoặc hành động.

## Đồng nhất bảng màu theo phản hồi mới nhất, 28/10/2026

Dùng một màu nhấn #0668D5 (hover #0954A8), mặt trắng, canvas #F6F6F6, chữ slate #334155 và chữ phụ #617084. Trạng thái hoạt động/hoàn tất/kết quả liên hệ cùng xanh; trạng thái trung tính/hoàn/hủy dùng slate, giữ nguyên nhãn chữ để phân biệt. Biểu đồ trạng thái cùng xanh, số liệu và thứ tự giữ nguyên. Đỏ #B42318 chỉ dành cho lỗi thực và hành động nguy hiểm. Bỏ nền mint/amber ở khối tiền hàng, hãng vận chuyển, settings và stepper hoàn tất. Logo hãng và ảnh gốc giữ màu thật.

Tiêu đề trang và mục đang chọn có ánh sáng xanh nhẹ trên chữ, tăng/giảm text-shadow trong 2,2 giây, tối đa hai lượt rồi dừng. Màu chữ luôn cố định, không chớp tắt, không gradient hoặc làm mờ chữ dữ liệu. Reduced motion tắt hiệu ứng; bảng chỉ có glow nhẹ khi hover. Bóng khối hai lớp theo phản hồi trước giữ nguyên. Hướng này thay thế bảng màu đa sắc ở các phần cũ khi có khác biệt.

## Bổ sung theo ảnh phản hồi tiếp theo, 28/10/2026

Ưu tiên mới: canvas xám trắng trung tính #F6F6F6, không ám xanh; panel trắng có bóng hai lớp `0 2px 5px #1824331a, 0 8px 22px #18243314` và viền #D8DCE2. Tăng độ rõ theo phản hồi bóng cũ quá nhạt; áp dụng ngay cả khi chưa hover. Sidebar đậm giữ nguyên. Chữ chính dùng slate #334155; primary #0672E5, trạng thái xanh #006CDD, xanh lá #00814A, cam #B65300, hồng đỏ #D32A54, tím #8055D9 cho chờ bàn giao, cyan #007C91 cho theo dõi. Giữ trạng thái chỉ là chữ, không khung.

Báo cáo desktop: biểu đồ trạng thái chiếm phần rộng, cột bằng chứng cố định 312px (280px tại desktop hẹp). Tỷ lệ và nhãn cùng một hàng, số mẫu/quá hạn cùng một dòng; nhóm, thời gian và nguồn nằm trong disclosure “Chi tiết mẫu”, giữ số liệu và nguồn thật. Bỏ các note giải thích lặp ở tạo đơn, kho/hoàn, chân bảng và settings; giữ lỗi, xác nhận và ghi chú thực của đơn.

Bảng dùng colgroup theo vai trò dữ liệu: cột số/mã/trạng thái gọn, danh tính/nội dung co giãn. Riêng thao tác liên hệ có 164px để giữ một dòng. Tablet 768–1050px có kích thước cột riêng cho đơn/xử lý/vận chuyển; mobile tiếp tục dạng hàng thông tin hiện có. Các điều chỉnh này thay thế lựa chọn “không shadow” và bảng màu trước đó khi có khác biệt.

## Tinh chỉnh 28/10/2026

Theo góp ý tiếp theo: trạng thái chỉ dùng chữ màu, không nền/khung/chấm; link thao tác trong bảng không viền và có mũi tên. Số liệu dùng chữ lớn và khoảng cách, bỏ ô đệm màu quanh số, tabs và việc cần làm. Màn xử lý dùng bốn lựa chọn có gạch chân trạng thái thay cho bốn hộp. Giữ xanh #125AB8, amber #94600D, xanh lá #187048, đỏ #B72E43 trên nền trắng; trạng thái luôn có nhãn chữ.

Thẻ cơ sở chỉ còn tên và dấu mở chi tiết. Ảnh do chủ dự án cung cấp dùng trong chi tiết cơ sở và báo cáo; cột báo cáo có nội dung + ảnh, giảm vùng trống. Header bảng xanh nhạt tách rõ tên cột khỏi nội dung khách hàng/sản phẩm. Search chỉ vẽ focus trên wrapper, không chồng thêm outline của input.

Tham khảo [React Bits Count Up](https://reactbits.dev/text-animations/count-up) và [Spotlight Card](https://reactbits.dev/components/spotlight-card): viết phần thích ứng riêng với GSAP có sẵn, số có giá trị thật dành cho screen reader và chuyển động hữu hạn; spotlight chỉ phản hồi con trỏ trên khối bằng chứng báo cáo. Không chạy vòng lặp nền; reduced motion tắt chuyển động. Không thêm dependency hoặc sao chép nguyên component.

Thêm mặt hàng từ Hàng hóa/Quản lý kho, có ảnh tải lên và tồn đầu kỳ. Thêm khách từ danh mục hoặc ngay khi tạo đơn; tự chọn khách vừa lưu, giữ mặt hàng/số lượng đang nhập. Hai tính năng mới được yêu cầu rõ trong đợt này; không đổi các bước xử lý đơn cũ. Quy tắc chi tiết bên dưới ghi hướng ngày 27/10, các điểm tinh chỉnh này có ưu tiên khi khác nhau.

Mở rộng hướng Tổng quan đã được chủ dự án chấp nhận sang các màn hiện có. Đây là cập nhật trình bày; không thay thế quy trình nghiệp vụ.

## Thị giác

- Roboto tự phục vụ, gồm Latin và tiếng Việt, fallback sans-serif. Body 14px, bảng 13px, metadata 12px, tiêu đề trang 26px/24px mobile, tiêu đề khối 16px/15px mobile. Giữ chữ thực tế và bảng dữ liệu, không chèn số liệu để lấp khoảng trống.
- Nền #F4F7FB; mặt khối #FFFFFF; chữ #122B49; chữ phụ #53667C; primary #1263D6; hover #084DA9; viền #DFE7F1.
- Nền xanh nhạt #EDF5FF cho lựa chọn/người nhận; xanh ngọc #EDF8F5 cho nhóm tiền hàng; amber nhạt cho cảnh báo và thao tác cần chú ý. Trạng thái luôn kèm chữ.
- Khối radius 12px, control 7px, gap 20px. Dùng viền và nền để chia nhóm; shadow tập trung vào menu/hộp thoại. Tiêu đề bảng không thêm icon chỉ để trang trí.
- Sidebar navy, thẻ cơ sở hiện tại dễ nhận diện. Account dùng tên/email thật của session hiện có, thông tin vai trò theo workspace; dẫn đến settings cũ và gọi callback đăng xuất cũ.

## Tạo đơn và vận chuyển

Tách khối người nhận, hàng hóa, tiền hàng, gợi ý giao. Desktop bố cục nội dung + cột gợi ý; mobile xếp dọc giữ thứ tự và đầy đủ thao tác. Không biến gợi ý sơ bộ thành đặt giao, không bỏ xác nhận kiện hoặc bàn giao thực tế.

Logo chính thức chỉ gắn theo provider ID của dịch vụ mẫu Grab/GHN/GHTK/SPX có sẵn. Nhãn mẫu/chưa kết nối được hiển thị ngay trong khu vực chọn dịch vụ. Vận chuyển A/B/C dùng dấu nhận diện trung tính; không tự đổi hãng hoặc quy tắc giá. Hình sản phẩm là SVG minh họa hàng mẫu, không phải ảnh sản phẩm thật của người dùng. Ảnh kho là ảnh minh họa từ Unsplash, lưu local.

## Chuyển động

Tận dụng GSAP, Radix Select, stepper, toast và dialog đã có trong dự án; không thêm package. Áp dụng feedback cho hover/nhấn/focus, tab, switch, chọn dịch vụ và disclosure. Chuyển động ngắn 180–240ms; press 90ms, dịch chuyển hover 1px. Không chờ animation mới chạy callback nghiệp vụ. Giữ route reveal có sẵn.

Tôn trọng `prefers-reduced-motion`: tắt chuyển động CSS mới và không tạo GSAP tween mới; gồm cả select được portal ra ngoài app. Escape, focus và hoạt động bàn phím của primitive cũ được giữ lại.

## Nguồn tham khảo

- [Sapo — tạo và duyệt đơn hàng](https://help.sapo.vn/tao-va-duyet-don-hang-online-tren-sapo-omniai): phân nhóm form, bảng và vùng thao tác, cùng ảnh tham khảo người dùng cung cấp.
- [GrabExpress](https://www.grab.com/vn/express/): nhận diện dịch vụ giao hàng.
- [shadcn/ui Button](https://ui.shadcn.com/docs/components/base/button) và [21st.dev Animated Components](https://21st.dev/community/components/explore/animated-components): tham khảo trạng thái và phản hồi tương tác. Không sao chép package hoặc component từ các catalog này.
- Áp dụng UI/UX Pro Max, Taste phần app screens và Impeccable đã cài local.

Triển khai chung trong `frontend/app/workspace-theme.css`; Tổng quan có các quy tắc riêng trong `dashboard-overview.css`. Nguồn asset ở `docs/UI-ASSET-SOURCES.md`, bằng chứng kiểm tra ở `docs/UI-UX-WORKSPACE-REVIEW.md`.
