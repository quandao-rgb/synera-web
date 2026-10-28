# Landing page — UI UX Pro Max

Trang này bổ sung `../MASTER.md` cho landing page SYNERA. Không áp dụng cho giao diện quản trị.

## Nguồn và tra cứu

- Skill: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md
- Phiên bản nguồn: `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03`, lấy ngày 28/10/2026. Bản tra cứu local nằm trong `work/ui-ux-pro-max-skill/` (được Git bỏ qua).
- Đã đọc SKILL.md, `references/quick-reference.md` và phạm vi áp dụng của `references/pro-rules.md`; dùng hướng dẫn web, không coi quy tắc native mobile là tiêu chuẩn web.
- Đã chạy bộ sinh thiết kế với truy vấn `B2B logistics SaaS`, density 3, motion 4. Kết quả: Hero + Features + CTA, Glassmorphism, giao diện SaaS sáng, khoảng cách rộng và chuyển động vừa phải. Tra cứu product khớp SaaS (General) và Logistics/Delivery.
- Đã tra cứu riêng `focus not obscured`, `chip badge label wraps` trong UX và `keyboard focus cleanup` cho React; kết quả React áp dụng cho 19.2.x, phù hợp dependency hiện tại.

## Quyết định áp dụng

Giữ các lựa chọn người dùng đã chốt: bảng màu cyan–xanh–tím, nền trắng xen kẽ nền màu nhạt, video hero rõ ở bên phải, lớp phủ tối phía sau chữ, header kính mờ và gradient khi cuộn. Không thay sang CTA cam do bộ sinh đề xuất. Giữ Segoe UI/Arial hỗ trợ tiếng Việt và không thêm lượt tải font.

| Phần | Quy tắc áp dụng |
| --- | --- |
| Toàn trang | Token dùng chung cho khoảng cách, bán kính, bóng, màu chức năng; vùng bấm đủ lớn; chữ dài xuống dòng; offset focus theo header. |
| Header | Kính mờ có độ phủ đủ đọc chữ; menu đóng khi bấm/focus ra ngoài hoặc chọn liên kết; xử lý đổi breakpoint; giữ Escape. |
| Hero | Video muted/autoplay/playsInline; thử phát lại khi canplay/loadeddata hoặc có tương tác. ScrollTrigger đồng bộ phát/dừng với vùng nhìn của ScrollSmoother; dừng khi ẩn tab hoặc bật giảm chuyển động. Không có nút phát/dừng theo yêu cầu người dùng. Server local trả video/mp4 và hỗ trợ HTTP byte ranges. |
| Giải pháp/demo | Khung minh họa dùng kính mờ: nền trắng pha cyan–tím bán trong suốt, blur 18px, viền sáng và bóng mềm; không blur chữ/số. Nhãn trạng thái đầy đủ, metadata tối thiểu 12px, nhóm số liệu xuống dòng khi cần; không đổi số liệu mẫu. |
| Quy trình | Thứ tự hiển thị các bước rồi preview khớp thứ tự DOM. |
| Vai trò/bảng giá/FAQ | Mặt nội dung rõ, giảm blur không cần thiết; đồng bộ bán kính và bóng. |
| Footer | Liên kết có vùng bấm tối thiểu cao 44px. |
| Form | Viền input và focus rõ, màu lỗi độc lập, giữ validation, focus và luồng xác thực hiện có. |
| GSAP | Giảm khoảng dịch chuyển; entrance 450ms và stagger 45ms; giữ cleanup, giảm chuyển động và trạng thái cuối khi chuyển nhanh. |
| Nhân vật logistics | SVG gốc gồm nhân viên đóng kiện, điều phối quét thông tin và người giao hàng bằng xe máy; màu cyan–xanh–tím. GSAP/ScrollTrigger điều khiển theo cuộn, không có vòng lặp liên tục; giảm chuyển động hiển thị hình tĩnh, cleanup khi rời trang. |
| Nhân vật workflow | Năm người có diện mạo riêng: nhân viên kinh doanh tóc bob áo tím, nhân viên kho đội mũ/áo bảo hộ cyan, nữ điều phối đeo tai nghe áo xanh, giao nhận đội mũ bảo hiểm và kế toán tóc xám/đeo kính. Mỗi người có màu da, tư thế và đạo cụ theo bước; animation ngắn chạy theo bước active khi vào vùng nhìn, chuyển nhanh hủy animation cũ, giảm chuyển động giữ hình tĩnh. Đã render ảnh tĩnh đối chiếu đủ 5 nhân vật. |
| Cuộn mượt | GSAP ScrollSmoother 0,8s trên thiết bị dùng chuột; giữ cuộn native trên màn hình cảm ứng, bỏ smoothing khi giảm chuyển động. Header, skip link, thanh tiến độ và dialog nằm ngoài wrapper được transform. Liên kết neo có offset header, quản lý focus và giữ URL/history; dialog tạm dừng cuộn nền nhưng vẫn cuộn được nội dung form. |

## Kiểm tra

- Bộ kiểm thử hiện có: 51/51 đạt, gồm kiểm thử hồi quy MIME/range/HEAD của video. TypeScript check đạt. Build local và framework/SSR đạt.
- Kiểm tra HTTP file video thực tế: video/mp4, 26.529.659 byte, chữ ký ftyp đúng; byte range đầu/cuối trả 206 và đúng kích thước. Chưa xác minh playback trong trình duyệt.
- Đo cặp màu: xanh/trắng 6,22:1; tím/trắng 6,62:1; chữ phụ/trắng 6,22:1; thành công 6,65:1; lỗi 5,96:1; chữ trắng trên cyan header 4,99:1. Viền input/trắng 3,40:1.
- Header kính mờ được tính trên nền trắng: chữ trắng tối thiểu 4,94:1; màu hover sáng tối thiểu 4,68:1 tại các màu dừng đã kiểm tra.
- Các phép tính màu không thay thế audit trên video thực tế hay kiểm tra WCAG toàn trang.
- Chưa xác minh trực quan các kích thước 375/768/1024/1440px, zoom 200%, điều hướng bàn phím và animation trong trình duyệt: phiên làm việc không có browser surface khả dụng. Không coi checklist trực quan là đã đạt.
