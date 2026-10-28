# Phạm vi làm lại UI/UX SYNERA

## Chỉ dẫn của chủ dự án

Chốt ngày 27/10/2026: chỉ thay đổi giao diện và trải nghiệm trình bày. Giữ nguyên mọi luồng hoạt động, thứ tự thao tác, hành vi tương tác và logic xử lý. Có thể bổ sung phần giao diện cho các tương tác hiện có nhưng không thay đổi logic của chúng.

## Nhánh và mốc đối chiếu

**Mở rộng được chủ dự án yêu cầu ngày 28/10/2026:** ngoài tinh chỉnh UI, bổ sung tạo mặt hàng và tạo khách hàng có lưu dữ liệu thật. Hai action mới `product-create`/`customer-create` dùng endpoint, version, session và quyền owner hiện có. Phần này cho phép thêm validation/lưu danh mục, ảnh mặt hàng và kiểm thử liên quan trong backend; các luồng đơn, kiện, đặt giao, bàn giao, tồn của mặt hàng cũ và tài chính vẫn giữ nguyên. Đây là ngoại lệ được người dùng yêu cầu trực tiếp đối với phạm vi UI-only ở bản ngày 27/10.

- Nhánh làm việc ban đầu: `feat/ui-ux-redesign`; nhánh gửi pull request theo yêu cầu ngày 28/10/2026: `feat/synera-ui-ux-20261028`.
- Mốc mã nguồn trước khi làm lại: `4e8558b58d88f16e45fb54f82a7450638c8d14a6`.
- Mọi thay đổi UI/UX thực hiện trên nhánh này. Chỉ gộp vào `main` khi chủ dự án quyết định.
- Ở bước chuẩn bị ban đầu, push bị từ chối với HTTP 403. Khi chuẩn bị pull request ngày 28/10/2026, đã xác minh tài khoản đăng nhập có quyền ghi vào `quandao-rgb/synera-web`.

## Được thay đổi

- Màu sắc, typography, spacing, kích thước, viền, nền, icon và tài nguyên hình ảnh.
- Cách trình bày component, bảng, form và trạng thái hiện có; responsive trong phạm vi giữ nguyên chức năng và khả năng thao tác.
- CSS, class và markup phục vụ trình bày, giữ nguyên các liên kết, callback, field, giá trị và ràng buộc đang dùng.
- Bổ sung thành phần hiển thị từ dữ liệu hoặc trạng thái hiện có. Thành phần mới không tạo hành động nghiệp vụ, điều kiện hoặc kết quả mới.
- Hiệu ứng thị giác và trạng thái hover/focus không làm chậm, chặn hoặc đổi thứ tự thao tác; tôn trọng reduced motion.
- Theo yêu cầu mở rộng ngày 27/10: thêm menu hiển thị tài khoản từ session, đóng/mở bằng trạng thái giao diện; dùng lại liên kết settings và callback đăng xuất. Có thể mở rộng animation dùng GSAP sẵn có và thêm hình/logo nhận diện, giữ nguyên các thao tác nghiệp vụ.

## Phải giữ nguyên

- Route, URL, điều hướng, đích liên kết, bước xác nhận và thứ tự thao tác.
- Callback, event handler, hook, state và side effect đang điều khiển hành vi; điều kiện bật/tắt/hiện/ẩn hành động.
- Đăng ký, đăng nhập, đăng xuất, session, vai trò và phân quyền.
- Endpoint, HTTP method, payload, field, ID, mã trạng thái, validation và cách xử lý lỗi.
- Quy trình đơn hàng, xác nhận kiện, đặt giao, kiểm tra vận đơn, bàn giao, giao/hoàn/hủy; không gộp hoặc bỏ bước xác nhận.
- Tính toán, tìm kiếm, lọc, sắp xếp, điều kiện khả dụng, xếp hạng và gợi ý vận chuyển.
- Nguồn dữ liệu, công thức KPI, lưu trữ và database; giữ nguyên `.data/` và tài khoản hiện có.
- Dependency, cấu hình build/chạy/deploy, schema và migration trong phạm vi công việc UI/UX này.
- Nội dung nghiệp vụ, thông báo, ý nghĩa nhãn và dữ liệu thực tế; không thêm số liệu, chứng thực hoặc trạng thái giả để làm giao diện đẹp hơn.

