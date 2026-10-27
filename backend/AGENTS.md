# Backend SYNERA

- Chứa API, xác thực, lưu dữ liệu và kiểm tra nghiệp vụ có thẩm quyền.
- Không sửa nghiệp vụ khi yêu cầu chỉ chỉnh giao diện hoặc chuyển thư mục.
- Giữ quyền, validation, CAS/version, session và các chuyển trạng thái hiện có.
- Không import frontend. Không đưa credential hoặc dữ liệu riêng tư vào shared/public.
- Không xóa/reset .data khi tổ chức source. Chạy npm test và npm run check từ gốc khi thay đổi backend.
