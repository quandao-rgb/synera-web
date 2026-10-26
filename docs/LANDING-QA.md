# Kiểm tra landing SYNERA

Kiểm tra trên bundle production của `npm.cmd run build:render`, phục vụ bằng Node local. Không deploy.

## Kết quả chức năng

- Build: đạt. `npm.cmd run check`: đạt. `node --test tests/*.test.mjs`: 47/47 đạt sau thay đổi cuối ở xác thực.
- Lint design-taste trên 10 file landing JSX/CSS: 0 FAIL, 0 WARN. Các ngoại lệ có chú thích tại đúng dòng: bóng của menu/dialog, viền nút thực, đường trong khung UI sản phẩm.
- Browser Chrome qua CUA: không có error/warn console trong lượt kiểm tra cuối.
- Đăng ký sai mật khẩu nhập lại: lỗi ngay tại form, giữ email đã nhập, focus tới lỗi, không đổi URL. Sau khi sửa: xác minh phiên rồi về `/#/`, tiêu đề Tổng quan hiện có.
- Đăng nhập sai: thông báo “Email hoặc mật khẩu chưa đúng.”, ở lại form. Đăng nhập đúng: về `/#/`. Reload vẫn vào ứng dụng với phiên đã xác nhận. Logout thu hồi phiên.
- Form trên mobile có vùng cuộn khi cần, label rõ ràng, trường mật khẩu riêng và nút hiện/ẩn, autocomplete đúng. Modal native, Escape đóng và trả focus về nút đã mở. Nút đóng luôn có tên truy cập.
- Ba tab thay tiêu đề/mô tả/minh họa cùng nhau. Arrow Left/Right, Home/End chuyển tab và focus; focus có outline. Panel không chọn có inert và aria-hidden; mọi aria-controls trỏ tới phần tử tồn tại.
- Năm bước minh họa đã bấm qua: giữ nguyên đơn, khách, mặt hàng và số lượng. Kiện 3 × 12,5 = 37,5 kg; tiền hàng 3 × 96.000 = 288.000 ₫; chênh lệch cước 139.000 − 137.000 = 2.000 ₫.
- Năm FAQ mở bằng click và đóng bằng Enter. Header/menu mobile/Escape, dropdown Giải pháp và chọn mục chuyển đúng tab, đóng menu. Neo section không che nội dung dưới header.
- Đã kiểm tra mailto Pro/footer và tel bằng DOM; không gửi email hoặc thực hiện cuộc gọi.
- Khung kho không có giá, tổng tiền, chiết khấu, COD hoặc công nợ. Các test quyền server cũ vẫn qua.
- Giữ nguyên byte nội dung các file quản trị/logic: `app/interface.jsx`, `app/synera.css`, `app/admin-layout.css`, `server/domain.mjs`; package/lockfile không đổi.

## Responsive

Đo trực tiếp DOM và lưu ảnh ở cả bốn chiều rộng. Scrollbar Chrome chiếm 15 px; scrollWidth bằng clientWidth và nhỏ hơn innerWidth, không có tràn ngang.

| innerWidth | scrollWidth | Chiều cao vùng tab (cả ba lựa chọn) | H1 | Ảnh hero |
| --- | --- | --- | --- | --- |
| 375 | 360 | 717 / 717 / 717 px | 1 | tải đủ, đúng tỷ lệ |
| 768 | 753 | 594,97 / 594,97 / 594,97 px | 1 | tải đủ, đúng tỷ lệ |
| 1280 | 1265 | 404,59 / 404,59 / 404,59 px | 1 | tải đủ, đúng tỷ lệ |
| 1440 | 1425 | 404,59 / 404,59 / 404,59 px | 1 | tải đủ, đúng tỷ lệ |

Đã sửa nút Đăng ký bị xuống dòng ở 375 px; header 64 px và nút 44 px sau sửa. Grid giữ kích thước theo panel cao nhất, không đặt chiều cao cứng cắt nội dung. Ảnh hero có width/height thật 1905×904. Đã reset viewport sau kiểm tra.

Ảnh proof: `landing-preview-desktop.jpg`, `landing-preview-mobile.jpg`, `landing-register-mobile.jpg` trong thư mục docs.

## Motion và cách kiểm tra

Hover 150 ms, chuyển nội dung minh họa 180 ms / 3 px, nội dung xuất hiện 260 ms / 8 px. Không bounce, spring, glow, gradient hoặc glass. Nội dung mặc định đọc được, IntersectionObserver chỉ kích hoạt chuyển động sau khi xuất hiện.

Đã xác minh CSS media query `prefers-reduced-motion: reduce` trong bundle trình duyệt: animation/transition tắt, hover không dịch chuyển; JS không khởi tạo observer khi reduce đang bật. Không đổi cài đặt animation hệ điều hành và không giả lập media preference bằng DevTools trong lượt này; không coi đây là kiểm tra tương tác thực tế dưới một preference đã bật.

