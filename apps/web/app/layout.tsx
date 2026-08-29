import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Short Links | URL Shortener",
  description: "Create short links instantly with powerful analytics",
  openGraph: {
    title: "Short Links | URL Shortener",
    description: "Create short links instantly with powerful analytics",
    type: "website",
  },
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