Không ẩn, vô hiệu hóa, tự kích hoạt hoặc nối lại một hành động chỉ để phù hợp với bố cục mới. Nếu một ý tưởng thiết kế đòi hỏi đổi hành vi, giữ nguyên hành vi hiện có và báo rõ điểm vượt phạm vi.

## Ranh giới mã nguồn

- Ưu tiên phần trình bày trong `frontend/app/*.css`, JSX và tài nguyên giao diện trong `frontend/`.
- File JSX có thể chứa cả giao diện lẫn logic. Chỉ sửa phần trình bày; không coi toàn bộ `frontend/` là phạm vi được viết lại.
- Đặc biệt giữ logic trong `frontend/app/interface.jsx`, `frontend/app/views/`, các form xác thực và các component tương tác.
- Giữ nguyên `frontend/components/synera/workflow-steps.mjs`, `toast-feedback.mjs` và `shipping/recommendation/` cùng các tính toán trong JSX.
- Giữ nguyên `backend/`, `shared/`, adapter `app/`, `scripts/`, cấu hình dự án và các bài kiểm thử nghiệp vụ.
- Tuân thủ `frontend/AGENTS.md`, `backend/AGENTS.md` và `docs/PROJECT-STRUCTURE.md`.

## Cách dùng các skill thiết kế

- UI/UX Pro Max: tra cứu nguyên tắc thiết kế và triển khai phù hợp với stack đã có.
- Taste: chọn đúng quy trình website giới thiệu hoặc màn hình ứng dụng; kiểm tra ảnh render và chất lượng trình bày.
- Impeccable: đánh giá hierarchy, typography, spacing, responsive và chất lượng UI.
- Chỉ dẫn của chủ dự án trong tài liệu này quyết định phạm vi. Các khuyến nghị từ skill không cho phép thay đổi logic hoặc luồng hiện có.
- Đọc `design-system/synera/MASTER.md` trước khi thiết kế. Chưa có quyết định thị giác mới thì tiếp tục tôn trọng các quyết định đã ghi; không ghi đè tự động.

## Kiểm tra trước khi bàn giao UI/UX

1. So sánh diff với mốc ban đầu, xác nhận không thay đổi các vùng logic và cấu hình được bảo vệ.
2. Chạy các bài kiểm thử hiện có, TypeScript và build Node/local khi có thay đổi giao diện.
3. Đối chiếu trước/sau cho các luồng bị ảnh hưởng: cùng dữ liệu, cùng thao tác, cùng thứ tự và cùng kết quả.
4. Kiểm tra responsive, hiển thị đủ hành động, bàn phím, form và các trạng thái loading/empty/error hiện có trên các màn hình đã sửa.
5. Ghi rõ kiểm tra nào thực sự đã chạy và phần nào chưa kiểm tra thủ công. Test tự động đạt không thay thế kiểm tra hành vi trên trình duyệt.

## Hiện trạng chuẩn bị

Phần này ghi nhận mốc chuẩn bị trước khi sửa giao diện. Kết quả sau đợt làm lại Tổng quan được ghi riêng trong `docs/UI-UX-OVERVIEW-REVIEW.md`.

- Chưa thay đổi mã nguồn giao diện hoặc logic trong bước chuẩn bị này.
- `npm.cmd test`: 50/50 bài đạt, không có bài bỏ qua.
- `npm.cmd run check -- --incremental false`: đạt.
- Log kiểm thử ở `.sites-runtime/ui-ux-baseline/tests.log` (không đưa vào Git).
