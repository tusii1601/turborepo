import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | URL Shortener",
  description: "Admin panel for system management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