`inspect.mjs` của skill không chạy vì nó tự mở/điều khiển browser bằng kênh ngoài CUA. Thay bằng DOM read-only, thao tác bàn phím/chuột, console và screenshot qua CUA ở đúng bốn breakpoint trên bundle cuối. Không ghi nhận kết quả inspector tự động chưa chạy. Các ảnh full-page giữ trong workspace QA; native full-page capture có thể đưa sticky header/skip link ở vị trí cuộn hiện tại, nên dùng ảnh viewport để đánh giá chồng lấp thực tế.

## Hướng thiết kế và hai lượt nhìn/sửa

Direction: `product-performs`, seed `1414997116`, tone quiet, giữ palette/type đã có. Hình thức split hero, tab, năm bước, dải tối và các section theo yêu cầu cụ thể được ưu tiên hơn geometry ngẫu nhiên của skill. Không thay thành photography/video hay các scene cuộn lớn vì brief yêu cầu hình sản phẩm và chuyển động ngắn.

Inventory riêng của bài toán: cơ sở phân phối, ba thùng nước, giữ hàng khác xuất thực, kiện chuẩn, người phụ trách xác nhận, chu kỳ mua lại, ba mốc cước, chủ/kho, Free/Pro chưa công bố giá, tuyến Tân Bình–Bình Thạnh.

Argument: hero chứng minh sản phẩm bằng screen hiện có; tab nối ba gợi ý; năm bước cho thấy dùng lại cùng một đơn; dải tối nối bối cảnh/kết quả; hai vai trò chứng minh phân tách thông tin; pricing/FAQ làm rõ phạm vi và điểm cần liên hệ. Không thêm logo khách hàng, lời chứng thực hoặc KPI quảng cáo.

ROUND 1
Seen in one second: sản phẩm vận hành phân phối, ảnh ứng dụng và nút đăng ký.
Idea (one sentence): đơn ba thùng nước của SYNERA trở thành dữ liệu xuyên suốt để người xem tự kiểm tra từng khâu.
Live thing: ba tab gợi ý và hành trình một đơn có năm bước do người xem chọn.
Layout words by section: hero=split / audience=strip / solutions=tabs / workflow=ordered journey / shipping=connected context / roles=comparison / pricing=two plans / faq=accordion / cta=statement / footer=links.
Scores: design 6,5 · usability 7,5 · creativity 6,5 · content 8 → overall 7,0, cap 6,5.
Caps applied: headline dài theo copy được chốt và chỉ dùng ảnh UI theo brief; không đủ bốn ảnh photography của rubric skill. Đây là giới hạn so với rubric gallery, không phải kiểm tra chức năng thất bại.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Hero mobile: nút Đăng ký xuống dòng — giảm gap và giữ nhãn một dòng, kích thước chạm 44 px.
2. Demo mobile: tab vận chuyển tăng khung 48 px — đặt các panel vào cùng ô grid, giữ không gian theo nội dung cao nhất; panel ẩn inert.
3. Form đăng ký: nút hiện mật khẩu nằm trong label làm tên trường không rõ — tách label/input/button đúng liên kết htmlFor/id.

ROUND 2
Seen in one second: một sản phẩm kết nối kho, khách và giao nhận với điểm bắt đầu rõ ràng.
Idea (one sentence): cùng một đơn đi qua các khâu, các số kiện/khối lượng/chi phí giữ nhất quán.
Live thing: người xem đổi tab và chọn năm bước; CTA mở biểu mẫu tài khoản thật.
Layout words by section: hero=split / audience=strip / solutions=tabs / workflow=ordered journey / shipping=connected context / roles=comparison / pricing=two plans / faq=accordion / cta=statement / footer=links.
Scores: design 6,5 · usability 8 · creativity 6,5 · content 8 → overall 7,1, cap 6,5.
Caps applied: giữ các giới hạn gallery như round 1 vì cần đúng copy, screenshot và cấu trúc người dùng đã chốt; không tuyên bố là website đạt chuẩn giải thưởng.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Desktop hero: ảnh toàn màn hình quản trị nhỏ khó đọc từng số — dùng làm hình tổng quan; các khung React bên dưới phóng rõ phần nghiệp vụ. Đã có, không thêm crop giả.
2. Mobile toàn trang: nội dung dài do đầy đủ mười phần theo brief — các tab/FAQ và neo header rút ngắn đường đi; không tự xóa section bắt buộc.
3. Pricing Pro: chưa có giá và hợp đồng thật — giữ “Liên hệ tư vấn” cùng ghi chú phạm vi, cần chủ sản phẩm chốt trước khi công bố thương mại.
