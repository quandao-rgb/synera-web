# Nguồn tài nguyên giao diện

Các file được lưu tại `frontend/public/assets/`; giao diện không gọi CDN để tải các ảnh mới trong lúc sử dụng.

| Tài nguyên | Nguồn trực tiếp | Trang nguồn / ghi nhận |
| --- | --- | --- |
| `carriers/grab.png` | [PNG](https://www.grab.com/vn/wp-content/themes/grabsg/public/img/grab_logo_158.png) | [GrabExpress Việt Nam](https://www.grab.com/vn/express/) |
| `carriers/ghn.png` | [PNG](https://cdn.hstatic.net/themes/200000472237/1001423864/14/logo.png?v=2927) | [GHN](https://ghn.vn/) |
| `carriers/ghtk.svg` | [SVG](https://ghtk.vn/assets/logo.svg) | [GHTK](https://ghtk.vn/) |
| `carriers/spx.svg` | [SVG](https://spx.vn/new_static/assets/images/sea-logo.svg) | [SPX](https://spx.vn/vi) |
| `photos/warehouse.jpg` | [Ảnh 1100px](https://images.unsplash.com/photo-1627309366653-2dedc084cdf1?auto=format&fit=crop&w=1100&q=82) | [Jacques Dillies trên Unsplash](https://unsplash.com/photos/warehouse-shelving-with-cardboard-boxes-jcav1COVvOc), [Unsplash License](https://unsplash.com/license) |
| `photos/workspace-tan-binh.png` | File `D:/866273663_2239193449975085_4410060335738410533_n.png` người dùng đính kèm ngày 28/10 | Sao chép nguyên file, dùng cho chi tiết cơ sở và ảnh khối báo cáo theo yêu cầu |
| `products/sp01.svg` … `sp06.svg`, `parcel.svg` | SVG hình học tự tạo trong dự án | Minh họa hàng mẫu; không phải ảnh hàng hóa thực tế |
| `fonts/roboto/*.woff2` | Google Fonts, lưu local | [Roboto](https://fonts.google.com/specimen/Roboto); giấy phép tại `fonts/roboto/OFL.txt` |

Logo hãng là tài sản thương hiệu của các chủ sở hữu tương ứng, dùng để nhận diện đúng dịch vụ mẫu đã có; không mang ý nghĩa SYNERA đã hợp tác hoặc kết nối API với hãng. Giữ nguyên màu và tỷ lệ, không dùng logo thật cho Vận chuyển A/B/C. Logo SYNERA gốc được giữ nguyên.

URL, kích thước file và SHA256 của ảnh tải trong đợt này được ghi ở `.sites-runtime/ui-refresh/asset-provenance.json` để đối chiếu local; file runtime không đưa vào Git.
