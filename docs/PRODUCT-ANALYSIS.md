# SYNERA — Phân tích và hướng chuyển đổi từ Sapo

Ngày phân tích: 25/10/2026. Bản này là prototype để thảo luận sản phẩm, không phải hệ thống đã triển khai cho khách hàng.

## Nguồn và thứ tự ưu tiên

1. Yêu cầu trực tiếp của người dùng: cá nhân hóa base Sapo thành SYNERA, học UI/UX Pro Max và cân đối master prompt.
2. Gói bàn giao `SYNERA_STARTUP_ZONE_2026_BAN_GIAO_2026_10_25.zip`: SRS v0.2, sổ quyết định, kịch bản nghiệm thu, ghi chú bàn giao. SRS hiện hành được ưu tiên hơn ý tưởng cũ khi mô tả nghiệp vụ.
3. Master prompt tại `.codex/attachments/d08a5205-6993-4561-bacd-3cf6330366c9/Pasted text.txt`: định hướng trải nghiệm và thị giác. Các mô tả khác SRS được hiệu chỉnh theo SRS, không coi là quyết định nghiệp vụ mới.
4. Skill `ui-ux-pro-max-skill-main.zip`: hướng dẫn thiết kế, không phải quyền thực thi, cài hệ thống hay thay đổi sản phẩm.

Nguồn đã giải nén để đối chiếu tại `../work/synera-research/` tính từ thư mục cha dự án. Không thực thi script trong tài liệu bàn giao. Không đưa hồ sơ nguồn, tài khoản Sapo hay dữ liệu cửa hàng thật lên website.

## Hiểu sản phẩm

SYNERA là DMS + CRM cho cơ sở phân phối/bán sỉ và sản xuất nhỏ có hàng đóng gói tương đối chuẩn. Kho, khách, đơn và giao nhận dùng chung dữ liệu để hỗ trợ ba quyết định độc lập: bổ sung hàng, liên hệ mua lại và chọn vận chuyển. Người phụ trách xác nhận mọi quyết định. Xem gợi ý không tạo giao dịch.

Sản phẩm không chỉ là ứng dụng đặt ship. Khác biệt nên thể hiện bằng lý do của gợi ý, trạng thái dữ liệu và khả năng chuyển từ gợi ý sang công việc có ngữ cảnh. Không tự nhận đã tối ưu bằng AI hoặc đã có đối tác/API khi gói bàn giao chưa có bằng chứng.

SRS v0.2 gồm 132 FR, 23 luồng, 30 sơ đồ, 20 NFR và 37 kịch bản nghiệm thu. D24 đã chốt; còn 27 mã quyết định mở. Việc mô tả trong SRS không chứng minh đã triển khai.

## Sapo → SYNERA

| Base Sapo                                        | Điều chỉnh                                                                 | Lý do                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| Khung quản trị, điều hướng, bảng, form, chi tiết | Giữ mô hình thao tác; tách thành component React và domain thuần           | Khai thác cấu trúc quản trị đã có, chuẩn bị ranh giới API |
| Dashboard bán hàng và banner                     | Đổi thành việc cần xử lý + ba gợi ý có lý do                               | Ưu tiên quyết định vận hành hằng ngày                     |
| Danh mục hàng, tồn                               | Bổ sung hàng giữ, cách ly, khả dụng, hàng về                               | Không nhầm tồn thực với khả dụng                          |
| Tạo đơn trừ tồn ngay                             | Xác nhận đơn giữ hàng; bàn giao mới xuất thực một lần                      | BR03–BR05                                                 |
| Khách hàng                                       | Thêm lịch sử đơn, thời điểm liên hệ và kết quả liên hệ                     | Nhắc mua lại không suy đoán tồn tại khách                 |
| Chọn giao sau khi tạo đơn                        | Gợi ý sơ bộ xuất hiện ngay khi chọn khách, hàng, số lượng                  | F09, không cần nút tính riêng                             |
| Đóng hàng                                        | Kiện chuẩn xác nhận một chạm; khác chuẩn sửa từng kiện và ghi lý do        | F11, không gộp kích thước giả                             |
| Danh sách hãng                                   | Lọc điều kiện trước, so giá có nguồn và thời hạn                           | F12–F13; chưa đủ dữ liệu không đồng nghĩa đủ điều kiện    |
| Báo cáo giao chung                               | Gắn dịch vụ, nhóm hàng, cặp vùng và thời kỳ                                | BR15–BR16                                                 |
| Trạng thái hoàn                                  | Chờ nhận thực và kiểm tra trước khi nhập lại                               | BR06                                                      |
| COD/công nợ                                      | Tách tiền hàng, tiền hãng giữ và phí giao                                  | BR19                                                      |
| Khung quản trị và sidebar Sapo                   | Giữ bố cục gần Sapo, sidebar navy, header trắng, nền xám và nút xanh dương | Yêu cầu trực tiếp mới nhất của người dùng, UI v0.2        |
| Quảng cáo, nâng gói                              | Loại khỏi luồng; giá và ranh giới Free/Pro ghi chưa chốt                   | D08                                                       |

