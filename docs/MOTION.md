# Chuyển động giao diện SYNERA

Tham khảo bộ skill chính thức [greensock/gsap-skills](https://github.com/greensock/gsap-skills): gsap-core, gsap-react, gsap-timeline và gsap-performance. Tài liệu skill nằm ngoài source ứng dụng; runtime chỉ dùng `gsap` và `@gsap/react` từ npm.

## Quy tắc trải nghiệm

- Sidebar desktop: 320 ms, `power3.inOut`, đồng bộ chiều rộng không gian làm việc. Đây là trường hợp chủ ý thay đổi layout; các hiệu ứng còn lại ưu tiên transform và opacity.
- Menu điện thoại: mở 320 ms, đóng 240 ms, `power3.out`; lớp nền mờ 220 ms. Khóa cuộn, giữ focus trong menu và trả focus theo cơ chế sẵn có.
- Nền mục điều hướng đang chọn: 280 ms, không di chuyển chữ. Vị trí cập nhật theo trang, vai trò và kích thước menu.
- Nút: nhấn xuống scale 0.97 trong 90 ms; trả về trong 200 ms. Hover chỉ nâng nhẹ 1 px khi thiết bị có chuột. Không trì hoãn sự kiện click hay sửa hành vi nghiệp vụ.
- Nội dung vận hành hiển thị trực tiếp, không chạy hiệu ứng vào trang trên tiêu đề hoặc các khối dữ liệu. Giữ phản hồi trên nút, menu, sidebar và hộp thoại để thao tác rõ ràng.
- Hộp thoại và tìm kiếm nhanh: 240 ms, dịch 10 px, scale 0.985 về 1. Nội dung vẫn sử dụng native dialog và cơ chế bàn phím sẵn có.
- Tôn trọng `prefers-reduced-motion`, đổi breakpoint bằng `gsap.matchMedia()`. Sidebar và mục đang chọn cập nhật tức thời khi giảm chuyển động; bỏ hiệu ứng nhấn, vào trang và hộp thoại.
- Animation thuộc context của `useGSAP`; media context quản lý cả callback sự kiện. Dọn listener, ResizeObserver, tween và inline style khi unmount hoặc đổi media query.
- Không dùng hiệu ứng cuộn chiếm quyền, con trỏ đuổi theo chuột, hoặc vòng lặp trang trí trong màn hình vận hành.

## Landing workflow

- Landing `ContentSection.jsx` dùng stacked cards; cuộn trang không ghim hoặc trượt ngang nội dung. Chọn bước bằng các nút, card được chọn giữ độ tương phản đầy đủ và các card còn lại xếp phía sau.
- Card workflow tắt hiệu ứng fade của product preview để không hiện mờ khi vừa cuộn tới; `prefers-reduced-motion` vẫn tắt chuyển động xếp lớp.
- Hiệu ứng này chỉ áp dụng cho phần giới thiệu sản phẩm, không thay đổi stepper hay trạng thái đơn hàng trong ứng dụng.

## Vị trí chỉnh sửa

- `frontend/components/synera/motion.jsx`: MotionShell, useDialogMotion và vòng đời GSAP.
- `frontend/app/motion.css`: màu, nền lựa chọn, focus và override tránh CSS/GSAP cùng điều khiển transform.
- `frontend/app/interface.jsx`: kết nối trạng thái điều hướng vào MotionShell.
- `frontend/components/synera/ui.jsx`: kết nối hộp thoại.
- `frontend/render/main.jsx` và `frontend/app/layout.tsx`: nạp cùng stylesheet cho hai profile.

## Kiểm tra

`npm.cmd run build:render`, `npm.cmd run check`, `npm.cmd run test:render` và `node tests/client-bundle-check.mjs dist-render/client`.

Kiểm tra trình duyệt: thu/mở sidebar, đảo chiều liên tiếp, điều hướng, tìm kiếm/Escape, mở/đóng hộp thoại và trả focus, bàn phím Enter, menu ở 390 × 844 và quay lại desktop. Không đo hay cam kết FPS cụ thể; kiểm tra này xác nhận thao tác và trạng thái giao diện, không thay thế profiling thiết bị thực.
