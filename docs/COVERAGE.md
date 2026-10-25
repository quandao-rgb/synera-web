# Phạm vi bản đầu

UI v0.2 bổ sung màn Xử lý đơn hàng với bốn hàng đợi, link trạng thái riêng, thu gọn sidebar và tìm kiếm toàn cục mở danh mục/khách kèm bộ lọc. Đây là phần tổ chức trải nghiệm trên nghiệp vụ hiện có; không coi các giới hạn phía dưới là đã được triển khai chỉ vì có giao diện mới.

Không coi prototype này là đã hoàn tất 132 FR. Đây là shortlist do người dựng đề xuất để nhóm xem và điều chỉnh, chưa phải shortlist nghiệp vụ được nhóm phê duyệt.

| Luồng SRS v0.2          | Có thể thử trong prototype                                                                        | Phần chưa triển khai đầy đủ                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| F01 Khởi tạo cơ sở      | Không gian và bộ mẫu riêng theo người dùng                                                        | Onboarding nhiều cơ sở, import dữ liệu                                        |
| F02 Phân quyền          | Identity Sites, hai vai trò demo, API lọc trường, cấp/thu hồi đặt giao                            | Tài khoản nhân viên và membership thực, quản lý phiên/tenant nhiều cơ sở      |
| F03 Danh mục/quy cách   | Xem, tìm hàng, quy cách một thùng/một kiện                                                        | CRUD, phiên bản quy cách và snapshot khi thay danh mục                        |
| F04 Hồ sơ khách         | Xem/tìm, chu kỳ mẫu, ghi kết quả liên hệ                                                          | CRUD, lịch chăm sóc có ngày hẹn và lịch sử đầy đủ                             |
| F05 Tồn/giữ/kiểm kê     | Giữ khi xác nhận đơn; xuất khi bàn giao; yêu cầu và chủ duyệt kiểm kê                             | Lô/vị trí kho, chứng từ, phân bổ đồng thời nhiều nhân viên                    |
| F06 Nhập hàng           | Chủ lập kế hoạch và nhận một phần; hàng lỗi cách ly                                               | Phiếu mua đầy đủ, nhà cung cấp, kho nhận theo quyền, duyệt/hủy chứng từ       |
| F07 Bổ sung             | Tính và giải thích công thức nháp; xác nhận kế hoạch                                              | MOQ, lead time, dung tích kho, tối ưu thuật toán D03                          |
| F08 Mua lại             | Chu kỳ nhập giả từ số đơn riêng; kết quả liên hệ không tạo đơn                                    | Tính chu kỳ từ lịch sử thật, nhắc theo lịch, thuật toán D04                   |
| F09 Đơn bán             | Chủ chọn khách/hàng/số lượng; gợi ý tự cập nhật; xác nhận giữ hàng; hủy trước đặt giao            | Draft, sửa địa chỉ/hàng sau xác nhận, toàn bộ trạng thái hủy                  |
| F10 Giao từng phần      | Hiển thị phân bổ đủ một lần giao                                                                  | Nhiều fulfillment, giao thiếu, hủy phần còn lại                               |
| F11 Xác nhận kiện       | Chuẩn một chạm; khác chuẩn sửa từng kiện + lý do; giá cũ không dùng được                          | Tách/gộp kiện và quy tắc đóng phức tạp                                        |
| F12 Gợi ý giao          | Lọc chất lỏng, vùng, tải và cạnh kiện theo giả định; thiếu dữ liệu thì loại; phí/nguồn/hạn/mẫu số | Điều kiện hãng thực, hàng dễ vỡ, hợp đồng/COD đặc thù, tối ưu đa tiêu chí D05 |
| F13 Đặt/timeout         | Quyền hiện tại, kiện xác nhận, giá hết hạn; timeout → kiểm tra vận đơn cũ                         | Idempotency key API hãng, phục hồi lỗi mạng thật, mặc định theo khách         |
| F14 Theo dõi            | Bàn giao xuất kho một lần; trang người nhận có token, hết hạn/thu hồi; che điện thoại             | Webhook trùng/ngược thứ tự, liên kết công khai ngoài Site riêng tư            |
| F15 Hoàn                | Hãng báo hoàn chưa nhập kho; chủ nhận thực và chọn tốt/cách ly                                    | Kiểm tra từng phần, giao bù, kho thực hiện theo phân quyền                    |
| F16–F17 Bằng chứng      | Trình bày tỷ lệ theo nhóm và kỳ; thiếu mẫu ghi rõ; nguồn chưa xác minh                            | Bộ nhận sự kiện, kiểm chứng dữ liệu, đánh giá và tái gợi ý thực               |
| F18 Phí                 | Lưu snapshot giá giao khi đặt; hiển thị phí tách tiền hàng                                        | Nhập sao kê, phí thực thu, khiếu nại và giải quyết chênh lệch                 |
| F19 Công nợ/COD         | Màn hình phân tách tiền hàng, hãng giữ và tiền về                                                 | Sổ tiền, đối soát, thu/chi, hoàn tiền thật                                    |
| F20 Công việc/thông báo | Chuyển từ gợi ý sang công việc; trang người nhận riêng                                            | Push/SMS/Zalo, giao việc, thông báo sự kiện thực                              |
| F21 Báo cáo             | Trạng thái bộ mẫu, bằng chứng, audit các thao tác trong demo                                      | Export, báo cáo pilot và KPI từ dữ liệu vận hành thật                         |
| F22 Bảng giá/gói        | Nêu Free/Pro/hoa hồng chưa chốt                                                                   | Mua gói, hợp đồng riêng, thanh toán thuê bao                                  |
| F23 Hỗ trợ/rời hệ thống | Giải thích phạm vi, xử lý lỗi và thử lại                                                          | SLA, support case, export/rời hệ thống đầy đủ                                 |

## Các quyết định không tự chốt

Giữ D24: kho không nhận tiền hàng, COD, giảm giá, công nợ hay giá trị khai báo. BG01/BG02 chỉ là đề xuất bàn giao; chưa áp dụng. D01/D02/D03–D05/D08/D09/D27 cần nhóm quyết định trước khi nâng từ prototype lên pilot.

Không import tài khoản/dữ liệu thật từ Sapo. Không sửa hệ thống Sapo live. Ngôn ngữ và thao tác quản trị kế thừa base Sapo; tầng giao diện/domain đã được tổ chức lại riêng để phù hợp SYNERA.