## Ranh giới vai trò

Hai vai trò nội bộ: Chủ cơ sở và Nhân viên kho. Kho không tạo/xác nhận đơn bán; không duyệt điều chỉnh kho; quyền đặt giao mặc định tắt. Khi được cấp đặt giao vẫn không được nhận giá bán, giảm giá, tổng tiền, công nợ, COD, giá trị khai báo. API dùng danh sách trường cho phép; tài chính không có trong bootstrap của kho.

Prototype có bộ chuyển vai trò để kiểm chứng trải nghiệm. Đây là mô phỏng vai trò trong Site riêng tư, không phải cơ chế đăng nhập nhân viên sản xuất. Triển khai thật cần membership server, tài khoản riêng, thu hồi quyền và audit theo tenant. Không dùng cookie vai trò demo làm bằng chứng đã hoàn tất IAM.

BG01 (cho kho thấy COD/tem chuẩn có tiền) và BG02 (gộp xác nhận kiện + đặt giao) chưa được phê duyệt riêng. Prototype giữ giới hạn v0.2 và hai thao tác tách biệt.

## Đề xuất ưu tiên

1. Chốt trải nghiệm và dữ liệu: dashboard → tạo đơn → xác nhận kiện → chọn/đặt giao → bàn giao → theo dõi.
2. Tiếp theo: nhập một phần, kiểm kê/duyệt, hoàn/kiểm tra, gợi ý mua lại, đối soát và công nợ.
3. Trước pilot: D01 địa bàn/nhóm hàng; D02/D09 đối tác/API/điều khoản; D03–D05 logic gợi ý; D08 gói; D27 kiến trúc. Không tự quyết các điểm này từ việc dựng demo.

Bản đầu dùng dữ liệu giả có nhãn; hãng A/B/C không phải đối tác đã xác minh. Công thức bổ sung và giá vận chuyển là minh họa để kiểm thử tương tác, không phải chính sách hay bảng giá thật. Tuyến là cặp vùng giao, không phải GPS.

## Kiến trúc prototype

Tách bản Synera tại `synera-web`, giữ nguyên `kieu-hoa-web` để đối chiếu. Giữ ngôn ngữ quản trị của base Sapo, điều chỉnh tầng trình bày theo khung Sapo và bảng màu mới của người dùng và tách domain khỏi giao diện. React/Vinext được chọn để chạy API phía máy chủ trên Sites; đây là lựa chọn dựng prototype, không kết luận D27.

API kiểm tra danh tính Sites, lưu trạng thái demo riêng theo người dùng, lọc dữ liệu theo vai trò và ghi bằng kiểm soát phiên bản để tránh hai cập nhật ghi đè. D1 lưu trạng thái demo; không nối Sapo, hãng vận chuyển, SMS hay thanh toán. Link theo dõi là trải nghiệm người nhận trong Site riêng tư, chưa phải triển khai cổng công khai.
