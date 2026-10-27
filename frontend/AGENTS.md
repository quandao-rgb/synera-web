# Frontend SYNERA

- Thư mục này chứa giao diện, assets và state phía client.
- Khi yêu cầu chỉ chỉnh UI, giữ nguyên API, payload, IDs, giá trị trạng thái, điều hướng và hành vi nghiệp vụ.
- Không import backend; gọi API hiện có. Chỉ import shared cho hằng số công khai.
- Quy tắc ghi dữ liệu và phân quyền phải tiếp tục được backend xác nhận.
- Xem ../docs/PROJECT-STRUCTURE.md. Chạy npm test và npm run build:render từ gốc khi đổi cấu trúc/import.
