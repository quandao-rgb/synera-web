# Xe chạy nhỏ trong dải “Cơ sở phù hợp”

Cập nhật 28/10/2026: khôi phục đường chạy vòng nhỏ trong vùng trống của dải trắng, không chạy hết chiều ngang hoặc tạo làn riêng sát đáy. Giữ xe đỏ, thùng vàng kem và khói phía sau.

- Vùng chạy tối đa rộng 520px, tự đo theo khoảng trống. Đo từng đoạn chữ và từng nhãn/icon thực tế, không coi khoảng trắng trong flex container là vật cản.
- Dùng tọa độ layout để tránh sai vị trí khi chữ đang chạy hiệu ứng xuất hiện GSAP. Xe thu nhỏ vừa phải khi dải thấp, ẩn khi không còn khoảng trống an toàn.
- Giữ chiều cao và padding ban đầu của section; không đẩy chữ/icon hoặc thêm làn trống. Mobile, coarse pointer và reduced motion tắt hiệu ứng.
- Overlay absolute, pointer-events:none, overflow:hidden; xe/khói đi cùng section khi cuộn và không chạy ra ngoài.
- Dừng khi ngoài viewport, window/tab không hoạt động, mở form/menu hoặc giảm chuyển động. Cleanup RAF và observers khi unmount.
- Atlas WebP 8 góc nhìn, khoảng 49KB. Đây là sprite giả 3D; không thêm Three.js/WebGL. Khói tối đa 24 hạt; không có bám chuột.

## Video landing

Dùng file do chủ dự án cung cấp: C:/tuiii/video_phuc_hoi_nen_tuong_thich.mp4. Asset trong dự án: frontend/public/assets/landing/background-lp.mp4, dung lượng 7,258,084 byte; source dùng ?v=3 để tránh cache clip cũ. Bỏ lớp phủ tối cục bộ từng dùng cho watermark, giữ lớp chuyển tối bên trái để đọc chữ. Video vẫn phủ màn hình đầu, autoplay/muted/loop/playsInline và dừng khi cần giảm chuyển động.

## Kiểm chứng

71/71 kiểm thử đạt; TypeScript, build Node và kiểm tra bundle đạt. Kiểm thử Chrome headless dùng server và dữ liệu QA riêng, gồm 19 nhóm kiểm tra: phát video/byte range; đăng ký sai/đúng; giữ phiên khi reload; 14 route sidebar; thu gọn sidebar; tạo đơn, đóng kiện, báo giá, đặt giao, bàn giao không trừ tồn hai lần; chi tiết đơn/nested active; tracking; nhận hoàn; hủy đơn; tạo hàng hóa/khách hàng; quyền kho; đăng xuất; đăng nhập sai/đúng; responsive. Không có HTTP 500 hoặc exception trình duyệt trong các lượt kiểm tra này. Không tạo vận đơn thực.

## File và backup

Renderer: frontend/components/landing/SyneraAudienceTruck.jsx. Đường chạy: audience-truck-zone.mjs. Khói/chuyển động: truck-animation-engine.mjs. Style: frontend/app/landing.css. Kiểm thử: tests/audience-truck.test.mjs, tests/audience-truck-lifecycle.test.mjs, tests/truck-animation.test.mjs.

Backup trước lần thay video và khôi phục xe: C:/SYNERA-backups/SYNERA-before-clean-video-20261028-221716.zip. Bản trước đường chạy sát đáy: C:/SYNERA-backups/SYNERA-before-bottom-lane-20261028-215826.zip. Giải nén vào folder riêng khi cần khôi phục.

Local: http://localhost:4191/ — Ctrl+F5 rồi cuộn tới dải trắng dưới hero. Source hiện ở local trên branch fix/landing-hero-header cùng phần sửa header/hero. API, xác thực, phân quyền và nghiệp vụ không thay đổi.
