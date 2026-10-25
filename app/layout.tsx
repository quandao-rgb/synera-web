import type { Metadata } from "next";
import "./synera.css";
import "./admin-layout.css";

export const metadata: Metadata = {
  title: "SYNERA — Không gian vận hành",
  description:
    "Kho, khách hàng và giao nhận trong cùng một nhịp vận hành. Prototype dữ liệu minh họa.",
  icons: {
    icon: "/favicon-synera.svg",
    shortcut: "/favicon-synera.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
