import type { Metadata } from "next";
import "./synera.css";
import "./admin-layout.css";
import "./motion.css";
import "./line-sidebar.css";
import "./stepper.css";
import "./swipe-toast.css";
import "./glide-select.css";
import "./shipping-recommendation.css";

export const metadata: Metadata = {
  title: "SYNERA — Không gian vận hành",
  description:
    "Quản lý đơn hàng, kho, khách hàng và giao nhận.",
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
