# Nguồn các khối landing

Đối chiếu các link 21st được yêu cầu; phần công khai của 21st chỉ cung cấp ví dụ Usage, vì vậy lấy đầy đủ mã và dependency nội bộ từ repository OSS chính thức [tailark/blocks](https://github.com/tailark/blocks), không lấy Usage.tsx làm component.

Phiên bản cố định: `8139698115c1341bfd2e3e286c04bb4d8146f472`. Tác giả: meschacirung / Irung. MIT, Copyright (c) 2025 Irung. Giữ nguyên thông báo trong `vendor/tailark/LICENSE.md`; bản gốc và cây import nằm tại `vendor/tailark/manifest.json`. Không chạy script từ repo upstream.

Tiền tố đường dẫn trong repo upstream: `registry/bases/radix/mist/blocks/`.

| Yêu cầu ban đầu | Bản OSS sử dụng | File tích hợp | Thay đổi chính |
| --- | --- | --- | --- |
| [Hero Section 1](https://21st.dev/@meschacirung/components/hero-section-1) | [hero-section/one/hero-section.tsx + header.tsx](https://github.com/tailark/blocks/tree/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/mist/blocks/hero-section/one) | `HeroSection.jsx` | Header tài khoản thật, menu SYNERA, split 45/55, navy, ảnh ứng dụng thật. Bỏ logo đối tác mẫu, gradient và ảnh Tailark. |
| [Features 2](https://21st.dev/@meschacirung/components/features-2) | [features/two.tsx](https://github.com/tailark/blocks/blob/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/mist/blocks/features/two.tsx) | `Features.jsx` | Đổi các thẻ feature thành ba tab có khung lớn ổn định, tên/mô tả/hình thay cùng nhau; bỏ testimonial mẫu. |
| [Content Section](https://21st.dev/@meschacirung/components/content-2) | [content/two.tsx](https://github.com/tailark/blocks/blob/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/mist/blocks/content/two.tsx) | `ContentSection.jsx` | Thay editor/scheduling bằng hành trình một đơn ba thùng nước qua năm bước; thêm bối cảnh kết quả giao và hai góc nhìn chủ/kho theo brief. |
| [Pricing Base](https://21st.dev/@meschacirung/components/pricing-base) | [pricing/two.tsx](https://github.com/tailark/blocks/blob/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/mist/blocks/pricing/two.tsx) | `Pricing.jsx` | Bản OSS tương đương Free/Pro/Pro Plus thu gọn Free/Pro; không giữ giá USD mẫu. Pro liên hệ email thật, cước tính riêng. |
| [FAQs Component](https://21st.dev/@meschacirung/components/faqs-component) | [faqs/one.tsx](https://github.com/tailark/blocks/blob/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/mist/blocks/faqs/one.tsx) | `FAQs.jsx` | Năm câu SYNERA, accordion native details/summary hỗ trợ phím; bỏ nội dung vận chuyển/thanh toán của template. |
| [Call To Action](https://21st.dev/@meschacirung/components/call-to-action) | [call-to-action/one.tsx](https://github.com/tailark/blocks/blob/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/mist/blocks/call-to-action/one.tsx) | `CallToAction.jsx` | Nội dung SYNERA, đăng ký thật và neo demo. |
| [Footer Two](https://21st.dev/@meschacirung/components/footer-2) | [footer/two.tsx](https://github.com/tailark/blocks/blob/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/mist/blocks/footer/two.tsx) | `Footer.jsx` | Nhóm Sản phẩm/Hỗ trợ/Liên hệ, email và điện thoại đã được cung cấp; bỏ social/policy link không có thật. |

Các file tích hợp ở `components/landing/`. Bản gốc đầy đủ 18 file (7 block và dependency cục bộ) giữ nguyên dạng `.source.txt`. Bao gồm header/logo, button/card, accordion, toggle/group, utils và SVG brand upstream; các SVG brand upstream chỉ được lưu trong snapshot, không sử dụng trong landing SYNERA.

Đã đọc registry `_registry.ts`, code đầy đủ/imports và preview OSS. Tài liệu: [Tailark](https://tailark.com/docs), [OSS registry](https://oss.tailark.com/). Trang registry index được trang chính liên kết trả 404 ở thời điểm lấy; chuyển sang repo chính thức, không dò endpoint bằng cách đoán tên.

Dependency upstream gồm Next Link/Image, React, lucide, Radix, cva, clsx, tailwind-merge. Bản cá nhân hóa dùng JSX, link/img/native dialog/details, React và lucide đã cài; CSS scoped thay utility Tailwind; không thêm package upstream chưa sử dụng, không đổi framework/package manager.

Ảnh hero là ảnh chụp ứng dụng SYNERA đã có, không phải ảnh dashboard Tailark hay bản redesign đã bị loại. Những khung sản phẩm còn lại dựng từ dữ liệu SYNERA minh họa bằng React/CSS và được ghi rõ “Minh họa”. Không dùng logo khách hàng, ảnh stock, số liệu chứng minh hay lời chứng thực bên ngoài.
