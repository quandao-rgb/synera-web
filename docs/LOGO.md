# Logo chính SYNERA

Nguồn: ảnh logo do chủ dự án cung cấp. Dùng imagegen built-in để tách nền trắng thành PNG RGBA theo ảnh tham chiếu.

Asset: public/assets/brand/synera-logo.png. Component: frontend/components/brand/SyneraLogo.jsx; CSS: app/brand.css. Viewport SVG cắt khoảng trong suốt khi hiển thị. Chữ trên nền tối đổi trắng bằng CSS; biểu tượng giữ màu. Favicon nhúng cùng PNG và hiển thị vùng biểu tượng.

Prompt: remove white/off-white background and empty margins; preserve supplied blue/cyan/violet S ribbon symbol, two circular nodes and angular navy SYNERA lettering; transparent RGBA; no redesign or added text.

Kiểm tra: build:render và check đạt; Chrome ở 375/768/1440 px không tràn ngang; sidebar thu gọn còn biểu tượng 27 px, rộng 68 px; chữ nền tối trắng, biểu tượng giữ màu; console không có error/warn. Không thêm dependency và không đổi logic nghiệp vụ. Ảnh hero mới: public/assets/landing/synera-overview-logo.jpg. Ảnh xem trước: logo-preview-desktop.jpg, logo-preview-mobile.jpg, [ảnh sidebar](../public/assets/landing/synera-overview-logo.jpg).
